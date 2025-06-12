import { describe, it, expect } from 'vitest';
import { buildSessionStream } from './algorithms/selector';
import { placeSessions } from './algorithms/timeslotter';
import { SelectorConfig, CalendarConfig } from './types/session';

describe('Spiral Algorithm Integration', () => {
  const mockSubjectsData = [
    {
      name: 'Acute and emergency',
      topics: [
        {
          name: 'Cardiac arrest',
          ratings: { difficulty: 8, clinicalImportance: 9, examRelevance: 8 }
        },
        {
          name: 'Shock',
          ratings: { difficulty: 7, clinicalImportance: 8, examRelevance: 7 }
        },
        {
          name: 'Trauma',
          ratings: { difficulty: 6, clinicalImportance: 7, examRelevance: 6 }
        }
      ]
    },
    {
      name: 'Cardiovascular',
      topics: [
        {
          name: 'Heart failure',
          ratings: { difficulty: 6, clinicalImportance: 8, examRelevance: 7 }
        },
        {
          name: 'Arrhythmias',
          ratings: { difficulty: 7, clinicalImportance: 7, examRelevance: 8 }
        }
      ]
    }
  ];

  const mockBaseBlockCounts = {
    'Acute and emergency': 10,
    'Cardiovascular': 8
  };

  it('should generate review sessions every 10th element by default', () => {
    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 3,
      favouriteSubjects: [],
      k: 10
    };

    const sessions = buildSessionStream(config);
    
    // Find positions of review sessions
    const reviewIndices = sessions
      .map((session, index) => session.isReview ? index : -1)
      .filter(index => index !== -1);

    // Every 10th element should be a review (positions 9, 19, 29, etc.)
    reviewIndices.forEach(index => {
      expect((index + 1) % 10).toBe(0);
    });
  });

  it('should place sessions in calendar respecting study days', () => {
    const selectorConfig: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 1,
      favouriteSubjects: [],
      k: 10
    };

    const calendarConfig: CalendarConfig = {
      startDate: new Date('2024-01-01'), // Monday
      daysPerWeek: 5, // Weekdays only
      dailyStudyHours: 2,
      userEvents: []
    };

    const sessions = buildSessionStream(selectorConfig);
    const studyBlocks = placeSessions(sessions.slice(0, 10), calendarConfig);

    // Should have placed sessions
    expect(studyBlocks.length).toBeGreaterThan(0);

    // All blocks should be on weekdays
    studyBlocks.forEach(block => {
      const date = new Date(block.date);
      const dayOfWeek = date.getDay();
      expect(dayOfWeek).toBeGreaterThan(0); // Not Sunday
      expect(dayOfWeek).toBeLessThan(6); // Not Saturday
    });
  });

  it('should avoid user events when scheduling', () => {
    const selectorConfig: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 1,
      favouriteSubjects: [],
      k: 10
    };

    const calendarConfig: CalendarConfig = {
      startDate: new Date('2024-01-01'),
      daysPerWeek: 7,
      dailyStudyHours: 2,
      userEvents: [
        {
          name: 'Doctor appointment',
          date: '2024-01-01',
          startTime: '09:00',
          endTime: '11:00'
        }
      ]
    };

    const sessions = buildSessionStream(selectorConfig);
    const studyBlocks = placeSessions(sessions.slice(0, 5), calendarConfig);

    // Should skip the first day due to conflict
    if (studyBlocks.length > 0) {
      expect(studyBlocks[0].date).not.toBe('2024-01-01');
    }
  });

  it('should maintain spiral pattern across passes', () => {
    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 2,
      favouriteSubjects: [],
      k: 20 // High interval to avoid review interference
    };

    const sessions = buildSessionStream(config);
    const mainSessions = sessions.filter(s => !s.isReview);

    // Should cycle through subjects in order
    const subjectPattern = mainSessions.map(s => s.subject);
    
    // First few sessions should follow the pattern
    expect(subjectPattern[0]).toBe('Acute and emergency');
    expect(subjectPattern[1]).toBe('Cardiovascular');
    expect(subjectPattern[2]).toBe('Acute and emergency');
    expect(subjectPattern[3]).toBe('Cardiovascular');
  });

  it('should increment pass numbers correctly', () => {
    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 2,
      favouriteSubjects: [],
      k: 50 // Very high to avoid reviews
    };

    const sessions = buildSessionStream(config);
    const mainSessions = sessions.filter(s => !s.isReview);

    // All sessions in first pass should have pass = 1
    const firstPassSessions = mainSessions.filter(s => s.pass === 1);
    expect(firstPassSessions.length).toBeGreaterThan(0);

    // Should have second pass sessions
    const secondPassSessions = mainSessions.filter(s => s.pass === 2);
    expect(secondPassSessions.length).toBeGreaterThan(0);
  });
});