export interface SpiralConfig {
  weeklyStudyHours: number;  // legacy - convert to hoursPerWeek
  hoursPerWeek: number;
  studyDays: number[];       // weekday indices 0-6
  yearMultiplier: number;    // 1.0 for 5th-year
  favouriteSubjects: string[];
  subjectsData: import('../data/masterSubjects').SubjectsData;
  userPerformance?: UserPerformance;
  blocksTable: Record<string, number>;
  yearGroup?: number;        // keep for back-compat
  userEvents?: UserEvent[];
}

export interface UserPerformance {
  subjects?: Record<string, number>; // 0–1
  topics?: Record<string, number>; // "Subject: Topic"
}

export interface UserEvent {
  name: string;
  date: string; // ISO yyyy-mm-dd
  startTime: string; // "HH:MM"
  endTime: string;
  recurringWeekly?: boolean;
  recurringDays?: string[];
  type?: 'personal' | 'placement' | 'meal' | 'sleep';
}

export interface StudyBlock {
  subject: string;
  topics: { name: string; type: 'main' | 'connection'; connectionTopics?: string[] }[];
  hours: number;
  date: string;
  startTime: string;
  endTime: string;
  passNumber?: number;
  isInterjection?: boolean;
}

export interface ConditionPlan {
  subject: string;
  condition: string;
  minutes: number;
  adjustedWeight: number;
  isReview: boolean;
  pass?: number;
}