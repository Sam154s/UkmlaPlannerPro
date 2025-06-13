import { buildHourPlan } from './selector';
import { sliceConditions } from './sessionSlicer';
import { placeSessions, CalendarConfig } from './timeslotter';
import { SpiralConfig, StudyBlock } from '../types/spiral';

/**
 * Hour-based spiral timetable generator with flexible study days.
 * 
 * Main entry point that combines hour planning, session slicing, and calendar placement
 * to produce a complete study schedule with variable session lengths.
 */
export function generateSpiralTimetable(config: SpiralConfig): StudyBlock[] {
  const {
    hoursPerWeek,
    weeklyStudyHours, // legacy fallback
    studyDays,
    yearMultiplier,
    favouriteSubjects,
    subjectsData,
    userPerformance,
    blocksTable,
    userEvents = []
  } = config;

  // Use hoursPerWeek or fall back to weeklyStudyHours for backward compatibility
  const totalHours = hoursPerWeek || weeklyStudyHours;

  // 1. Generate hour-based condition plans
  const conditionPlans = buildHourPlan({
    ...config,
    hoursPerWeek: totalHours
  });

  // 2. Slice conditions into variable-length sessions (1-2h range, 30-min multiples)
  const sessions = sliceConditions(conditionPlans, 60, 120);

  // 3. Place sessions into calendar with user-chosen study days
  const calendarConfig: CalendarConfig = {
    startDate: new Date(),
    studyDays,
    hoursPerWeek: totalHours,
    userEvents
  };

  const studyBlocks = placeSessions(sessions, calendarConfig);

  return studyBlocks;
}

/**
 * Regeneration trigger that rebuilds the entire timetable.
 * Call this after mastery updates to recalculate difficulty factors.
 */
export function rebuildTimetable(config: SpiralConfig): StudyBlock[] {
  return generateSpiralTimetable(config);
}

/**
 * Legacy session-based generator for backward compatibility
 */
export function generateLegacyTimetable(config: any): StudyBlock[] {
  // This would use the old buildSessionStream approach
  // Keeping for backward compatibility with existing code
  return generateSpiralTimetable(config);
}