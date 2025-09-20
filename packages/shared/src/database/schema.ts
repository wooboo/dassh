import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  jsonb, 
  boolean,
  inet
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table - integrated with Kinde authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  kindeId: varchar("kinde_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true).notNull(),
  preferences: jsonb("preferences").default({}).notNull(),
});

// User sessions table - track active authentication sessions
export const userSessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  kindeSessionId: varchar("kinde_session_id", { length: 255 }),
  userAgent: varchar("user_agent", { length: 500 }),
  ipAddress: inet("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// User profiles table - extended user profile information
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").unique().references(() => users.id, { onDelete: 'cascade' }).notNull(),
  displayName: varchar("display_name", { length: 50 }),
  timezone: varchar("timezone", { length: 50 }).default('UTC').notNull(),
  language: varchar("language", { length: 2 }).default('en').notNull(),
  theme: varchar("theme", { length: 10 }).default('light').notNull(),
  dashboardLayout: jsonb("dashboard_layout").default({}).notNull(),
  notificationSettings: jsonb("notification_settings").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(userSessions),
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
  widgets: many(widgets),
  dashboardLayouts: many(dashboardLayouts),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, { fields: [userSessions.userId], references: [users.id] }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

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

export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

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