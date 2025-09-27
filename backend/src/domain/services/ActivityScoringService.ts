import { WeatherSnapshot } from '../entities/WeatherData.js'
import { ActivityScore, ActivityRankings } from '../entities/Activity.js'

interface ScoreRange {
    min: number
    max: number
    score: number
}

interface ScoringConfig {
    temperature: ScoreRange[]
    windSpeed: ScoreRange[]
    precipitation: ScoreRange[]
    cloudCover: ScoreRange[]
    snowDepth?: ScoreRange[]
    waveHeight?: ScoreRange[]
}

type ActivityType =
    | 'skiing'
    | 'surfing'
    | 'outdoorSightseeing'
    | 'indoorSightseeing'

export class ActivityScoringService {
    private readonly SCORING_CONFIGS: Record<ActivityType, ScoringConfig> = {
        skiing: {
            temperature: [
                { min: -10, max: -2, score: 2 },
                { min: -15, max: 5, score: 1 },
                { min: -Infinity, max: Infinity, score: -1 },
            ],
            windSpeed: [
                { min: 0, max: 10, score: 1 },
                { min: 25, max: Infinity, score: -1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            precipitation: [
                { min: 0, max: 2, score: 1 },
                { min: 5, max: Infinity, score: -1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            cloudCover: [
                { min: 0, max: 70, score: 0.5 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            snowDepth: [
                { min: 50, max: Infinity, score: 4 },
                { min: 20, max: 50, score: 3 },
                { min: 5, max: 20, score: 2 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
        },
        surfing: {
            temperature: [
                { min: 18, max: 28, score: 2 },
                { min: 15, max: 30, score: 1 },
                { min: -Infinity, max: Infinity, score: -1 },
            ],
            windSpeed: [
                { min: 10, max: 20, score: 2 },
                { min: 5, max: 25, score: 1 },
                { min: 30, max: Infinity, score: -2 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            precipitation: [
                { min: 0, max: 1, score: 1 },
                { min: 10, max: Infinity, score: -1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            cloudCover: [
                { min: 0, max: 30, score: 1 },
                { min: 80, max: Infinity, score: -0.5 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            waveHeight: [
                { min: 1, max: 3, score: 1 },
                { min: 4, max: Infinity, score: -1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
        },
        outdoorSightseeing: {
            temperature: [
                { min: 15, max: 25, score: 3 },
                { min: 10, max: 30, score: 2 },
                { min: 5, max: 35, score: 1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            windSpeed: [
                { min: 5, max: 15, score: 1 },
                { min: 25, max: Infinity, score: -1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            precipitation: [
                { min: 0, max: 0, score: 2 },
                { min: 0, max: 2, score: 1 },
                { min: 5, max: Infinity, score: -2 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            cloudCover: [
                { min: 20, max: 50, score: 2 },
                { min: 0, max: 80, score: 1 },
                { min: 80, max: Infinity, score: -1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
        },
        indoorSightseeing: {
            temperature: [
                { min: -Infinity, max: 5, score: 2 },
                { min: 30, max: Infinity, score: 2 },
                { min: 5, max: 10, score: 1 },
                { min: 25, max: 30, score: 1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            windSpeed: [
                { min: 25, max: Infinity, score: 1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            precipitation: [
                { min: 5, max: Infinity, score: 2 },
                { min: 2, max: 5, score: 1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
            cloudCover: [
                { min: 80, max: Infinity, score: 1 },
                { min: -Infinity, max: Infinity, score: 0 },
            ],
        },
    }
    calculateRankings(weatherData: WeatherSnapshot[]): ActivityRankings {
        return {
            skiing: this.calculateActivityScore('skiing', weatherData),
            surfing: this.calculateActivityScore('surfing', weatherData),
            outdoorSightseeing: this.calculateActivityScore(
                'outdoorSightseeing',
                weatherData
            ),
            indoorSightseeing: this.calculateActivityScore(
                'indoorSightseeing',
                weatherData
            ),
        }
    }

    private clampScore(score: number): number {
        return Math.max(0, Math.min(10, score))
    }

    private roundScore(score: number): number {
        return Math.round(score * 10) / 10
    }

    private formatDayName(date: Date): string {
        return date.toLocaleDateString('en-US', { weekday: 'short' })
    }

    private getScoreForRange(value: number, ranges: ScoreRange[]): number {
        for (const range of ranges) {
            if (value >= range.min && value <= range.max) {
                return range.score
            }
        }
        return 0
    }

    private calculateDayScore(
        weather: WeatherSnapshot,
        activityType: ActivityType
    ): number {
        const config = this.SCORING_CONFIGS[activityType]
        let dayScore =
            activityType === 'surfing'
                ? 5
                : activityType === 'indoorSightseeing'
                  ? 5
                  : 0

        dayScore += this.getScoreForRange(
            weather.temperature,
            config.temperature
        )

        dayScore += this.getScoreForRange(weather.windSpeed, config.windSpeed)

        dayScore += this.getScoreForRange(
            weather.precipitation,
            config.precipitation
        )

        dayScore += this.getScoreForRange(weather.cloudCover, config.cloudCover)

        if (config.snowDepth && weather.snowDepth !== undefined) {
            dayScore += this.getScoreForRange(
                weather.snowDepth,
                config.snowDepth
            )
        } else if (
            activityType === 'skiing' &&
            weather.snowDepth === undefined
        ) {
            dayScore = 1
        }

        if (config.waveHeight && weather.waveHeight !== undefined) {
            dayScore += this.getScoreForRange(
                weather.waveHeight,
                config.waveHeight
            )
        }

        if (
            activityType === 'indoorSightseeing' &&
            weather.temperature >= 20 &&
            weather.temperature <= 24 &&
            weather.precipitation === 0 &&
            weather.cloudCover < 30
        ) {
            dayScore -= 1
        }

        return this.clampScore(dayScore)
    }

    private calculateActivityScore(
        activityType: ActivityType,
        weatherData: WeatherSnapshot[]
    ): ActivityScore {
        let totalScore = 0
        const bestDays: string[] = []

        weatherData.forEach(weather => {
            const dayScore = this.calculateDayScore(weather, activityType)
            totalScore += dayScore

            if (dayScore >= 7) {
                bestDays.push(this.formatDayName(weather.date))
            }
        })

        const avgScore = totalScore / weatherData.length

        return {
            score: this.roundScore(avgScore),
            reasoning: this.getActivityReasoning(
                activityType,
                avgScore,
                weatherData
            ),
            bestDays: bestDays.slice(0, 3),
        }
    }

    private getActivityReasoning(
        activityType: ActivityType,
        score: number,
        weather: WeatherSnapshot[]
    ): string {
        const avgTemp =
            weather.reduce((sum, w) => sum + w.temperature, 0) / weather.length
        const avgWind =
            weather.reduce((sum, w) => sum + w.windSpeed, 0) / weather.length
        const rainyDays = weather.filter(w => w.precipitation > 2).length
        const hotDays = weather.filter(w => w.temperature > 30).length
        const extremeDays = weather.filter(
            w => w.temperature < 5 || w.temperature > 30
        ).length
        const hasSnowData = weather.some(
            w => w.snowDepth !== undefined && w.snowDepth! > 0
        )

        const reasoningMap: Record<ActivityType, Record<string, string>> = {
            skiing: {
                excellent: hasSnowData
                    ? 'Excellent skiing conditions with good snow coverage and ideal temperatures.'
                    : 'Great winter weather, though snow conditions need verification.',
                good: hasSnowData
                    ? 'Good skiing conditions with decent snow and acceptable weather.'
                    : 'Decent winter weather for mountain activities.',
                fair:
                    avgTemp > 5
                        ? 'Weather may be too warm for optimal skiing conditions.'
                        : 'Marginal skiing conditions - check local snow reports.',
                poor: 'Poor skiing conditions due to unfavorable weather patterns.',
            },
            surfing: {
                excellent:
                    'Excellent surfing conditions with great weather and favorable winds.',
                good: 'Good surfing weather with decent conditions for water activities.',
                fair:
                    avgTemp < 15
                        ? 'Water temperature may be cold - consider a wetsuit.'
                        : 'Moderate surfing conditions - check local wave reports.',
                poor:
                    avgWind > 30
                        ? 'High winds may create dangerous surfing conditions.'
                        : 'Suboptimal conditions for surfing activities.',
            },
            outdoorSightseeing: {
                excellent:
                    'Perfect weather for exploring outdoor attractions and sightseeing.',
                good: 'Good conditions for outdoor activities with comfortable temperatures.',
                fair:
                    rainyDays > 3
                        ? 'Some rainy days expected - plan indoor alternatives.'
                        : hotDays > 2
                          ? 'Hot weather - plan activities for cooler parts of the day.'
                          : 'Mixed weather conditions - pack for various scenarios.',
                poor: 'Challenging weather for outdoor sightseeing - consider indoor attractions.',
            },
            indoorSightseeing: {
                excellent:
                    'Weather conditions make this an ideal time for museums and indoor attractions.',
                good:
                    rainyDays > 2
                        ? 'Some rainy days make indoor activities particularly appealing.'
                        : 'Good opportunity to explore cultural sites and indoor venues.',
                fair: 'Decent time for indoor activities, with some nice outdoor days too.',
                poor: 'Perfect outdoor weather makes indoor activities less necessary.',
            },
        }

        const scoreCategory =
            score >= 8
                ? 'excellent'
                : score >= 6
                  ? 'good'
                  : score >= 4
                    ? 'fair'
                    : 'poor'

        return reasoningMap[activityType][scoreCategory]
    }
}
