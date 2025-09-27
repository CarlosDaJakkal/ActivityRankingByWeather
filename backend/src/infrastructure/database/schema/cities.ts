import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'

export const cities = sqliteTable('cities', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => uuid()),
    name: text('name').notNull(),
    country: text('country').notNull(),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    timezone: text('timezone').notNull(),
    searchCount: integer('search_count').default(0).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
        () => new Date()
    ),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
        () => new Date()
    ),
})

export type CityRecord = InferSelectModel<typeof cities>
export type NewCityRecord = InferInsertModel<typeof cities>
