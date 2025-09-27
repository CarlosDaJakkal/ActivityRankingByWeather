import { Mountain, Waves, MapPin, Building2 } from 'lucide-react'

interface ActivityScore {
    score: number
    reasoning: string
    bestDays: string[]
}

interface Props {
    name: string
    activity: ActivityScore
}

export function ActivityCard({ name, activity }: Props) {
    const COLOR_THRESHOLDS = [
        { threshold: 8, border: 'border-green-500', text: 'text-green-600' },
        { threshold: 6, border: 'border-yellow-500', text: 'text-yellow-600' },
        { threshold: 4, border: 'border-orange-500', text: 'text-orange-600' },
        { threshold: 0, border: 'border-red-500', text: 'text-red-600' },
    ]

    const getColorClasses = (score: number) => {
        const colorConfig = COLOR_THRESHOLDS.find(
            config => score >= config.threshold
        )!
        return {
            border: colorConfig.border,
            text: colorConfig.text,
        }
    }

    const ACTIVITY_ICONS = {
        Skiing: Mountain,
        Surfing: Waves,
        'Outdoor Sightseeing': MapPin,
        'Indoor Sightseeing': Building2,
    } as const

    const getActivityIcon = (name: string, score: number) => {
        const IconComponent =
            ACTIVITY_ICONS[name as keyof typeof ACTIVITY_ICONS]
        if (!IconComponent) {
            return null
        }

        const { text: iconColor } = getColorClasses(score)

        return <IconComponent size={24} className={iconColor} />
    }

    const colorClasses = getColorClasses(activity.score)

    return (
        <div
            className={`rounded-lg shadow-md border-2 p-4 hover:shadow-lg transition-all bg-white ${colorClasses.border} flex flex-col h-full`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    {getActivityIcon(name, activity.score)}
                    <h3 className="text-base font-semibold leading-tight text-gray-900">
                        {name}
                    </h3>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                    <div className={`text-xl font-bold ${colorClasses.text}`}>
                        {activity.score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">/ 10</div>
                </div>
            </div>

            <p className="text-xs leading-relaxed text-gray-700 flex-grow">
                {activity.reasoning}
            </p>

            {activity.bestDays.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs font-medium uppercase tracking-wide mb-1 text-gray-600">
                        Best Days
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {activity.bestDays.map((day, index) => (
                            <span
                                key={index}
                                className={`px-2 py-0.5 text-xs rounded-full border ${colorClasses.border} ${colorClasses.text} bg-opacity-10`}
                            >
                                {day}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {activity.bestDays.length === 0 && (
                <div className="mt-3">
                    <div className="h-6"></div>
                </div>
            )}
        </div>
    )
}
