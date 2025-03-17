import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  weeklyHours: integer("weekly_hours"),
  yearGroup: integer("year_group"),
  daysPerWeek: integer("days_per_week"),
  selectedSubjects: text("selected_subjects").array(),
  timetableEvents: jsonb("timetable_events"),
});

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