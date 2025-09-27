// GraphQL Types for TypeScript
export interface City {
    id: string
    name: string
    country: string
    latitude: number
    longitude: number
}

export interface WeatherData {
    date: string
    temperature: number
    windSpeed: number
    precipitation: number
    cloudCover: number
    snowDepth: number
    waveHeight: number
}

export interface Activity {
    score: number
    reasoning: string
    bestDays: string[]
}

export interface Activities {
    skiing: Activity
    surfing: Activity
    outdoorSightseeing: Activity
    indoorSightseeing: Activity
}

export interface CityRankings {
    city: City
    weather: WeatherData[]
    activities: Activities
    generatedAt: string
}

// Query Response Types
export interface SearchCitiesQuery {
    searchCities: City[]
}

export interface GetCityRankingsQuery {
    getCityRankings: CityRankings
}