import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
})

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
        typePolicies: {
            City: {
                keyFields: ['id'],
            },
            CityRanking: {
                keyFields: ['city', ['id']],
            },
            Query: {
                fields: {
                    getCityRankings: {
                        keyArgs: ['cityName'],
                        merge(_, incoming) {
                            return incoming
                        }
                    },
                    searchCities: {
                        keyArgs: ['query'],
                        merge(_, incoming) {
                            return incoming
                        }
                    }
                }
            }
        },
    }),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
            fetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: true,
        },
        query: {
            errorPolicy: 'all',
        },
    },
})
