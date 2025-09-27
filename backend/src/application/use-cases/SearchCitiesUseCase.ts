import { ICityRepository } from '../../domain/repositories/ICityRepository.js'
import { City, NewCity } from '../../domain/entities/City.js'

interface GeocodingResult {
    name: string
    country: string
    latitude: number
    longitude: number
    timezone: string
}

export class SearchCitiesUseCase {
    constructor(private cityRepository: ICityRepository) {}

    async execute(query: string): Promise<City[]> {
        const existingCities = await this.cityRepository.findByName(query)

        if (existingCities.length > 0) {
            return existingCities
        }

        try {
            const geocodingResults = await this.geocodeCity(query)

            const savedCities: City[] = []
            for (const result of geocodingResults) {
                const existing = await this.cityRepository.findByCoordinates(
                    result.latitude,
                    result.longitude,
                    0.1
                )

                if (!existing) {
                    const newCity: NewCity = {
                        name: result.name,
                        country: result.country,
                        latitude: result.latitude,
                        longitude: result.longitude,
                        timezone: result.timezone,
                    }

                    const saved = await this.cityRepository.save(newCity)
                    savedCities.push(saved)
                } else {
                    savedCities.push(existing)
                }
            }

            return savedCities
        } catch (error) {
            console.error('Geocoding error:', error)
            return []
        }
    }

    private async geocodeCity(query: string): Promise<GeocodingResult[]> {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        )

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`)
        }

        const data = (await response.json()) as {
            results?: Array<{
                name: string
                country?: string
                latitude: number
                longitude: number
                timezone?: string
            }>
        }

        if (!data.results || data.results.length === 0) {
            return []
        }

        return data.results.map(result => ({
            name: result.name,
            country: result.country || 'Unknown',
            latitude: result.latitude,
            longitude: result.longitude,
            timezone: result.timezone || 'UTC',
        }))
    }
}
