import { addMinutes, format, parseISO, isSameDay } from 'date-fns';
import { SessionStub, StudyBlock, CalendarConfig, UserEvent, TimeSlot } from '../types/session';
import { MIN_SESSION_HOURS } from '../constants';

/**
 * Places session stubs into calendar time slots, respecting user events and daily limits.
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

    // Find available time slot for this day
    const timeSlot = findNextAvailableSlot(
      currentDate,
      dailyStudyHours,
      userEvents
    );

    if (!timeSlot) {
      // No available slot today, move to next day
      currentDate = addDays(currentDate, 1);
      continue;
    }

    // Create study block from session stub
    const session = sessionStream[sessionIndex];
    const studyBlock = createStudyBlock(session, timeSlot);
    studyBlocks.push(studyBlock);

    sessionIndex++;
    currentDate = addDays(currentDate, 1);
  }

  return studyBlocks;
}

/**
 * Check if a given date is a valid study day based on daysPerWeek setting
 */
function isValidStudyDay(date: Date, daysPerWeek: number): boolean {
  const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  
  switch (daysPerWeek) {
    case 7:
      return true; // All days
    case 6:
      return dayOfWeek !== 0; // Monday to Saturday
    case 5:
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
    case 4:
      return dayOfWeek >= 1 && dayOfWeek <= 4; // Monday to Thursday
    case 3:
      return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon, Wed, Fri
    case 2:
      return dayOfWeek === 2 || dayOfWeek === 4; // Tue, Thu
    case 1:
      return dayOfWeek === 3; // Wednesday only
    default:
      return false;
  }
}

/**
 * Find the next available time slot on a given day
 */
export function findNextAvailableSlot(
  date: Date,
  dailyStudyHours: number,
  userEvents: UserEvent[]
): TimeSlot | null {
  const sessionHours = Math.max(MIN_SESSION_HOURS, Math.floor(dailyStudyHours));
  const startTime = '09:00';
  const endTime = addHoursToTime(startTime, sessionHours);
  
  const potentialSlot: TimeSlot = {
    date: format(date, 'yyyy-MM-dd'),
    startTime,
    endTime,
    hours: sessionHours
  };

  // Check if this slot overlaps with any user events
  if (overlapsWithUserEvent(potentialSlot, userEvents)) {
    return null; // Could implement more sophisticated scheduling here
  }

  return potentialSlot;
}

/**
 * Check if a time slot overlaps with any user events
 */
export function overlapsWithUserEvent(
  slot: TimeSlot,
  userEvents: UserEvent[]
): boolean {
  const slotDate = parseISO(slot.date);
  const slotStart = timeToMinutes(slot.startTime);
  const slotEnd = timeToMinutes(slot.endTime);

  for (const event of userEvents) {
    const eventDate = parseISO(event.date);
    
    // Check if dates match (considering recurring events)
    let datesMatch = isSameDay(slotDate, eventDate);
    
    if (!datesMatch && event.recurringWeekly) {
      // Check if it's a recurring event on the same day of week
      datesMatch = slotDate.getDay() === eventDate.getDay();
    }

    if (datesMatch) {
      const eventStart = timeToMinutes(event.startTime);
      const eventEnd = timeToMinutes(event.endTime);
      
      // Check for time overlap
      if (slotStart < eventEnd && slotEnd > eventStart) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Convert time string to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Add hours to a time string
 */
function addHoursToTime(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + (hours * 60);
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
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
    topics: [{
      name: session.topic,
      type: 'main'
    }],
    hours: timeSlot.hours,
    date: timeSlot.date,
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    passNumber: session.pass,
    isInterjection: session.isReview
  };
}