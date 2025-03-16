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

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
}).extend({
  confirmPassword: z.string()
    .min(1, "Please confirm your password")
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;