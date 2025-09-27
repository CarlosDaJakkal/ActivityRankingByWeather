import { z } from 'zod'

export const CityRankingRequestSchema = z.object({
    cityName: z
        .string()
        .min(2, 'City name must be at least 2 characters')
        .max(100, 'City name too long')
        .trim(),
})

export const SearchCitiesRequestSchema = z.object({
    query: z
        .string()
        .min(2, 'Search query must be at least 2 characters')
        .max(100, 'Search query too long')
        .trim(),
})

export type CityRankingRequest = z.infer<typeof CityRankingRequestSchema>
export type SearchCitiesRequest = z.infer<typeof SearchCitiesRequestSchema>
