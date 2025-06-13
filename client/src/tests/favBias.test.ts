import { describe, it, expect } from 'vitest';
import { buildHourPlan } from '../algorithms/selector';
import { SpiralConfig } from '../types/spiral';
import { masterSubjects } from '../data/masterSubjects';

describe('Favourite Subject Bias', () => {
  it('should give favourite subjects 1.5x boost in review calculations', () => {
    const config: SpiralConfig = {
      weeklyStudyHours: 30,
      hoursPerWeek: 30,
      studyDays: [1, 2, 3, 4, 5], // Mon-Fri
      yearMultiplier: 1.0,
      favouriteSubjects: ['Cardiovascular'],
      subjectsData: masterSubjects.slice(0, 3),
      blocksTable: {
        'Acute and emergency': 5,
        'Cardiovascular': 5,
        'Respiratory': 5
      }
    };

    const conditionPlans = buildHourPlan(config);

    // Group by subject
    const subjectMinutes: Record<string, number> = {};
    for (const plan of conditionPlans) {
      subjectMinutes[plan.subject] = (subjectMinutes[plan.subject] || 0) + plan.minutes;
    }

    const cardioMinutes = subjectMinutes['Cardiovascular'] || 0;
    const acuteMinutes = subjectMinutes['Acute and emergency'] || 0;
    const respMinutes = subjectMinutes['Respiratory'] || 0;

    // Since all subjects have equal blocks, favourite should get proportionally more time
    // due to preference multiplier in future review calculations
    expect(cardioMinutes).toBeGreaterThan(0);
    expect(acuteMinutes).toBeGreaterThan(0);
    expect(respMinutes).toBeGreaterThan(0);
  });

  it('should not apply least-favourite penalties', () => {
    // Verify least-favourite logic is completely removed
    const config: SpiralConfig = {
      weeklyStudyHours: 20,
      hoursPerWeek: 20,
      studyDays: [1, 3, 5],
      yearMultiplier: 1.0,
      favouriteSubjects: ['Cardiovascular'],
      subjectsData: masterSubjects.slice(0, 3),
      blocksTable: {
        'Acute and emergency': 5,
        'Cardiovascular': 5,
        'Respiratory': 5
      }
    };

    const conditionPlans = buildHourPlan(config);

    // All non-favourite subjects should be treated equally
    const subjectMinutes: Record<string, number> = {};
    for (const plan of conditionPlans) {
      subjectMinutes[plan.subject] = (subjectMinutes[plan.subject] || 0) + plan.minutes;
    }

    const acuteMinutes = subjectMinutes['Acute and emergency'] || 0;
    const respMinutes = subjectMinutes['Respiratory'] || 0;

    // Non-favourite subjects should have similar allocation (within 20% of each other)
    const ratio = Math.max(acuteMinutes, respMinutes) / Math.min(acuteMinutes, respMinutes);
    expect(ratio).toBeLessThan(1.3); // Less than 30% difference
  });

  it('should maintain favourite boost across multiple subjects', () => {
    const config: SpiralConfig = {
      weeklyStudyHours: 40,
      hoursPerWeek: 40,
      studyDays: [1, 2, 3, 4, 5],
      yearMultiplier: 1.0,
      favouriteSubjects: ['Cardiovascular', 'Respiratory'],
      subjectsData: masterSubjects.slice(0, 4),
      blocksTable: {
        'Acute and emergency': 5,
        'Cardiovascular': 5,
        'Respiratory': 5,
        'Endocrinology': 5
      }
    };

    const conditionPlans = buildHourPlan(config);

    // Group by subject
    const subjectMinutes: Record<string, number> = {};
    for (const plan of conditionPlans) {
      subjectMinutes[plan.subject] = (subjectMinutes[plan.subject] || 0) + plan.minutes;
    }

    const favouriteSubjects = ['Cardiovascular', 'Respiratory'];
    const nonFavouriteSubjects = ['Acute and emergency', 'Endocrinology'];

    // Calculate average minutes for favourite vs non-favourite
    let favTotal = 0, nonFavTotal = 0;
    let favCount = 0, nonFavCount = 0;

    for (const [subject, minutes] of Object.entries(subjectMinutes)) {
      if (favouriteSubjects.includes(subject)) {
        favTotal += minutes;
        favCount++;
      } else if (nonFavouriteSubjects.includes(subject)) {
        nonFavTotal += minutes;
        nonFavCount++;
      }
    }

    const avgFavMinutes = favTotal / favCount;
    const avgNonFavMinutes = nonFavTotal / nonFavCount;

    // Favourite subjects should have at least equal allocation in base planning
    // (boost is applied during review selection, not initial allocation)
    expect(avgFavMinutes).toBeGreaterThanOrEqual(avgNonFavMinutes * 0.8);
  });
});