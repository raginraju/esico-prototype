ALTER TABLE `users` ADD `name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `mobile` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `status` text DEFAULT 'Pending' NOT NULL;