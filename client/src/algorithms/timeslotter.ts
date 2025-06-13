import { SessionStub } from './selector';
import { StudyBlock, UserEvent } from '../types/spiral';
import { TimeSlot, findNextAvailableSlot } from './timeslotterHelpers';

export interface CalendarConfig {
  startDate: Date;
  daysPerWeek: number;
  dailyStudyHours: number;
  userEvents?: UserEvent[];
}

/**
 * Places session stubs into calendar time slots, respecting user events and daily limits.
 * Allows multiple 2-hour sessions per day based on dailyStudyHours.
 */
export function placeSessions(
  sessionStream: SessionStub[],
  calendarConfig: CalendarConfig
): StudyBlock[] {
  const { startDate, daysPerWeek, dailyStudyHours, userEvents = [] } = calendarConfig;
  const studyBlocks: StudyBlock[] = [];
  
  let currentDate = new Date(startDate);
  let sessionIndex = 0;

  while (sessionIndex < sessionStream.length) {
    // Check if current date is a valid study day
    if (!isValidStudyDay(currentDate, daysPerWeek)) {
      currentDate = addDays(currentDate, 1);
      continue;
    }

    let hoursUsedToday = 0;
    const maxSessionsPerDay = Math.floor(dailyStudyHours / 2) || 1; // 2-hour blocks, at least 1 session
    let sessionsAddedToday = 0;

    // Try to fit multiple sessions on this day
    while (hoursUsedToday + 2 <= dailyStudyHours && 
           sessionIndex < sessionStream.length && 
           sessionsAddedToday < maxSessionsPerDay) {
      
      const result = findNextAvailableSlot(
        currentDate,
        2, // Each session is 2 hours
        userEvents,
        hoursUsedToday
      );

      if (!result.slot) {
        break; // No more slots available today
      }

      // Create study block from session stub
      const session = sessionStream[sessionIndex];
      const studyBlock = createStudyBlock(session, result.slot);
      studyBlocks.push(studyBlock);

      hoursUsedToday += result.slot.hours;
      sessionIndex++;
      sessionsAddedToday++;
    }

    // Move to next day
    currentDate = addDays(currentDate, 1);
  }

  return studyBlocks;
}

/**
 * Check if a given date is a valid study day based on daysPerWeek setting
 */
function isValidStudyDay(date: Date, daysPerWeek: number): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  switch (daysPerWeek) {
    case 7: return true; // All days
    case 6: return dayOfWeek !== 0; // Monday-Saturday
    case 5: return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday-Friday
    case 4: return dayOfWeek >= 1 && dayOfWeek <= 4; // Monday-Thursday
    case 3: return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon Wed Fri
    case 2: return dayOfWeek === 2 || dayOfWeek === 4; // Tue Thu
    case 1: return dayOfWeek === 3; // Wed
    default: return dayOfWeek >= 1 && dayOfWeek <= 5; // Default to weekdays
  }
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Create a StudyBlock from a SessionStub and TimeSlot
 */
function createStudyBlock(session: SessionStub, timeSlot: TimeSlot): StudyBlock {
  return {
    subject: session.subject,
    topics: [{ name: session.topic, type: 'main' }],
    hours: timeSlot.hours,
    date: timeSlot.date,
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    passNumber: session.pass,
    isInterjection: session.isReview
  };
}