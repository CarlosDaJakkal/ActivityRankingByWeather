export interface WeatherSnapshot {
    id: string
    cityId: string
    date: Date
    temperature: number
    windSpeed: number
    precipitation: number
    cloudCover: number
    snowDepth?: number
    waveHeight?: number
    createdAt: Date
    expiresAt: Date
}

export interface NewWeatherSnapshot {
    cityId: string
    date: Date
    temperature: number
    windSpeed: number
    precipitation: number
    cloudCover: number
    snowDepth?: number
    waveHeight?: number
    expiresAt: Date
}
