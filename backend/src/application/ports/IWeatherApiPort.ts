export interface WeatherApiData {
    date: Date
    temperature: number
    windSpeed: number
    precipitation: number
    cloudCover: number
    snowDepth?: number
    waveHeight?: number
}

export interface IWeatherApiPort {
    getWeatherForecast(
        latitude: number,
        longitude: number,
        days?: number
    ): Promise<WeatherApiData[]>
}
