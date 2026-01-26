CREATE TABLE `app_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_config_key_unique` ON `app_config` (`key`);--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`name` text NOT NULL,
	`event_type` text DEFAULT 'other' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `periods` (
	`id` integer PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`modified_start_time` text,
	`modified_end_time` text
);
