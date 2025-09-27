import { useQuery } from '@apollo/client/react'
import { GET_CITY_RANKINGS } from '../graphql/queries/getCityRankings'
import type { GetCityRankingsQuery } from '../graphql/types'

export function useCityRankings(cityName: string | null) {
    const { data, loading, error, refetch } = useQuery<GetCityRankingsQuery>(GET_CITY_RANKINGS, {
        variables: { cityName },
        skip: !cityName,
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
    })

    const ranking = data?.getCityRankings

    return {
        city: ranking?.city,
        weather: ranking?.weather,
        activities: ranking?.activities,
        generatedAt: ranking?.generatedAt,
        loading,
        error,
        refetch,
    }
}
