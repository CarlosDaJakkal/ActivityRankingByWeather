import { eq, and, gte, lte, lt } from 'drizzle-orm'
import { DatabaseConnection } from '../connection.js'
import { weatherSnapshots } from '../schema/weatherSnapshots.js'
import { IWeatherRepository } from '../../../domain/repositories/IWeatherRepository.js'
import {
    WeatherSnapshot,
    NewWeatherSnapshot,
} from '../../../domain/entities/WeatherData.js'

export class DrizzleWeatherRepository implements IWeatherRepository {
    constructor(private db: DatabaseConnection) {}

    async findByCityAndDateRange(
        cityId: string,
        startDate: Date,
        endDate: Date
    ): Promise<WeatherSnapshot[]> {
        const results = await this.db
            .select()
            .from(weatherSnapshots)
            .where(
                and(
                    eq(weatherSnapshots.cityId, cityId),
                    gte(weatherSnapshots.date, startDate),
                    lte(weatherSnapshots.date, endDate)
                )
            )
            .orderBy(weatherSnapshots.date)

        return results.map(this.mapToEntity)
    }

    async findFreshWeatherData(
        cityId: string,
        maxAgeMinutes: number
    ): Promise<WeatherSnapshot[]> {
        const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60000)

        const results = await this.db
            .select()
            .from(weatherSnapshots)
            .where(
                and(
                    eq(weatherSnapshots.cityId, cityId),
                    gte(weatherSnapshots.createdAt, cutoffTime)
                )
            )
            .orderBy(weatherSnapshots.date)

        return results.map(this.mapToEntity)
    }

    async save(weather: NewWeatherSnapshot): Promise<WeatherSnapshot> {
        const [result] = await this.db
            .insert(weatherSnapshots)
            .values(weather)
            .returning()

        return this.mapToEntity(result)
    }

    async saveMany(
        weatherList: NewWeatherSnapshot[]
    ): Promise<WeatherSnapshot[]> {
        const results = await this.db
            .insert(weatherSnapshots)
            .values(weatherList)
            .returning()

        return results.map(this.mapToEntity)
    }

    async deleteExpired(): Promise<void> {
        const now = new Date()
        await this.db
            .delete(weatherSnapshots)
            .where(lt(weatherSnapshots.expiresAt, now))
    }

    private mapToEntity(record: any): WeatherSnapshot {
        return {
            id: record.id,
            cityId: record.cityId,
            date: record.date,
            temperature: record.temperature,
            windSpeed: record.windSpeed,
            precipitation: record.precipitation,
            cloudCover: record.cloudCover,
            snowDepth: record.snowDepth,
            waveHeight: record.waveHeight,
            createdAt: record.createdAt,
            expiresAt: record.expiresAt,
        }
    }
}
