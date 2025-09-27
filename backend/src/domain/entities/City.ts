export interface City {
    id: string
    name: string
    country: string
    latitude: number
    longitude: number
    timezone: string
    searchCount: number
    createdAt: Date
    updatedAt: Date
}

export interface NewCity {
    name: string
    country: string
    latitude: number
    longitude: number
    timezone: string
}
