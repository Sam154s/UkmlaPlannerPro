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
  startTime: string,
  hours: number,
  hoursPerDay: number,
  dailyHoursUsed: number,
  availableDays: number[],
  userEvents?: UserEvent[]
): { slot: TimeSlot, newDate: Date, newDailyHoursUsed: number } {
  let currentDate = new Date(date);
  let currDailyHoursUsed = dailyHoursUsed;
  let requestedHours = hours; // Store the originally requested hours
  
  // Try to find a slot today
  if (currDailyHoursUsed < hoursPerDay) {
    const potentialSlot: TimeSlot = {
      date: currentDate.toISOString().split('T')[0],
      startTime: addHours(startTime, currDailyHoursUsed),
      endTime: addHours(startTime, currDailyHoursUsed + hours),
      hours
    };
    
    if (!overlapsWithUserEvent(potentialSlot, userEvents)) {
      return {
        slot: potentialSlot,
        newDate: currentDate,
        newDailyHoursUsed: currDailyHoursUsed + hours
      };
    }
    
    // If slot overlaps, try to find another slot later today
    const startTimeMinutes = timeToMinutes(potentialSlot.startTime);
    const endTimeMinutes = timeToMinutes(DAILY_END_TIME);
    let nextStartMinutes = startTimeMinutes;
    
    // Try 1-minute increments for more precise scheduling
    while (nextStartMinutes + hours * 60 <= endTimeMinutes) {
      // Try 1-minute increments
      nextStartMinutes += 1;
      
      const nextStartTime = minutesToTime(nextStartMinutes);
      const nextEndTime = addHours(nextStartTime, hours);
      
      const nextSlot: TimeSlot = {
        date: currentDate.toISOString().split('T')[0],
        startTime: nextStartTime,
        endTime: nextEndTime,
        hours
      };
      
      if (!overlapsWithUserEvent(nextSlot, userEvents)) {
        // Calculate new daily hours used based on the end time
        const newHoursUsed = (timeToMinutes(nextEndTime) - timeToMinutes(startTime)) / 60;
        return {
          slot: nextSlot,
          newDate: currentDate,
          newDailyHoursUsed: newHoursUsed > hoursPerDay ? hoursPerDay : newHoursUsed
        };
      }
    }
    
    // If we couldn't find a slot with the requested hours, 
    // and this is a main block (2 hours), try with 1 hour instead
    if (hours === 2) {
      return findNextAvailableSlot(
        currentDate,
        startTime,
        1, // Fallback to 1 hour
        hoursPerDay,
        dailyHoursUsed,
        availableDays,
        userEvents
      );
    }
  }
  
  // If we couldn't find a slot today, try the next day
  do {
    currentDate.setDate(currentDate.getDate() + 1);
  } while (!availableDays.includes(currentDate.getDay() || 7));
  
  // Start fresh in the morning with the originally requested hours
  const nextDaySlot: TimeSlot = {
    date: currentDate.toISOString().split('T')[0],
    startTime: DAILY_START_TIME,
    endTime: addHours(DAILY_START_TIME, requestedHours),
    hours: requestedHours
  };
  
  // If this slot overlaps with events, recursively find the next one
  if (overlapsWithUserEvent(nextDaySlot, userEvents)) {
    return findNextAvailableSlot(
      currentDate,
      DAILY_START_TIME,
      requestedHours,
      hoursPerDay,
      0,
      availableDays,
      userEvents
    );
  }
  
  return {
    slot: nextDaySlot,
    newDate: currentDate,
    newDailyHoursUsed: requestedHours
  };
}