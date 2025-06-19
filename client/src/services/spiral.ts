import { generateSpiralTimetable } from '@/algorithms/generate';
import { StudyBlock, SpiralConfig } from '@/types/spiral';

export interface SpiralServiceConfig {
  hoursPerWeek: number;
  studyDays: number[];
  yearMultiplier: number;
  subjects: any[];
  userPerformance?: any;
  blocksTable: Record<string, number>;
  favouriteSubjects?: string[];
}

export interface SessionBlock {
  subject: string;
  topics: string[];
  minutes: number;
  date: string;
  startTime: string;
  endTime: string;
  isReview: boolean;
}

/**
 * Main spiral service that generates timetable with grouped topics into sessions
 */
export function generate(config: SpiralServiceConfig): SessionBlock[] {
  // Convert service config to algorithm config
  const spiralConfig: SpiralConfig = {
    subjectsData: config.subjects,
    blocksTable: config.blocksTable,
    yearMultiplier: config.yearMultiplier,
    userPerformance: config.userPerformance,
    hoursPerWeek: config.hoursPerWeek,
    weeklyStudyHours: config.hoursPerWeek, // For backward compatibility
    studyDays: config.studyDays,
    favouriteSubjects: config.favouriteSubjects || [],
    // Remove leastFavouriteSubjects as per requirements
  };

  // Generate the timetable using the spiral algorithm
  const studyBlocks = generateSpiralTimetable(spiralConfig);
  
  // Convert StudyBlock[] to SessionBlock[] format
  return studyBlocks.map(block => ({
    subject: block.subject,
    topics: block.topics.map(topic => topic.name),
    minutes: block.minutes || 120, // Default to 2 hours if not set
    date: block.date,
    startTime: block.startTime,
    endTime: block.endTime,
    isReview: block.isInterjection || false,
  }));
}

/**
 * Calculate topic minutes based on subject total and topic importance scores
 */
export function calculateTopicMinutes(
  totalSubjectMinutes: number,
  topics: any[],
  userPerformance?: any
): Record<string, number> {
  const topicScores: Record<string, number> = {};
  
  // Calculate importance scores for each topic
  topics.forEach(topic => {
    const { difficulty, clinicalImportance, examRelevance } = topic.ratings;
    const rawScore = 0.4 * difficulty + 0.3 * clinicalImportance + 0.3 * examRelevance;
    
    // Adjust for mastery level
    const mastery = userPerformance?.[topic.name] || 0.5;
    const adjustedScore = rawScore * (1 + (1 - mastery) / 2);
    
    topicScores[topic.name] = adjustedScore;
  });
  
  // Calculate total score for normalization
  const totalScore = Object.values(topicScores).reduce((sum, score) => sum + score, 0);
  
  // Allocate minutes proportionally
  const topicMinutes: Record<string, number> = {};
  Object.entries(topicScores).forEach(([topicName, score]) => {
    topicMinutes[topicName] = Math.round((totalSubjectMinutes * score) / totalScore);
  });
  
  return topicMinutes;
}

/**
 * Group topics into sessions based on time constraints
 * Sessions should be ≥60 minutes and ≤120 minutes
 */
export function groupTopicsIntoSessions(
  subject: string,
  topicMinutes: Record<string, number>,
  isReview: boolean = false
): Array<{ subject: string; topics: string[]; minutes: number; isReview: boolean }> {
  const sessions: Array<{ subject: string; topics: string[]; minutes: number; isReview: boolean }> = [];
  const topics = Object.entries(topicMinutes).sort(([, a], [, b]) => b - a); // Sort by minutes desc
  
  let currentSession = {
    subject,
    topics: [] as string[],
    minutes: 0,
    isReview,
  };
  
  for (const [topicName, minutes] of topics) {
    // If adding this topic would exceed 120 minutes, start a new session
    if (currentSession.minutes + minutes > 120 && currentSession.topics.length > 0) {
      // Complete current session if it meets minimum duration
      if (currentSession.minutes >= 60) {
        sessions.push({ ...currentSession });
      }
      
      // Start new session
      currentSession = {
        subject,
        topics: [topicName],
        minutes,
        isReview,
      };
    } else {
      // Add to current session
      currentSession.topics.push(topicName);
      currentSession.minutes += minutes;
    }
  }
  
  // Add final session if it meets minimum duration
  if (currentSession.topics.length > 0 && currentSession.minutes >= 60) {
    sessions.push(currentSession);
  }
  
  // Ensure all sessions are either 60 or 120 minutes (round to nearest hour)
  return sessions.map(session => ({
    ...session,
    minutes: session.minutes >= 90 ? 120 : 60,
  }));
}