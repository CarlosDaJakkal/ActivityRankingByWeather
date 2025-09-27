import { RankingHistory, NewRankingHistory } from '../entities/Ranking.js'

export interface IRankingRepository {
    findByCityAndDate(
        cityId: string,
        date: Date
    ): Promise<RankingHistory | null>

    findByCityAndDateRange(
        cityId: string,
        startDate: Date,
        endDate: Date
    ): Promise<RankingHistory[]>

    save(ranking: NewRankingHistory): Promise<RankingHistory>

    findMostRecentByCity(cityId: string): Promise<RankingHistory | null>
}
