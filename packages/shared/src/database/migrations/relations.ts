import { relations } from "drizzle-orm/relations";
import { users, dashboardLayouts, userProfiles, userSessions, widgets, webhookLogs, widgetData, widgetTemplates } from "./schema";

export const dashboardLayoutsRelations = relations(dashboardLayouts, ({one}) => ({
	user: one(users, {
		fields: [dashboardLayouts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	dashboardLayouts: many(dashboardLayouts),
	userProfiles: many(userProfiles),
	userSessions: many(userSessions),
	widgets: many(widgets),
	widgetTemplates: many(widgetTemplates),
}));

export const userProfilesRelations = relations(userProfiles, ({one}) => ({
	user: one(users, {
		fields: [userProfiles.userId],
		references: [users.id]
	}),
}));

export const userSessionsRelations = relations(userSessions, ({one}) => ({
	user: one(users, {
		fields: [userSessions.userId],
		references: [users.id]
	}),
}));

export const widgetsRelations = relations(widgets, ({one, many}) => ({
	user: one(users, {
		fields: [widgets.userId],
		references: [users.id]
	}),
	webhookLogs: many(webhookLogs),
	widgetData: many(widgetData),
}));

export const webhookLogsRelations = relations(webhookLogs, ({one}) => ({
	widget: one(widgets, {
		fields: [webhookLogs.widgetId],
		references: [widgets.id]
	}),
}));

export const widgetDataRelations = relations(widgetData, ({one}) => ({
	widget: one(widgets, {
		fields: [widgetData.widgetId],
		references: [widgets.id]
	}),
}));

export const widgetTemplatesRelations = relations(widgetTemplates, ({one}) => ({
	user: one(users, {
		fields: [widgetTemplates.createdBy],
		references: [users.id]
	}),
}));