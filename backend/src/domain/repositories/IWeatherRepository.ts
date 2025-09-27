import { WeatherSnapshot, NewWeatherSnapshot } from '../entities/WeatherData.js'

export interface IWeatherRepository {
    findByCityAndDateRange(
        cityId: string,
        startDate: Date,
        endDate: Date
    ): Promise<WeatherSnapshot[]>

    findFreshWeatherData(
        cityId: string,
        maxAgeMinutes: number
    ): Promise<WeatherSnapshot[]>

    save(weather: NewWeatherSnapshot): Promise<WeatherSnapshot>

    saveMany(weather: NewWeatherSnapshot[]): Promise<WeatherSnapshot[]>

    deleteExpired(): Promise<void>
}
