export enum ActivityType {
    SKIING = 'skiing',
    SURFING = 'surfing',
    OUTDOOR_SIGHTSEEING = 'outdoorSightseeing',
    INDOOR_SIGHTSEEING = 'indoorSightseeing',
}

export interface ActivityScore {
    score: number
    reasoning: string
    bestDays: string[]
}

export interface ActivityRankings {
    skiing: ActivityScore
    surfing: ActivityScore
    outdoorSightseeing: ActivityScore
    indoorSightseeing: ActivityScore
}
