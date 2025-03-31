import { 
  users, 
  userSettings, 
  timetables, 
  subjectRatings, 
  examSettings, 
  userPerformance, 
  type User, 
  type InsertUser 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  
  // Timetable methods
  getTimetableData(userId: number): Promise<any>;
  saveTimetableData(userId: number, data: any): Promise<void>;
  
  // Subject ratings methods
  getSubjectRatings(userId: number): Promise<any>;
  saveSubjectRatings(userId: number, data: any): Promise<void>;
  
  // Exam settings methods
  getExamSettings(userId: number): Promise<any>;
  saveExamSettings(userId: number, data: any): Promise<void>;
  
  // User performance methods
  getPerformanceData(userId: number): Promise<any>;
  savePerformanceData(userId: number, data: any): Promise<void>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
  
  // Timetable methods
  async getTimetableData(userId: number): Promise<any> {
    const [timetable] = await db
      .select()
      .from(timetables)
      .where(eq(timetables.userId, userId));
    
    if (!timetable) {
      return null;
    }
    
    return {
      studyEvents: timetable.studyEvents,
      holidayEvents: timetable.holidayEvents,
      userEvents: timetable.userEvents,
      preferences: timetable.preferences,
      revisionCount: timetable.revisionCount
    };
  }
  
  async saveTimetableData(userId: number, data: any): Promise<void> {
    const existingTimetable = await db
      .select()
      .from(timetables)
      .where(eq(timetables.userId, userId));
    
    if (existingTimetable.length > 0) {
      await db
        .update(timetables)
        .set({
          studyEvents: data.studyEvents,
          holidayEvents: data.holidayEvents,
          userEvents: data.userEvents,
          preferences: data.preferences,
          revisionCount: data.revisionCount || existingTimetable[0].revisionCount,
          updatedAt: new Date()
        })
        .where(eq(timetables.userId, userId));
    } else {
      await db
        .insert(timetables)
        .values({
          userId,
          studyEvents: data.studyEvents,
          holidayEvents: data.holidayEvents,
          userEvents: data.userEvents,
          preferences: data.preferences,
          revisionCount: data.revisionCount || 0
        });
    }
  }
  
  // Subject ratings methods
  async getSubjectRatings(userId: number): Promise<any> {
    const [ratingData] = await db
      .select()
      .from(subjectRatings)
      .where(eq(subjectRatings.userId, userId));
    
    if (!ratingData) {
      return null;
    }
    
    return {
      ratings: ratingData.ratings
    };
  }
  
  async saveSubjectRatings(userId: number, data: any): Promise<void> {
    const existingRatings = await db
      .select()
      .from(subjectRatings)
      .where(eq(subjectRatings.userId, userId));
    
    if (existingRatings.length > 0) {
      await db
        .update(subjectRatings)
        .set({
          ratings: data.ratings,
          updatedAt: new Date()
        })
        .where(eq(subjectRatings.userId, userId));
    } else {
      await db
        .insert(subjectRatings)
        .values({
          userId,
          ratings: data.ratings
        });
    }
  }
  
  // Exam settings methods
  async getExamSettings(userId: number): Promise<any> {
    const [examData] = await db
      .select()
      .from(examSettings)
      .where(eq(examSettings.userId, userId));
    
    if (!examData) {
      return null;
    }
    
    return {
      examModeSettings: examData.examModeSettings,
      examDates: examData.examDates,
      // Convert string "true"/"false" to boolean for client
      isExamMode: examData.isExamMode === "true"
    };
  }
  
  async saveExamSettings(userId: number, data: any): Promise<void> {
    const existingSettings = await db
      .select()
      .from(examSettings)
      .where(eq(examSettings.userId, userId));
    
    if (existingSettings.length > 0) {
      await db
        .update(examSettings)
        .set({
          examModeSettings: data.examModeSettings,
          examDates: data.examDates,
          // Convert boolean to string for database
          isExamMode: data.isExamMode !== undefined ? String(data.isExamMode) : existingSettings[0].isExamMode,
          updatedAt: new Date()
        })
        .where(eq(examSettings.userId, userId));
    } else {
      await db
        .insert(examSettings)
        .values({
          userId,
          examModeSettings: data.examModeSettings,
          examDates: data.examDates,
          // Convert boolean to string for database
          isExamMode: data.isExamMode !== undefined ? String(data.isExamMode) : "false"
        });
    }
  }
  
  // User performance methods
  async getPerformanceData(userId: number): Promise<any> {
    const [performanceData] = await db
      .select()
      .from(userPerformance)
      .where(eq(userPerformance.userId, userId));
    
    if (!performanceData) {
      return null;
    }
    
    return {
      subjects: performanceData.subjects,
      topics: performanceData.topics
    };
  }
  
  async savePerformanceData(userId: number, data: any): Promise<void> {
    const existingPerformance = await db
      .select()
      .from(userPerformance)
      .where(eq(userPerformance.userId, userId));
    
    if (existingPerformance.length > 0) {
      await db
        .update(userPerformance)
        .set({
          subjects: data.subjects,
          topics: data.topics,
          updatedAt: new Date()
        })
        .where(eq(userPerformance.userId, userId));
    } else {
      await db
        .insert(userPerformance)
        .values({
          userId,
          subjects: data.subjects,
          topics: data.topics
        });
    }
  }
}

export const storage = new DatabaseStorage();