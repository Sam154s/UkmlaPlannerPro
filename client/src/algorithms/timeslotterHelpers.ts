import { UserEvent } from '../types/spiral';
import { DAILY_START_TIME, DAILY_END_TIME } from '../constants';

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
}

// Convert time string (HH:MM) to minutes for comparison
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes back to time string (HH:MM)
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Helper to add hours to a time string
export function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const newHours = h + Math.floor(hours);
  const newMinutes = m + ((hours % 1) * 60);
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

// Check if a time slot overlaps with user events
export function overlapsWithUserEvent(slot: TimeSlot, userEvents?: UserEvent[]): boolean {
  if (!userEvents) return false;
  
  return userEvents.some(event => {
    // Simple date comparison for now - could be enhanced for recurring events
    if (event.date !== slot.date) return false;
    
    const eventStart = timeToMinutes(event.startTime);
    const eventEnd = timeToMinutes(event.endTime);
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    
    return (slotStart < eventEnd && slotEnd > eventStart);
  });
}

// Find the next available time slot that doesn't overlap with user events
export function findNextAvailableSlot(
  date: Date,
  sessionHours: number,
  userEvents?: UserEvent[],
  hoursUsedToday: number = 0
): { slot: TimeSlot | null, newDate: Date, newDailyHoursUsed: number } {
  const maxDailyMinutes = timeToMinutes(DAILY_END_TIME) - timeToMinutes(DAILY_START_TIME);
  const sessionMinutes = sessionHours * 60;
  const usedMinutes = hoursUsedToday * 60;

  if (usedMinutes + sessionMinutes > maxDailyMinutes) {
    // No more time available today
    return {
      slot: null,
      newDate: date,
      newDailyHoursUsed: hoursUsedToday
    };
  }

  // Calculate start time based on hours already used
  const baseStartMinutes = timeToMinutes(DAILY_START_TIME) + usedMinutes;
  let currentStartMinutes = baseStartMinutes;

  while (currentStartMinutes + sessionMinutes <= timeToMinutes(DAILY_END_TIME)) {
    const startTime = minutesToTime(currentStartMinutes);
    const endTime = minutesToTime(currentStartMinutes + sessionMinutes);

    const potentialSlot: TimeSlot = {
      date: date.toISOString().split('T')[0],
      startTime: startTime,
      endTime: endTime,
      hours: sessionHours
    };

    // Check for conflicts with user events
    if (!overlapsWithUserEvent(potentialSlot, userEvents)) {
      return {
        slot: potentialSlot,
        newDate: date,
        newDailyHoursUsed: hoursUsedToday + sessionHours
      };
    }

    // Move to next possible start time (30-minute increments)
    currentStartMinutes += 30;
  }

  // No slot found for this day
  return {
    slot: null,
    newDate: date,
    newDailyHoursUsed: hoursUsedToday
  };
}