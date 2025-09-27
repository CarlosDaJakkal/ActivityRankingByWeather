import { gql } from '@apollo/client'

export const GET_CITY_RANKINGS = gql`
    query GetCityRankings($cityName: String!) {
        getCityRankings(cityName: $cityName) {
            city {
                id
                name
                country
                latitude
                longitude
            }
            weather {
                date
                temperature
                windSpeed
                precipitation
                cloudCover
                snowDepth
                waveHeight
            }
            activities {
                skiing {
                    score
                    reasoning
                    bestDays
                }
                surfing {
                    score
                    reasoning
                    bestDays
                }
                outdoorSightseeing {
                    score
                    reasoning
                    bestDays
                }
                indoorSightseeing {
                    score
                    reasoning
                    bestDays
                }
            }
            generatedAt
        }
    }
`
