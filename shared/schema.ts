import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Base user table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  weekly_hours: integer("weekly_hours").default(10),
  year_group: integer("year_group").default(3),
  days_per_week: integer("days_per_week").default(5),
  selected_subjects: text("selected_subjects").array(),
  color_scheme: jsonb("color_scheme"),
  timetable_events: jsonb("timetable_events"),
  remember_me: boolean("remember_me").default(false),
});

// User settings and preferences
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  weeklyHours: integer("weekly_hours").default(10),
  yearGroup: integer("year_group").default(3),
  daysPerWeek: integer("days_per_week").default(5),
  selectedSubjects: jsonb("selected_subjects").$type<string[]>(),
  colorScheme: jsonb("color_scheme"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Timetable data
export const timetables = pgTable("timetables", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  studyEvents: jsonb("study_events"),
  holidayEvents: jsonb("holiday_events"),
  userEvents: jsonb("user_events"),
  preferences: jsonb("preferences"),
  revisionCount: integer("revision_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subject ratings
export const subjectRatings = pgTable("subject_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ratings: jsonb("ratings"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exam mode settings
export const examSettings = pgTable("exam_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examModeSettings: jsonb("exam_mode_settings"),
  examDates: jsonb("exam_dates"),
  isExamMode: text("is_exam_mode").default("false"), // Using text instead of boolean
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User performance data
export const userPerformance = pgTable("user_performance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjects: jsonb("subjects"), // subject-level performance scores
  topics: jsonb("topics"), // topic-level performance scores
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  timetable: one(timetables, {
    fields: [users.id],
    references: [timetables.userId],
  }),
  ratings: one(subjectRatings, {
    fields: [users.id],
    references: [subjectRatings.userId],
  }),
  exams: one(examSettings, {
    fields: [users.id],
    references: [examSettings.userId],
  }),
  performance: one(userPerformance, {
    fields: [users.id],
    references: [userPerformance.userId],
  }),
}));

// Schema for registering new users
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
}).extend({
  confirmPassword: z.string()
    .min(1, "Please confirm your password")
});

// Schema for logging in
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;