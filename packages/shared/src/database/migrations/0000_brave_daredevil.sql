CREATE TABLE "dashboard_layouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"layout" jsonb NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" varchar(50),
	"timezone" varchar(50) DEFAULT 'UTC' NOT NULL,
	"language" varchar(2) DEFAULT 'en' NOT NULL,
	"theme" varchar(10) DEFAULT 'light' NOT NULL,
	"dashboard_layout" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notification_settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kinde_session_id" varchar(255),
	"user_agent" varchar(500),
	"ip_address" "inet",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kinde_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"profile_picture" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "users_kinde_id_unique" UNIQUE("kinde_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "webhook_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"widget_id" uuid,
	"url" text NOT NULL,
	"method" varchar(10) NOT NULL,
	"headers" jsonb,
	"payload" jsonb,
	"response" jsonb,
	"status_code" varchar(3),
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "widget_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"widget_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"source" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "widget_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(100) NOT NULL,
	"template" jsonb NOT NULL,
	"config_schema" jsonb,
	"is_public" boolean DEFAULT false,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "widgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"template" jsonb NOT NULL,
	"webhook_url" text,
	"config" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dashboard_layouts" ADD CONSTRAINT "dashboard_layouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_logs" ADD CONSTRAINT "webhook_logs_widget_id_widgets_id_fk" FOREIGN KEY ("widget_id") REFERENCES "public"."widgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widget_data" ADD CONSTRAINT "widget_data_widget_id_widgets_id_fk" FOREIGN KEY ("widget_id") REFERENCES "public"."widgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widget_templates" ADD CONSTRAINT "widget_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;