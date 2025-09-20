import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  jsonb, 
  boolean 
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Users table - integrated with Kinde authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  kindeId: varchar("kinde_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  givenName: varchar("given_name", { length: 255 }),
  familyName: varchar("family_name", { length: 255 }),
  picture: text("picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Widgets table - core widget definitions
export const widgets = pgTable("widgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  template: jsonb("template").notNull(),
  webhookUrl: text("webhook_url"),
  config: jsonb("config").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Widget data table - real-time webhook data
export const widgetData = pgTable("widget_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  widgetId: uuid("widget_id").references(() => widgets.id).notNull(),
  data: jsonb("data").notNull(),
  source: varchar("source", { length: 255 }), // webhook source identifier
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Dashboard layouts - user dashboard configurations
export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  layout: jsonb("layout").notNull(), // Grid layout configuration
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Widget templates - reusable widget configurations
export const widgetTemplates = pgTable("widget_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(),
  template: jsonb("template").notNull(),
  configSchema: jsonb("config_schema"), // JSON schema for configuration
  isPublic: boolean("is_public").default(false),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Webhook logs - for debugging and monitoring
export const webhookLogs = pgTable("webhook_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  widgetId: uuid("widget_id").references(() => widgets.id),
  url: text("url").notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  headers: jsonb("headers"),
  payload: jsonb("payload"),
  response: jsonb("response"),
  statusCode: varchar("status_code", { length: 3 }),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Widget = typeof widgets.$inferSelect;
export type NewWidget = typeof widgets.$inferInsert;

export type WidgetData = typeof widgetData.$inferSelect;
export type NewWidgetData = typeof widgetData.$inferInsert;

export type DashboardLayout = typeof dashboardLayouts.$inferSelect;
export type NewDashboardLayout = typeof dashboardLayouts.$inferInsert;

export type WidgetTemplate = typeof widgetTemplates.$inferSelect;
export type NewWidgetTemplate = typeof widgetTemplates.$inferInsert;

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type NewWebhookLog = typeof webhookLogs.$inferInsert;