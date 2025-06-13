import { SessionStub } from './sessionSlicer';
import { StudyBlock, UserEvent } from '../types/spiral';
import { TimeSlot, timeToMinutes, minutesToTime, overlapsWithUserEvent } from './timeslotterHelpers';
import { DAILY_START_TIME, DAILY_END_TIME } from '../constants';

export interface CalendarConfig {
  startDate: Date;
  studyDays: number[];  // weekday indices 0-6
  hoursPerWeek: number;
  userEvents?: UserEvent[];
}

/**
 * Places variable-length sessions into calendar time slots with user-chosen study days.
 * Supports 30-min granularity and respects daily hour caps.
 */
export function placeSessions(
  sessions: SessionStub[],
  calendarConfig: CalendarConfig
): StudyBlock[] {
  const { startDate, studyDays, hoursPerWeek, userEvents = [] } = calendarConfig;
  const studyBlocks: StudyBlock[] = [];
  
  let currentDate = new Date(startDate);
  let dailyMinutesUsed = 0;
  const maxMinutesPerDay = Math.round((hoursPerWeek * 60) / studyDays.length);
  
  for (const session of sessions) {
    const sessionMinutes = session.minutes || 120; // Default 2 hours if not specified
    
    // Find next available time slot
    const result = findNextAvailableSlotMinutes(
      currentDate,
      dailyMinutesUsed,
      maxMinutesPerDay,
      studyDays,
      sessionMinutes,
      userEvents
    );
    
    if (!result.slot) {
      console.warn(`Could not find slot for session: ${session.subject}`);
      continue;
    }
    
    const studyBlock = createStudyBlockFromSession(session, result.slot);
    studyBlocks.push(studyBlock);
    
    // Update tracking variables
    currentDate = result.newDate;
    dailyMinutesUsed = result.newDailyMinutesUsed;
  }
  
  return studyBlocks;
}

/**
 * Check if a given date is a valid study day based on studyDays array
 */
function isValidStudyDay(date: Date, studyDays: number[]): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  return studyDays.includes(dayOfWeek);
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
 * Find next available slot with minute-based scheduling
 */
function findNextAvailableSlotMinutes(
  startDate: Date,
  dailyMinutesUsed: number,
  maxMinutesPerDay: number,
  studyDays: number[],
  sessionMinutes: number,
  userEvents?: UserEvent[]
): { slot: TimeSlot | null, newDate: Date, newDailyMinutesUsed: number } {
  let currentDate = new Date(startDate);
  let currentDailyMinutes = dailyMinutesUsed;

  // Try up to 365 days to find a slot
  for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
    if (!isValidStudyDay(currentDate, studyDays)) {
      currentDate = addDays(currentDate, 1);
      currentDailyMinutes = 0;
      continue;
    }

    // Check if we can fit this session today
    if (currentDailyMinutes + sessionMinutes <= maxMinutesPerDay) {
      const slot = findSlotInDay(currentDate, sessionMinutes, userEvents, currentDailyMinutes);
      if (slot) {
        return {
          slot,
          newDate: currentDate,
          newDailyMinutesUsed: currentDailyMinutes + sessionMinutes
        };
      }
    }

    // Move to next day
    currentDate = addDays(currentDate, 1);
    currentDailyMinutes = 0;
  }

  return { slot: null, newDate: currentDate, newDailyMinutesUsed: 0 };
}

/**
 * Find a slot within a specific day
 */
function findSlotInDay(
  date: Date,
  sessionMinutes: number,
  userEvents?: UserEvent[],
  startFromMinutes: number = 0
): TimeSlot | null {
  const dayStartMinutes = timeToMinutes(DAILY_START_TIME);
  const dayEndMinutes = timeToMinutes(DAILY_END_TIME);
  
  // Start from either the day start or where we left off
  let currentMinutes = Math.max(dayStartMinutes, dayStartMinutes + startFromMinutes);
  
  while (currentMinutes + sessionMinutes <= dayEndMinutes) {
    const startTime = minutesToTime(currentMinutes);
    const endTime = minutesToTime(currentMinutes + sessionMinutes);
    
    const potentialSlot: TimeSlot = {
      date: date.toISOString().split('T')[0],
      startTime,
      endTime,
      hours: sessionMinutes / 60
    };
    
    // Check for conflicts with user events
    if (!overlapsWithUserEvent(potentialSlot, userEvents)) {
      return potentialSlot;
    }
    
    // Move forward by 30-minute intervals
    currentMinutes += 30;
  }
  
  return null;
}

/**
 * Create a StudyBlock from a SessionStub and TimeSlot
 */
function createStudyBlockFromSession(session: SessionStub, timeSlot: TimeSlot): StudyBlock {
  return {
    subject: session.subject,
    topics: session.conditions.map(condition => ({
      name: condition,
      type: 'main' as const
    })),
    hours: timeSlot.hours,
    date: timeSlot.date,
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    passNumber: session.pass,
    isInterjection: session.isReview
  };
}