import { useState, useOptimistic, useTransition } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './graphql/client'
import { CitySearchInput } from './components/search/CitySearchInput'
import { ActivityCard } from './components/rankings/ActivityCard'
import { WeatherSummary } from './components/rankings/WeatherSummary'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import { ErrorMessage } from './components/common/ErrorMessage'
import { useCityRankings } from './hooks/useCityRankings'
import { CloudSun } from 'lucide-react'
import type { City } from './graphql/types'

function WeatherApp() {
    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const [optimisticCity, addOptimisticCity] = useOptimistic(
        selectedCity,
        (_, newCity: City) => newCity
    )
    const [isPending, startTransition] = useTransition()

    const { city, weather, activities, generatedAt, loading, error, refetch } =
        useCityRankings(selectedCity?.name || null)

    const handleCitySelect = (city: City) => {
        startTransition(() => {
            addOptimisticCity(city)
            setSelectedCity(city)
        })
    }

    const activityConfig = [
        { name: 'Skiing', key: 'skiing' as const },
        { name: 'Surfing', key: 'surfing' as const },
        { name: 'Outdoor Sightseeing', key: 'outdoorSightseeing' as const },
        { name: 'Indoor Sightseeing', key: 'indoorSightseeing' as const },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Weather Activity Rankings
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Find the best activities based on 7-day weather
                            forecasts
                        </p>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <CitySearchInput onCitySelect={handleCitySelect} />
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {(loading || isPending) && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {isPending ? 'Loading city data...' : 'Loading weather data...'}
                            </p>
                            {optimisticCity && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Preparing data for {optimisticCity.name}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="max-w-md mx-auto">
                        <ErrorMessage error={error} onRetry={() => refetch()} />
                    </div>
                )}

                {city && weather && activities && !loading && !isPending && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900 text-shadow-sm">
                                {city.name}, {city.country}
                            </h2>
                            {generatedAt && (
                                <p className="text-xs text-gray-500 mt-1 text-shadow-xs">
                                    Updated:{' '}
                                    {new Date(generatedAt).toLocaleString()}
                                </p>
                            )}
                        </div>

                        <WeatherSummary
                            weather={weather}
                            cityName={city.name}
                        />

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                                Activity Rankings
                            </h3>
                            <div className="@container">
                                <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
                                    {activityConfig.map(({ name, key }) => (
                                        <ActivityCard
                                            key={key}
                                            name={name}
                                            activity={activities[key]}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!selectedCity && !loading && !error && !isPending && (
                    <div className="text-center py-12">
                        <div className="flex justify-center mb-4">
                            <CloudSun className="w-16 h-16 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Start by searching for a city
                        </h2>
                        <p className="text-gray-600">
                            Enter a city name above to see weather-based
                            activity rankings
                        </p>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-center text-sm text-gray-500">
                        <p>Weather data provided by Open-Meteo API</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <WeatherApp />
        </ApolloProvider>
    )
}
