import { ConditionPlan } from '../types/spiral';

export interface SessionStub {
  subject: string;
  conditions: string[];
  minutes: number;
  isReview: boolean;
  pass?: number;
}

/**
 * Slice condition plans into variable-length sessions (30-min multiples, 1-2h range).
 * 
 * Algorithm:
 * 1. Greedy pack: add conditions until session ≥60min and ≤120min
 * 2. If adding next would exceed 120min, start new session
 * 3. Ensure minimum 60min per session
 */
export function sliceConditions(
  plans: ConditionPlan[], 
  minMinutes: number = 60, 
  maxMinutes: number = 120
): SessionStub[] {
  const sessions: SessionStub[] = [];
  let currentSession: {
    subject: string;
    conditions: string[];
    minutes: number;
    isReview: boolean;
  } | null = null;

  for (const plan of plans) {
    // If no current session or different subject, start new session
    if (!currentSession || currentSession.subject !== plan.subject) {
      // Finalize previous session if it exists
      if (currentSession && currentSession.minutes >= minMinutes) {
        sessions.push({
          ...currentSession
        });
      }
      
      // Start new session
      currentSession = {
        subject: plan.subject,
        conditions: [plan.condition],
        minutes: plan.minutes,
        isReview: plan.isReview
      };
      continue;
    }

    // Check if adding this condition would exceed max
    if (currentSession.minutes + plan.minutes > maxMinutes) {
      // Finalize current session if it meets minimum
      if (currentSession.minutes >= minMinutes) {
        sessions.push({
          ...currentSession
        });
      }
      
      // Start new session with this condition
      currentSession = {
        subject: plan.subject,
        conditions: [plan.condition],
        minutes: plan.minutes,
        isReview: plan.isReview
      };
    } else {
      // Add to current session
      currentSession.conditions.push(plan.condition);
      currentSession.minutes += plan.minutes;
    }
  }

  // Finalize last session
  if (currentSession && currentSession.minutes >= minMinutes) {
    sessions.push({
      ...currentSession
    });
  }

  return sessions;
}

/**
 * Round minutes to nearest 30-minute interval
 */
export function roundToInterval(minutes: number, interval: number = 30): number {
  return Math.round(minutes / interval) * interval;
}

/**
 * Convert minutes to hours and minutes display format
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}min`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}min`;
  }
}