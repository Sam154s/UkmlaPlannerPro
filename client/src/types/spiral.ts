export interface SpiralConfig {
  weeklyStudyHours: number;
  yearGroup: number;
  daysPerWeek: number;
  favouriteSubjects: string[];
  subjectsData: import('../data/masterSubjects').SubjectsData;
  userPerformance?: UserPerformance;
  passCoverage?: number;
  userEvents?: UserEvent[];
  revisionCount?: number;
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