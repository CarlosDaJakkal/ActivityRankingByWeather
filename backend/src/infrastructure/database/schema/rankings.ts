import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'
import { cities } from './cities'

export const rankings = sqliteTable('rankings', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => uuid()),
    cityId: text('city_id')
        .notNull()
        .references(() => cities.id),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    skiingScore: real('skiing_score').notNull(),
    surfingScore: real('surfing_score').notNull(),
    outdoorSightseeingScore: real('outdoor_sightseeing_score').notNull(),
    indoorSightseeingScore: real('indoor_sightseeing_score').notNull(),
    weatherSnapshotIds: text('weather_snapshot_ids').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
        () => new Date()
    ),
})

export type RankingRecord = InferSelectModel<typeof rankings>
export type NewRankingRecord = InferInsertModel<typeof rankings>
