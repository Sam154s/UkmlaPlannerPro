import { describe, it, expect } from 'vitest';
import { placeSessions } from '../algorithms/timeslotter';
import { SessionStub } from '../algorithms/selector';

describe('Calendar Overlap Tests', () => {
  it('should not overlap with recurring Tue/Thu events', () => {
    const mockSessions: SessionStub[] = [
      { subject: 'Test Subject', topic: 'Topic 1', pass: 1, isReview: false },
      { subject: 'Test Subject', topic: 'Topic 2', pass: 1, isReview: false },
      { subject: 'Test Subject', topic: 'Topic 3', pass: 1, isReview: false },
      { subject: 'Test Subject', topic: 'Topic 4', pass: 1, isReview: false }
    ];

    const userEvents = [
      {
        name: 'Weekly Meeting',
        date: '2024-01-02', // Tuesday
        startTime: '10:00',
        endTime: '12:00',
        recurringWeekly: true,
        recurringDays: ['2', '4'], // Tuesday and Thursday
        type: 'personal' as const
      }
    ];

    const studyBlocks = placeSessions(mockSessions, {
      startDate: new Date('2024-01-01'),
      daysPerWeek: 5,
      dailyStudyHours: 4,
      userEvents
    });

    // Check no overlaps with recurring events
    studyBlocks.forEach(block => {
      const blockDate = new Date(block.date);
      const dayOfWeek = blockDate.getDay();
      
      if (dayOfWeek === 2 || dayOfWeek === 4) { // Tue or Thu
        const blockStart = timeToMinutes(block.startTime);
        const blockEnd = timeToMinutes(block.endTime);
        const eventStart = timeToMinutes('10:00');
        const eventEnd = timeToMinutes('12:00');
        
        const hasOverlap = blockStart < eventEnd && blockEnd > eventStart;
        expect(hasOverlap).toBe(false);
      }
    });
  });
});

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}