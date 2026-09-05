CREATE TABLE `id_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`file_number` text NOT NULL,
	`civil_id_number` text NOT NULL,
	`designation` text NOT NULL,
	`expiry_date` text NOT NULL,
	`file_url` text,
	`created_at` text NOT NULL
);
