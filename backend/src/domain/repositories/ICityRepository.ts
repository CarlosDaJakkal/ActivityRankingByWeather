import { City, NewCity } from '../entities/City.js'

export interface ICityRepository {
    findByName(name: string): Promise<City[]>
    findById(id: string): Promise<City | null>
    findByCoordinates(
        latitude: number,
        longitude: number,
        radius?: number
    ): Promise<City | null>
    save(city: NewCity): Promise<City>
    incrementSearchCount(cityId: string): Promise<void>
}
