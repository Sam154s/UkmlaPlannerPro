import { describe, it, expect } from 'vitest';
import { buildHourPlan } from '../algorithms/selector';
import { SpiralConfig } from '../types/spiral';
import masterSubjects from '../data/masterSubjects';

describe('Hour Quota System', () => {
  it('should allocate subject hours according to blocks × 2.5 × yearMultiplier', () => {
    const blocksTable = {
      'Acute and emergency': 8,
      'Cardiovascular': 10,
      'Respiratory': 6
    };

    const config: SpiralConfig = {
      weeklyStudyHours: 25,
      hoursPerWeek: 25,
      studyDays: [1, 3, 5], // Mon, Wed, Fri
      yearMultiplier: 1.6, // 2nd year
      favouriteSubjects: ['Cardiovascular'],
      subjectsData: masterSubjects.slice(0, 3),
      blocksTable
    };

    const conditionPlans = buildHourPlan(config);

    // Calculate expected hours per subject
    const expectedHours = {
      'Acute and emergency': 8 * 2.5 * 1.6, // 32 hours
      'Cardiovascular': 10 * 2.5 * 1.6,     // 40 hours  
      'Respiratory': 6 * 2.5 * 1.6          // 24 hours
    };

    // Group plans by subject and sum minutes
    const actualMinutesBySubject: Record<string, number> = {};
    for (const plan of conditionPlans) {
      actualMinutesBySubject[plan.subject] = (actualMinutesBySubject[plan.subject] || 0) + plan.minutes;
    }

    // Verify totals are approximately correct (within 5% tolerance)
    for (const [subject, expectedMinutes] of Object.entries(expectedHours)) {
      const actualMinutes = actualMinutesBySubject[subject] || 0;
      const actualHours = actualMinutes / 60;
      const tolerance = expectedMinutes * 0.05; // 5% tolerance
      
      expect(actualHours).toBeGreaterThanOrEqual(expectedMinutes - tolerance);
      expect(actualHours).toBeLessThanOrEqual(expectedMinutes + tolerance);
    }
  });

  it('should respect minimum 30-minute condition allocation', () => {
    const config: SpiralConfig = {
      weeklyStudyHours: 5,
      hoursPerWeek: 5,
      studyDays: [1, 3, 5],
      yearMultiplier: 1.0,
      favouriteSubjects: [],
      subjectsData: masterSubjects.slice(0, 2),
      blocksTable: { 'Acute and emergency': 2, 'Cardiovascular': 2 }
    };

    const conditionPlans = buildHourPlan(config);

    // All conditions should have at least 30 minutes
    for (const plan of conditionPlans) {
      expect(plan.minutes).toBeGreaterThanOrEqual(30);
    }
  });

  it('should adjust allocation based on mastery levels', () => {
    const userPerformance = {
      topics: {
        'Cardiovascular: Acute coronary syndromes': 0.3, // Low mastery
        'Cardiovascular: Heart failure': 0.9             // High mastery
      }
    };

    const config: SpiralConfig = {
      weeklyStudyHours: 20,
      hoursPerWeek: 20,
      studyDays: [1, 3, 5],
      yearMultiplier: 1.0,
      favouriteSubjects: [],
      subjectsData: masterSubjects.filter(s => s.name === 'Cardiovascular'),
      blocksTable: { 'Cardiovascular': 8 },
      userPerformance
    };

    const conditionPlans = buildHourPlan(config);

    const acsPlan = conditionPlans.find(p => p.condition === 'Acute coronary syndromes');
    const hfPlan = conditionPlans.find(p => p.condition === 'Heart failure');

    // Low mastery condition should get more time than high mastery
    if (acsPlan && hfPlan) {
      expect(acsPlan.minutes).toBeGreaterThan(hfPlan.minutes);
    }
  });
});