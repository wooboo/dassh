import { pgTable, unique, uuid, varchar, text, timestamp, boolean, jsonb, foreignKey, inet } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	kindeId: varchar("kinde_id", { length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 100 }),
	lastName: varchar("last_name", { length: 100 }),
	profilePicture: text("profile_picture"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	isActive: boolean("is_active").default(true).notNull(),
	preferences: jsonb().default({}).notNull(),
}, (table) => [
	unique("users_kinde_id_unique").on(table.kindeId),
	unique("users_email_unique").on(table.email),
]);

export const dashboardLayouts = pgTable("dashboard_layouts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	layout: jsonb().notNull(),
	isDefault: boolean("is_default").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "dashboard_layouts_user_id_users_id_fk"
		}),
]);

export const userProfiles = pgTable("user_profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	displayName: varchar("display_name", { length: 50 }),
	timezone: varchar({ length: 50 }).default('UTC').notNull(),
	language: varchar({ length: 2 }).default('en').notNull(),
	theme: varchar({ length: 10 }).default('light').notNull(),
	dashboardLayout: jsonb("dashboard_layout").default({}).notNull(),
	notificationSettings: jsonb("notification_settings").default({}).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_profiles_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("user_profiles_user_id_unique").on(table.userId),
]);

export const userSessions = pgTable("user_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	kindeSessionId: varchar("kinde_session_id", { length: 255 }),
	userAgent: varchar("user_agent", { length: 500 }),
	ipAddress: inet("ip_address"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastActivityAt: timestamp("last_activity_at", { mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const widgets = pgTable("widgets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 100 }).notNull(),
	template: jsonb().notNull(),
	webhookUrl: text("webhook_url"),
	config: jsonb().default({}),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "widgets_user_id_users_id_fk"
		}),
]);

export const webhookLogs = pgTable("webhook_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	widgetId: uuid("widget_id"),
	url: text().notNull(),
	method: varchar({ length: 10 }).notNull(),
	headers: jsonb(),
	payload: jsonb(),
	response: jsonb(),
	statusCode: varchar("status_code", { length: 3 }),
	error: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.widgetId],
			foreignColumns: [widgets.id],
			name: "webhook_logs_widget_id_widgets_id_fk"
		}),
]);

export const widgetData = pgTable("widget_data", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	widgetId: uuid("widget_id").notNull(),
	data: jsonb().notNull(),
	source: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.widgetId],
			foreignColumns: [widgets.id],
			name: "widget_data_widget_id_widgets_id_fk"
		}),
]);

export const widgetTemplates = pgTable("widget_templates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	type: varchar({ length: 100 }).notNull(),
	template: jsonb().notNull(),
	configSchema: jsonb("config_schema"),
	isPublic: boolean("is_public").default(false),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "widget_templates_created_by_users_id_fk"
		}),
]);
