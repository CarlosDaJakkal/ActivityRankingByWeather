import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLazyQuery } from '@apollo/client/react'
import { SEARCH_CITIES } from '../../graphql/queries/searchCities'
import type { SearchCitiesQuery, City } from '../../graphql/types'
import { Search, X } from 'lucide-react'

const searchSchema = z.object({
    cityName: z
        .string()
        .min(2, 'City name must be at least 2 characters')
        .max(100, 'City name too long')
        .regex(/^[a-zA-Z\s,.-]+$/, 'City name contains invalid characters')
        .trim(),
})

type SearchFormData = z.infer<typeof searchSchema>


interface Props {
    onCitySelect: (city: City) => void
}

export function CitySearchInput({ onCitySelect }: Props) {
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        watch,
        formState: { errors, isValidating },
        setValue,
        trigger,
    } = useForm<SearchFormData>({
        resolver: zodResolver(searchSchema),
        mode: 'onChange',
        defaultValues: {
            cityName: ''
        }
    })

    const [searchCities, { data, loading }] = useLazyQuery<SearchCitiesQuery>(SEARCH_CITIES)

    const cityName = watch('cityName')
    const { ref, ...registerProps } = register('cityName')

    useEffect(() => {
        if (cityName && cityName.length > 2) {
            const timer = setTimeout(async () => {
                const isValid = await trigger('cityName')
                if (isValid) {
                    searchCities({ variables: { query: cityName } })
                    setShowSuggestions(true)
                }
            }, 300)
            return () => clearTimeout(timer)
        } else {
            setShowSuggestions(false)
        }
    }, [cityName, searchCities, trigger])

    const handleCitySelect = (city: City) => {
        setValue('cityName', `${city.name}, ${city.country}`)
        setShowSuggestions(false)
        onCitySelect(city)
    }

    const handleInputBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false)
        }, 150)
    }

    const handleInputFocus = () => {
        if (cityName && cityName.length > 2 && data?.searchCities && data.searchCities.length > 0) {
            setShowSuggestions(true)
        }
    }

    const handleClear = () => {
        setValue('cityName', '')
        setShowSuggestions(false)
        inputRef.current?.focus()
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <input
                    {...registerProps}
                    ref={e => {
                        ref(e)
                        inputRef.current = e
                    }}
                    type="text"
                    placeholder="Enter city name..."
                    onBlur={handleInputBlur}
                    onFocus={handleInputFocus}
                    className={`
                        w-full px-4 py-3 pl-10 pr-10
                        text-gray-900 placeholder-gray-500
                        border rounded-lg shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${errors.cityName ? 'border-red-300' : 'border-gray-300'}
                    `}
                />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>

                {(loading || isValidating) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {!loading && !isValidating && cityName && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg"
                    >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>

            {errors.cityName && (
                <p className="mt-1 text-sm text-red-600">
                    {errors.cityName.message}
                </p>
            )}

            {showSuggestions &&
                data?.searchCities &&
                data.searchCities.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {data.searchCities.map((city: City, index) => (
                            <button
                                key={index}
                                onClick={() => handleCitySelect(city)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">
                                    {city.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {city.country}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

            {showSuggestions &&
                data?.searchCities &&
                data.searchCities.length === 0 &&
                !loading && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                        <p className="text-gray-500 text-center">
                            No cities found
                        </p>
                    </div>
                )}
        </div>
    )
}
