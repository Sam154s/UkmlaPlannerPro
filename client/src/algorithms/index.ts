import { buildSessionStream } from './selector';
import { placeSessions } from './timeslotter';
import { StudyBlock, SelectorConfig, CalendarConfig } from '../types/session';
import { BASE_BLOCK_COUNTS } from '../data/studyBlockCounts';
import { DEFAULT_PASS_COVERAGE, REVIEW_INJECTION_INTERVAL } from '../constants';

export interface SpiralConfig {
  weeklyStudyHours: number;
  yearGroup: number;
  daysPerWeek: number;
  favouriteSubjects: string[];
  subjectsData: any[];
  userPerformance?: any;
  passCoverage?: number;
  userEvents?: any[];
  revisionCount?: number;
}

/**
 * Generate a spiral timetable using the canonical algorithm implementation.
 * 
 * This function combines the pure session selector with the calendar placer
 * to produce a complete study schedule following spiral revision principles.
 */
export function generateSpiralTimetable(config: SpiralConfig): StudyBlock[] {
  const {
    weeklyStudyHours,
    daysPerWeek,
    favouriteSubjects,
    subjectsData,
    userPerformance,
    passCoverage = DEFAULT_PASS_COVERAGE,
    userEvents = []
  } = config;

  // Build selector configuration
  const selectorConfig: SelectorConfig = {
    subjectsData,
    baseBlockCounts: BASE_BLOCK_COUNTS,
    passCoverage,
    favouriteSubjects,
    userPerformance,
    k: REVIEW_INJECTION_INTERVAL
  };

  // Build calendar configuration
  const calendarConfig: CalendarConfig = {
    startDate: new Date(),
    daysPerWeek,
    dailyStudyHours: weeklyStudyHours / daysPerWeek,
    userEvents
  };

  // Generate session stream using spiral algorithm
  const sessionStream = buildSessionStream(selectorConfig);

  // Place sessions in calendar slots
  const studyBlocks = placeSessions(sessionStream, calendarConfig);

  return studyBlocks;
}

// Export individual components for testing
export { buildSessionStream } from './selector';
export { placeSessions, findNextAvailableSlot, overlapsWithUserEvent } from './timeslotter';