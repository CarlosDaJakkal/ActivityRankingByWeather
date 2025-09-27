import { OpenMeteoClient } from './OpenMeteoClient.js'
import {
    IWeatherApiPort,
    WeatherApiData,
} from '../../application/ports/IWeatherApiPort.js'

export class WeatherApiAdapter implements IWeatherApiPort {
    constructor(private client: OpenMeteoClient) {}

    async getWeatherForecast(
        latitude: number,
        longitude: number,
        days: number = 7
    ): Promise<WeatherApiData[]> {
        const data = await this.client.getWeatherForecast(
            latitude,
            longitude,
            days
        )

        return data.map(weather => ({
            ...weather,
            waveHeight: this.estimateWaveHeight(
                weather.windSpeed,
                latitude,
                longitude
            ),
        }))
    }

    private estimateWaveHeight(
        windSpeed: number,
        latitude: number,
        longitude: number
    ): number | undefined {
        const isCoastal = this.isLikelyCoastal(latitude, longitude)

        if (!isCoastal) {
            return undefined
        }

        const estimatedHeight = Math.min(windSpeed * 0.1, 6)
        return estimatedHeight > 0.3
            ? Math.round(estimatedHeight * 10) / 10
            : undefined
    }

    private isLikelyCoastal(latitude: number, longitude: number): boolean {
        const coastalCities = [
            { name: 'Miami', lat: 25.7617, lon: -80.1918 },
            { name: 'San Diego', lat: 32.7157, lon: -117.1611 },
            { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
            { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
            { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
        ]

        return coastalCities.some(
            city =>
                Math.abs(city.lat - latitude) < 1 &&
                Math.abs(city.lon - longitude) < 1
        )
    }
}
