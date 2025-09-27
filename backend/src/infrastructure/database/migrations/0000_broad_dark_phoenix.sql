CREATE TABLE `cities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`timezone` text NOT NULL,
	`search_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `weather_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`city_id` text NOT NULL,
	`date` integer NOT NULL,
	`temperature` real NOT NULL,
	`wind_speed` real NOT NULL,
	`precipitation` real NOT NULL,
	`cloud_cover` real NOT NULL,
	`snow_depth` real,
	`wave_height` real,
	`created_at` integer,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rankings` (
	`id` text PRIMARY KEY NOT NULL,
	`city_id` text NOT NULL,
	`date` integer NOT NULL,
	`skiing_score` real NOT NULL,
	`surfing_score` real NOT NULL,
	`outdoor_sightseeing_score` real NOT NULL,
	`indoor_sightseeing_score` real NOT NULL,
	`weather_snapshot_ids` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE no action
);
