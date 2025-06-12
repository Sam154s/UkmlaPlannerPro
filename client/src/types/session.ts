export interface SessionStub {
  subject: string;
  topic: string;
  pass: number;
  isReview: boolean;
}

export interface StudyBlock {
  subject: string;
  topics: {
    name: string;
    type: 'main' | 'connection';
    connectionTopics?: string[];
  }[];
  hours: number;
  date: string;
  startTime: string;
  endTime: string;
  passNumber?: number;
  isInterjection?: boolean;
}

export interface SelectorConfig {
  subjectsData: any[];
  baseBlockCounts: { [key: string]: number };
  passCoverage: number;
  favouriteSubjects: string[];
  leastFavouriteSubjects?: string[];
  userPerformance?: UserPerformance;
  k: number; // Review injection interval
}

export interface CalendarConfig {
  startDate: Date;
  daysPerWeek: number;
  dailyStudyHours: number;
  userEvents?: UserEvent[];
}

export interface UserPerformance {
  subjects?: { [subjectName: string]: number };
  topics?: { [subjectAndTopic: string]: number };
}

export interface UserEvent {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  recurringWeekly?: boolean;
  recurringDays?: string[];
  type?: 'personal' | 'placement' | 'meal' | 'sleep';
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
}