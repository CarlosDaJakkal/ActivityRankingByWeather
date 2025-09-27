import express from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import http from 'http'
import cors from 'cors'
import { typeDefs } from './graphql/schema/typeDefs.js'
import { resolvers } from './graphql/resolvers/index.js'
import { formatError } from './middleware/errorHandler.js'
import { db } from '../infrastructure/database/connection.js'
import { DrizzleCityRepository } from '../infrastructure/database/repositories/DrizzleCityRepository.js'
import { DrizzleWeatherRepository } from '../infrastructure/database/repositories/DrizzleWeatherRepository.js'
import { OpenMeteoClient } from '../infrastructure/weather/OpenMeteoClient.js'
import { WeatherApiAdapter } from '../infrastructure/weather/WeatherApiAdapter.js'
import { GetCityRankingsUseCase } from '../application/use-cases/GetCityRankingsUseCase.js'
import { SearchCitiesUseCase } from '../application/use-cases/SearchCitiesUseCase.js'
import { ActivityScoringService } from '../domain/services/ActivityScoringService.js'

async function startServer() {
    const cityRepository = new DrizzleCityRepository(db)
    const weatherRepository = new DrizzleWeatherRepository(db)
    const weatherClient = new OpenMeteoClient()
    const weatherApi = new WeatherApiAdapter(weatherClient)
    const scoringService = new ActivityScoringService()

    const getCityRankingsUseCase = new GetCityRankingsUseCase(
        cityRepository,
        weatherRepository,
        weatherApi,
        scoringService
    )
    const searchCitiesUseCase = new SearchCitiesUseCase(cityRepository)

    const app = express()
    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })

    await server.start()

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin:
                process.env.NODE_ENV === 'production'
                    ? false
                    : 'http://localhost:3000',
        }),
        express.json(),
        expressMiddleware(server, {
            context: async () => ({
                getCityRankingsUseCase,
                searchCitiesUseCase,
            }),
        })
    )

    const PORT = process.env.PORT || 4000

    httpServer.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}/graphql`)
    })
}

startServer().catch(error => {
    console.error('Failed to start server:', error)
    process.exit(1)
})
