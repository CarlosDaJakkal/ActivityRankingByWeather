import { gql } from 'graphql-tag'

export const typeDefs = gql`
    type City {
        id: ID!
        name: String!
        country: String!
        latitude: Float!
        longitude: Float!
        timezone: String!
        searchCount: Int!
    }

    type WeatherDay {
        date: String!
        temperature: Float!
        windSpeed: Float!
        precipitation: Float!
        cloudCover: Float!
        snowDepth: Float
        waveHeight: Float
    }

    type ActivityScore {
        score: Float!
        reasoning: String!
        bestDays: [String!]!
    }

    type ActivityRankings {
        skiing: ActivityScore!
        surfing: ActivityScore!
        outdoorSightseeing: ActivityScore!
        indoorSightseeing: ActivityScore!
    }

    type CityRanking {
        city: City!
        weather: [WeatherDay!]!
        activities: ActivityRankings!
        generatedAt: String!
    }

    type Query {
        searchCities(query: String!): [City!]!
        getCityRankings(cityName: String!): CityRanking
    }
`
