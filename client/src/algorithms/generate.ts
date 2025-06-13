import { buildSessionStream, SelectorConfig } from './selector';
import { placeSessions, CalendarConfig } from './timeslotter';
import { SpiralConfig, StudyBlock } from '../types/spiral';
import { BASE_BLOCK_COUNTS } from '../data/studyBlockCounts';
import { DEFAULT_PASS_COVERAGE } from '../constants';

/**
 * Canonical spiral timetable generator following the documented algorithm specification.
 * 
 * This is the main entry point that combines the pure session selector with the calendar placer
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

  // Filter subjects to only include those selected by user
  const selectedSubjectsData = subjectsData.filter(subject => 
    favouriteSubjects.includes(subject.name)
  );

  if (selectedSubjectsData.length === 0) {
    return [];
  }

  // Build selector configuration for the spiral algorithm
  const selectorConfig: SelectorConfig = {
    subjectsData: selectedSubjectsData,
    baseBlockCounts: BASE_BLOCK_COUNTS,
    passCoverage,
    favouriteSubjects,
    userPerformance,
    k: 10 // Review injection interval
  };

  // Build calendar configuration for time slot placement
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