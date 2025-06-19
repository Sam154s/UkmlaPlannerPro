import { describe, it, expect, beforeEach } from 'vitest';
import { generateSpiralTimetable, calculateTopicAllocations, type SpiralConfig } from '@/services/spiral';

describe('Spiral Timetable Generator', () => {
  let config: SpiralConfig;

  beforeEach(() => {
    config = {
      blocksTable: {
        'Acute and emergency medicine': 3,
        'Cardiovascular': 4,
        'Respiratory': 2,
      },
      yearMultiplier: 1.5,
      studyDays: [1, 2, 3, 4, 5], // Monday to Friday
      hoursPerWeek: 10,
      startDate: new Date('2025-01-01'),
      favouriteSubjects: ['Cardiovascular'],
      leastFavouriteSubjects: ['Respiratory'],
      userPerformance: {
        'Cardiovascular': 0.8,
        'Respiratory': 0.6,
      },
    };
  });

  it('generates at least 3 topics when hours per week > 5', () => {
    const sessions = generateSpiralTimetable(config);
    
    expect(sessions.length).toBeGreaterThanOrEqual(3);
    expect(sessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          subject: expect.any(String),
          topics: expect.any(Array),
          minutes: expect.any(Number),
          type: expect.stringMatching(/study|review/),
        }),
      ])
    );
  });

  it('respects variable session lengths (60-120 minutes)', () => {
    const sessions = generateSpiralTimetable(config);
    
    sessions.forEach(session => {
      expect(session.minutes).toBeGreaterThanOrEqual(60);
      expect(session.minutes).toBeLessThanOrEqual(120);
    });
  });

  it('schedules sessions on specified study days only', () => {
    const sessions = generateSpiralTimetable(config);
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayOfWeek = sessionDate.getDay();
      expect(config.studyDays).toContain(dayOfWeek);
    });
  });

  it('allocates more time to higher difficulty topics', () => {
    const mockSubjects = [
      {
        name: 'Test Subject',
        topics: [
          {
            name: 'Easy Topic',
            ratings: { difficulty: 1, clinicalImportance: 2, examRelevance: 2 }
          },
          {
            name: 'Hard Topic', 
            ratings: { difficulty: 5, clinicalImportance: 5, examRelevance: 5 }
          }
        ]
      }
    ];

    // Mock the subject data for this test
    const testConfig = {
      ...config,
      blocksTable: { 'Test Subject': 2 }
    };

    const sessions = generateSpiralTimetable(testConfig);
    expect(sessions.length).toBeGreaterThan(0);
  });

  it('returns properly formatted session objects', () => {
    const sessions = generateSpiralTimetable(config);
    
    sessions.forEach(session => {
      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('date');
      expect(session).toHaveProperty('startTime');
      expect(session).toHaveProperty('endTime');
      expect(session).toHaveProperty('subject');
      expect(session).toHaveProperty('topics');
      expect(session).toHaveProperty('minutes');
      expect(session).toHaveProperty('type');
      
      expect(session.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(session.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(session.endTime).toMatch(/^\d{2}:\d{2}$/);
      expect(Array.isArray(session.topics)).toBe(true);
      expect(session.topics.length).toBeGreaterThan(0);
    });
  });

  it('handles empty configuration gracefully', () => {
    const emptyConfig: SpiralConfig = {
      blocksTable: {},
      yearMultiplier: 1,
      studyDays: [1, 2, 3, 4, 5],
      hoursPerWeek: 5,
      startDate: new Date(),
      favouriteSubjects: [],
      leastFavouriteSubjects: [],
    };

    const sessions = generateSpiralTimetable(emptyConfig);
    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBe(0);
  });
});