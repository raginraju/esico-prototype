CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`unique_id` text NOT NULL,
	`report_number` text NOT NULL,
	`sticker_number` text,
	`equipment_id` text,
	`certificate_title` text NOT NULL,
	`revision_number` text DEFAULT '1',
	`as_name` text,
	`inspector_name` text NOT NULL,
	`inspected_by` text,
	`signature` text,
	`selected_date` text,
	`next_date` text,
	`date_of_issue` text,
	`sel_date` text,
	`nex_date` text,
	`applied_standards` text,
	`employer_name_address` text NOT NULL,
	`location` text NOT NULL,
	`equipment_description` text NOT NULL,
	`equipment_description_pdf` text,
	`safe_working_loads` text,
	`manufacturer_name` text,
	`manufacture_date` text,
	`first_examined` text DEFAULT 'No',
	`installed_correctly` text DEFAULT '',
	`months_interval` text DEFAULT '6',
	`six_months_interval` text DEFAULT 'No',
	`twelve_months_interval` text DEFAULT 'No',
	`exam_scheme` text DEFAULT 'Yes',
	`after_occur` text DEFAULT 'No',
	`defect` text DEFAULT 'NONE',
	`defect2` text DEFAULT 'N/A',
	`iminent_danger` text DEFAULT 'No',
	`repair_renewal` text DEFAULT 'NONE',
	`any_tests_carried` text DEFAULT 'NONE',
	`observation` text,
	`safe_to_operate` text DEFAULT 'Yes',
	`checklist_type` text DEFAULT '',
	`show_in_certificate` text DEFAULT '0',
	`status` text DEFAULT 'A',
	`created_on` text DEFAULT CURRENT_TIMESTAMP,
	`updated_on` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_unique_id_unique` ON `certificates` (`unique_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_report_number_unique` ON `certificates` (`report_number`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'INSPECTOR' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);