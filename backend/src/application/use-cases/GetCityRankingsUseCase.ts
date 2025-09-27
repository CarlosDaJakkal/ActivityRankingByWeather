import { ICityRepository } from '../../domain/repositories/ICityRepository.js'
import { IWeatherRepository } from '../../domain/repositories/IWeatherRepository.js'
import { IWeatherApiPort } from '../ports/IWeatherApiPort.js'
import { ActivityScoringService } from '../../domain/services/ActivityScoringService.js'
import { CityRanking } from '../../domain/entities/Ranking.js'
import { NewWeatherSnapshot } from '../../domain/entities/WeatherData.js'

export class GetCityRankingsUseCase {
    constructor(
        private cityRepository: ICityRepository,
        private weatherRepository: IWeatherRepository,
        private weatherApi: IWeatherApiPort,
        private scoringService: ActivityScoringService
    ) {}

    async execute(cityName: string): Promise<CityRanking | null> {
        const cities = await this.cityRepository.findByName(cityName)
        if (cities.length === 0) {
            return null
        }

        const city = cities[0] // Take the first match
        await this.cityRepository.incrementSearchCount(city.id)

        let weatherData = await this.weatherRepository.findFreshWeatherData(
            city.id,
            30
        )

        if (weatherData.length === 0) {
            const apiData = await this.weatherApi.getWeatherForecast(
                city.latitude,
                city.longitude,
                7
            )

            const weatherSnapshots: NewWeatherSnapshot[] = apiData.map(
                data => ({
                    cityId: city.id,
                    date: data.date,
                    temperature: data.temperature,
                    windSpeed: data.windSpeed,
                    precipitation: data.precipitation,
                    cloudCover: data.cloudCover,
                    snowDepth: data.snowDepth,
                    waveHeight: data.waveHeight,
                    expiresAt: new Date(Date.now() + 60 * 60000),
                })
            )

            weatherData =
                await this.weatherRepository.saveMany(weatherSnapshots)
        }

        const activities = this.scoringService.calculateRankings(weatherData)

        return {
            city,
            weather: weatherData,
            activities,
            generatedAt: new Date(),
        }
    }
}
