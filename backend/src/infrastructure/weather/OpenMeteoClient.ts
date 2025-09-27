interface OpenMeteoResponse {
    daily: {
        time: string[]
        temperature_2m_max: number[]
        temperature_2m_min: number[]
        precipitation_sum: number[]
        windspeed_10m_max: number[]
        cloudcover_mean: number[]
        snowfall_sum?: number[]
    }
}

export interface WeatherApiData {
    date: Date
    temperature: number
    windSpeed: number
    precipitation: number
    cloudCover: number
    snowDepth?: number
}

export class OpenMeteoClient {
    private baseUrl = 'https://api.open-meteo.com/v1/forecast'

    async getWeatherForecast(
        latitude: number,
        longitude: number,
        days: number = 7
    ): Promise<WeatherApiData[]> {
        const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            daily: [
                'temperature_2m_max',
                'temperature_2m_min',
                'precipitation_sum',
                'windspeed_10m_max',
                'cloudcover_mean',
                'snowfall_sum',
            ].join(','),
            forecast_days: days.toString(),
            timezone: 'auto',
        })

        const response = await fetch(`${this.baseUrl}?${params}`)

        if (!response.ok) {
            throw new Error(
                `Weather API error: ${response.status} ${response.statusText}`
            )
        }

        const data = (await response.json()) as OpenMeteoResponse
        return this.transformData(data)
    }

    private transformData(data: OpenMeteoResponse): WeatherApiData[] {
        const { daily } = data
        const results: WeatherApiData[] = []

        for (let i = 0; i < daily.time.length; i++) {
            const avgTemp =
                (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2

            results.push({
                date: new Date(daily.time[i]),
                temperature: Math.round(avgTemp * 10) / 10,
                windSpeed: Math.round(daily.windspeed_10m_max[i] * 10) / 10,
                precipitation: Math.round(daily.precipitation_sum[i] * 10) / 10,
                cloudCover: Math.round(daily.cloudcover_mean[i] * 10) / 10,
                snowDepth: daily.snowfall_sum?.[i]
                    ? Math.round(daily.snowfall_sum[i] * 10) / 10
                    : undefined,
            })
        }

        return results
    }
}
