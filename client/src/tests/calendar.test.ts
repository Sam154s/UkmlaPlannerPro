import { describe, it, expect } from 'vitest';
import { placeSessions, CalendarConfig } from '../algorithms/timeslotter';
import { SessionStub } from '../algorithms/selector';

describe('Calendar Placement', () => {
  it('should not schedule sessions that overlap with recurring events', () => {
    const mockSessions: SessionStub[] = [
      { subject: 'Test Subject', topic: 'Topic 1', pass: 1, isReview: false },
      { subject: 'Test Subject', topic: 'Topic 2', pass: 1, isReview: false },
      { subject: 'Test Subject', topic: 'Topic 3', pass: 1, isReview: false },
      { subject: 'Test Subject', topic: 'Topic 4', pass: 1, isReview: false }
    ];

    // Create recurring Tuesday/Thursday events
    const userEvents = [
      {
        name: 'Recurring Meeting',
        date: '2024-01-02', // Tuesday
        startTime: '10:00',
        endTime: '12:00',
        recurringWeekly: true,
        recurringDays: ['2', '4'], // Tuesday and Thursday
        type: 'personal' as const
      }
    ];

    const config: CalendarConfig = {
      startDate: new Date('2024-01-01'), // Monday
      daysPerWeek: 5,
      dailyStudyHours: 4,
      userEvents
    };

    const studyBlocks = placeSessions(mockSessions, config);

    // Check that no study blocks overlap with the recurring events
    studyBlocks.forEach(block => {
      const blockDate = new Date(block.date);
      const dayOfWeek = blockDate.getDay();
      
      // If it's Tuesday (2) or Thursday (4)
      if (dayOfWeek === 2 || dayOfWeek === 4) {
        const blockStart = timeToMinutes(block.startTime);
        const blockEnd = timeToMinutes(block.endTime);
        const eventStart = timeToMinutes('10:00');
        const eventEnd = timeToMinutes('12:00');
        
        // Ensure no overlap
        const hasOverlap = blockStart < eventEnd && blockEnd > eventStart;
        expect(hasOverlap).toBe(false);
      }
    });
  });

  it('should respect daily study hour limits', () => {
    const mockSessions: SessionStub[] = Array.from({ length: 10 }, (_, i) => ({
      subject: 'Test Subject',
      topic: `Topic ${i + 1}`,
      pass: 1,
      isReview: false
    }));

    const config: CalendarConfig = {
      startDate: new Date('2024-01-01'),
      daysPerWeek: 5,
      dailyStudyHours: 4, // Max 4 hours per day = 2 sessions
      userEvents: []
    };

    const studyBlocks = placeSessions(mockSessions, config);

    // Group by date and check daily limits
    const blocksByDate = studyBlocks.reduce((acc, block) => {
      acc[block.date] = (acc[block.date] || []);
      acc[block.date].push(block);
      return acc;
    }, {} as Record<string, typeof studyBlocks>);

    Object.values(blocksByDate).forEach(dayBlocks => {
      const totalHours = dayBlocks.reduce((sum, block) => sum + block.hours, 0);
      expect(totalHours).toBeLessThanOrEqual(4);
    });
  });
});

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}