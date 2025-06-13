import { describe, it, expect } from 'vitest';
import { generateSpiralTimetable } from '../algorithms/generate';
import { SpiralConfig } from '../types/spiral';
import masterSubjects from '../data/masterSubjects';

describe('Study Day Constraints', () => {
  it('should only schedule sessions on specified study days', () => {
    const config: SpiralConfig = {
      weeklyStudyHours: 15,
      hoursPerWeek: 15,
      studyDays: [1, 3, 5], // Monday, Wednesday, Friday only
      yearMultiplier: 1.0,
      favouriteSubjects: [],
      subjectsData: masterSubjects.slice(0, 2),
      blocksTable: {
        'Acute and emergency': 3,
        'Cardiovascular': 3
      }
    };

    const studyBlocks = generateSpiralTimetable(config);

    // Check that all sessions are scheduled on allowed days
    for (const block of studyBlocks) {
      const date = new Date(block.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      expect(config.studyDays).toContain(dayOfWeek);
    }
  });

  it('should respect daily hour caps based on hoursPerWeek / studyDays.length', () => {
    const config: SpiralConfig = {
      weeklyStudyHours: 12,
      hoursPerWeek: 12,
      studyDays: [2, 4], // Tuesday, Thursday (2 days)
      yearMultiplier: 1.0,
      favouriteSubjects: [],
      subjectsData: masterSubjects.slice(0, 2),
      blocksTable: {
        'Acute and emergency': 4,
        'Cardiovascular': 4
      }
    };

    const studyBlocks = generateSpiralTimetable(config);
    const expectedDailyHours = 12 / 2; // 6 hours per day

    // Group sessions by date and check daily totals
    const dailyHours: Record<string, number> = {};
    for (const block of studyBlocks) {
      dailyHours[block.date] = (dailyHours[block.date] || 0) + block.hours;
    }

    // No day should exceed the calculated daily cap
    for (const [date, hours] of Object.entries(dailyHours)) {
      expect(hours).toBeLessThanOrEqual(expectedDailyHours + 0.5); // 0.5h tolerance
    }
  });

  it('should handle single study day scheduling', () => {
    const config: SpiralConfig = {
      weeklyStudyHours: 8,
      hoursPerWeek: 8,
      studyDays: [3], // Wednesday only
      yearMultiplier: 1.0,
      favouriteSubjects: [],
      subjectsData: masterSubjects.slice(0, 1),
      blocksTable: {
        'Acute and emergency': 2
      }
    };

    const studyBlocks = generateSpiralTimetable(config);

    // All sessions should be on Wednesday (day 3)
    for (const block of studyBlocks) {
      const date = new Date(block.date);
      const dayOfWeek = date.getDay();
      expect(dayOfWeek).toBe(3);
    }

    // Daily hours should not exceed weekly hours (since only 1 day)
    const dailyHours: Record<string, number> = {};
    for (const block of studyBlocks) {
      dailyHours[block.date] = (dailyHours[block.date] || 0) + block.hours;
    }

    for (const hours of Object.values(dailyHours)) {
      expect(hours).toBeLessThanOrEqual(8);
    }
  });

  it('should distribute sessions across multiple weeks when needed', () => {
    const config: SpiralConfig = {
      weeklyStudyHours: 6,
      hoursPerWeek: 6,
      studyDays: [1], // Monday only
      yearMultiplier: 1.0,
      favouriteSubjects: [],
      subjectsData: masterSubjects.slice(0, 2),
      blocksTable: {
        'Acute and emergency': 5,
        'Cardiovascular': 5
      }
    };

    const studyBlocks = generateSpiralTimetable(config);

    // Should have sessions spanning multiple weeks
    const dates = studyBlocks.map(block => new Date(block.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const daysDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    expect(daysDiff).toBeGreaterThan(7); // Should span more than one week
  });

  it('should handle weekend-only study patterns', () => {
    const config: SpiralConfig = {
      weeklyStudyHours: 10,
      hoursPerWeek: 10,
      studyDays: [0, 6], // Sunday and Saturday
      yearMultiplier: 1.0,
      favouriteSubjects: [],
      subjectsData: masterSubjects.slice(0, 2),
      blocksTable: {
        'Acute and emergency': 3,
        'Cardiovascular': 3
      }
    };

    const studyBlocks = generateSpiralTimetable(config);

    // All sessions should be on weekends
    for (const block of studyBlocks) {
      const date = new Date(block.date);
      const dayOfWeek = date.getDay();
      expect([0, 6]).toContain(dayOfWeek); // Sunday or Saturday
    }

    // Daily cap should be 5 hours (10 hours / 2 days)
    const dailyHours: Record<string, number> = {};
    for (const block of studyBlocks) {
      dailyHours[block.date] = (dailyHours[block.date] || 0) + block.hours;
    }

    for (const hours of Object.values(dailyHours)) {
      expect(hours).toBeLessThanOrEqual(5.5); // 5h + tolerance
    }
  });
});