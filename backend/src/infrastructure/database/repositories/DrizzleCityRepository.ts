import { eq, like, sql, and } from 'drizzle-orm'
import { DatabaseConnection } from '../connection.js'
import { cities } from '../schema/cities.js'
import { ICityRepository } from '../../../domain/repositories/ICityRepository.js'
import { City, NewCity } from '../../../domain/entities/City.js'

export class DrizzleCityRepository implements ICityRepository {
    constructor(private db: DatabaseConnection) {}

    async findByName(name: string): Promise<City[]> {
        const results = await this.db
            .select()
            .from(cities)
            .where(like(cities.name, `%${name}%`))
            .limit(10)

        return results.map(this.mapToEntity)
    }

    async findById(id: string): Promise<City | null> {
        const results = await this.db
            .select()
            .from(cities)
            .where(eq(cities.id, id))
            .limit(1)

        return results.length > 0 ? this.mapToEntity(results[0]) : null
    }

    async findByCoordinates(
        latitude: number,
        longitude: number,
        radius: number = 0.1
    ): Promise<City | null> {
        const results = await this.db
            .select()
            .from(cities)
            .where(
                and(
                    sql`ABS(${cities.latitude} - ${latitude}) < ${radius}`,
                    sql`ABS(${cities.longitude} - ${longitude}) < ${radius}`
                )
            )
            .limit(1)

        return results.length > 0 ? this.mapToEntity(results[0]) : null
    }

    async save(city: NewCity): Promise<City> {
        const [result] = await this.db
            .insert(cities)
            .values({
                ...city,
                searchCount: 0,
            })
            .returning()

        return this.mapToEntity(result)
    }

    async incrementSearchCount(cityId: string): Promise<void> {
        await this.db
            .update(cities)
            .set({
                searchCount: sql`${cities.searchCount} + 1`,
                updatedAt: new Date(),
            })
            .where(eq(cities.id, cityId))
    }

    private mapToEntity(record: any): City {
        return {
            id: record.id,
            name: record.name,
            country: record.country,
            latitude: record.latitude,
            longitude: record.longitude,
            timezone: record.timezone,
            searchCount: record.searchCount,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        }
    }
}
