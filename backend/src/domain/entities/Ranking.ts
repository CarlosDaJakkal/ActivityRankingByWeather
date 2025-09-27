import { City } from './City.js'
import { WeatherSnapshot } from './WeatherData.js'
import { ActivityRankings } from './Activity.js'

export interface CityRanking {
    city: City
    weather: WeatherSnapshot[]
    activities: ActivityRankings
    generatedAt: Date
}

export interface RankingHistory {
    id: string
    cityId: string
    date: Date
    skiingScore: number
    surfingScore: number
    outdoorSightseeingScore: number
    indoorSightseeingScore: number
    weatherSnapshotIds: string[]
    createdAt: Date
}

export interface NewRankingHistory {
    cityId: string
    date: Date
    skiingScore: number
    surfingScore: number
    outdoorSightseeingScore: number
    indoorSightseeingScore: number
    weatherSnapshotIds: string[]
}
