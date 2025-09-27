import { useMemo } from 'react'
import {
    Cloud,
    CloudRain,
    Sun,
    CloudSnow,
    Wind,
    Droplets,
    Snowflake,
} from 'lucide-react'

interface WeatherDay {
    date: string
    temperature: number
    windSpeed: number
    precipitation: number
    cloudCover: number
    snowDepth?: number
    waveHeight?: number
}

interface Props {
    weather: WeatherDay[]
    cityName: string
}

export function WeatherSummary({ weather, cityName }: Props) {
    const WEATHER_ICON_CONDITIONS = [
        {
            condition: (day: WeatherDay) => day.precipitation > 5,
            icon: CloudRain,
            className: 'w-8 h-8 text-blue-500',
        },
        {
            condition: (day: WeatherDay) => day.snowDepth && day.snowDepth > 0,
            icon: CloudSnow,
            className: 'w-8 h-8 text-blue-300',
        },
        {
            condition: (day: WeatherDay) => day.cloudCover > 70,
            icon: Cloud,
            className: 'w-8 h-8 text-gray-500',
        },
        {
            condition: (day: WeatherDay) => day.cloudCover < 30,
            icon: Sun,
            className: 'w-8 h-8 text-yellow-500',
        },
    ]

    const getWeatherIcon = (day: WeatherDay) => {
        const iconConfig = WEATHER_ICON_CONDITIONS.find(config =>
            config.condition(day)
        )

        if (iconConfig) {
            const IconComponent = iconConfig.icon
            return <IconComponent className={iconConfig.className} />
        }

        return <Cloud className="w-8 h-8 text-gray-400" />
    }

    const processedWeatherData = useMemo(() => {
        return weather.slice(0, 7).map(day => {
            const date = new Date(day.date)
            return {
                ...day,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                monthDay: date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                }),
                icon: getWeatherIcon(day),
                roundedTemp: Math.round(day.temperature),
                roundedWind: Math.round(day.windSpeed),
                hasPrecipitation: day.precipitation > 0,
                hasSnow: day.snowDepth && day.snowDepth > 0,
            }
        })
    }, [weather])

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
                7-Day Weather Forecast for {cityName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                {processedWeatherData.map(day => (
                    <div
                        key={day.date}
                        className="bg-gray-50 rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
                    >
                        <div className="text-center mb-2">
                            <p className="font-semibold text-gray-900 text-sm">
                                {day.dayName}
                            </p>
                            <p className="text-xs text-gray-500">
                                {day.monthDay}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                            <div className="flex justify-center">
                                {day.icon}
                            </div>

                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">
                                    {day.roundedTemp}°
                                </p>
                                <p className="text-xs text-gray-500">°C</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 flex items-center">
                                    <Wind className="w-4 h-4 mr-1" />
                                    Wind
                                </span>
                                <span className="font-medium text-gray-900">
                                    {day.roundedWind} km/h
                                </span>
                            </div>

                            {day.hasPrecipitation && (
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-600 flex items-center">
                                        <Droplets className="w-4 h-4 mr-1" />
                                        Rain
                                    </span>
                                    <span className="font-medium text-blue-600">
                                        {day.precipitation}mm
                                    </span>
                                </div>
                            )}

                            {day.hasSnow && (
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-400 flex items-center">
                                        <Snowflake className="w-4 h-4 mr-1" />
                                        Snow
                                    </span>
                                    <span className="font-medium text-blue-400">
                                        {day.snowDepth}cm
                                    </span>
                                </div>
                            )}

                            {!day.hasPrecipitation && !day.hasSnow && (
                                <div className="flex items-center justify-center py-1">
                                    <span className="text-xs text-gray-400">
                                        No precipitation
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
