import { GetCityRankingsUseCase } from '../../../application/use-cases/GetCityRankingsUseCase.js'
import { SearchCitiesUseCase } from '../../../application/use-cases/SearchCitiesUseCase.js'
import {
    CityRankingRequestSchema,
    SearchCitiesRequestSchema,
} from '../../../application/dto/CityRankingDto.js'

interface Context {
    getCityRankingsUseCase: GetCityRankingsUseCase
    searchCitiesUseCase: SearchCitiesUseCase
}

export const resolvers = {
    Query: {
        searchCities: async (
            _parent: any,
            args: { query: string },
            context: Context
        ) => {
            const { query } = SearchCitiesRequestSchema.parse(args)

            const cities = await context.searchCitiesUseCase.execute(query)
            return cities
        },

        getCityRankings: async (
            _parent: any,
            args: { cityName: string },
            context: Context
        ) => {
            const { cityName } = CityRankingRequestSchema.parse(args)

            const ranking =
                await context.getCityRankingsUseCase.execute(cityName)
            return ranking
        },
    },

    CityRanking: {
        generatedAt: (parent: any) => parent.generatedAt.toISOString(),
    },

    WeatherDay: {
        date: (parent: any) => parent.date.toISOString().split('T')[0],
    },
}
