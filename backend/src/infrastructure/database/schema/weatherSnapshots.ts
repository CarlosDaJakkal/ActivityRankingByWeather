import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'
import { cities } from './cities'

export const weatherSnapshots = sqliteTable('weather_snapshots', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => uuid()),
    cityId: text('city_id')
        .notNull()
        .references(() => cities.id),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    temperature: real('temperature').notNull(),
    windSpeed: real('wind_speed').notNull(),
    precipitation: real('precipitation').notNull(),
    cloudCover: real('cloud_cover').notNull(),
    snowDepth: real('snow_depth'),
    waveHeight: real('wave_height'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
        () => new Date()
    ),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})

export type WeatherSnapshotRecord = InferSelectModel<typeof weatherSnapshots>
export type NewWeatherSnapshotRecord = InferInsertModel<typeof weatherSnapshots>
