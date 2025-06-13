import { SessionStub } from './selector';
import { ConditionAllocation } from './buildHourPlan';

/**
 * Slice condition allocations into variable-length sessions (30-min multiples, 1-2h range).
 * 
 * Algorithm:
 * 1. Greedy pack: add conditions until session ≥60min and ≤120min
 * 2. If adding next would exceed 120min, start new session
 * 3. Ensure minimum 60min per session, round to 30-min multiples
 */
export function sliceConditions(plan: ConditionAllocation[]): SessionStub[] {
  const stubs: SessionStub[] = [];
  let buffer: string[] = [];
  let accumulatedMinutes = 0;
  let currentSubject = '';

  const flush = (subject: string) => {
    if (!buffer.length) return;
    stubs.push({
      subject,
      topics: [...buffer],
      minutes: accumulatedMinutes,
      isReview: false
    });
    buffer = [];
    accumulatedMinutes = 0;
  };

  plan.forEach(p => {
    const minutes = p.minutes;
    // Round to 30-minute chunks, minimum 30 minutes
    const chunk = Math.max(30, Math.min(120, Math.round(minutes / 30) * 30));
    
    // If different subject or would exceed 120 minutes, flush current session
    if (p.subject !== currentSubject || accumulatedMinutes + chunk > 120) {
      if (currentSubject) flush(currentSubject);
      currentSubject = p.subject;
    }
    
    buffer.push(p.condition);
    accumulatedMinutes += chunk;
    
    // If we've reached minimum session length and this is a good stopping point
    if (accumulatedMinutes >= 60 && (accumulatedMinutes === 120 || chunk >= 60)) {
      flush(p.subject);
      currentSubject = '';
    }
  });

  // Flush any remaining session
  if (currentSubject && buffer.length > 0) {
    flush(currentSubject);
  }

  return stubs;
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