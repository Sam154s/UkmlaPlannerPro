import { describe, it, expect } from 'vitest';
import { buildSessionStream } from '../client/src/algorithms/selector';
import { SelectorConfig } from '../client/src/types/session';

describe('Session Selector', () => {
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
    'Acute and emergency': 15,
    'Cardiovascular': 12
  };

  it('should respect subject quotas', () => {
    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 1,
      favouriteSubjects: [],
      k: 10
    };

    const sessions = buildSessionStream(config);
    
    // Count sessions per subject
    const subjectCounts = sessions.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Check quotas: baseBlocks * 5 * passCoverage
    expect(subjectCounts['Acute and emergency']).toBeLessThanOrEqual(15 * 5 * 1);
    expect(subjectCounts['Cardiovascular']).toBeLessThanOrEqual(12 * 5 * 1);
  });

  it('should generate review sessions every k intervals', () => {
    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 2,
      favouriteSubjects: [],
      k: 5
    };

    const sessions = buildSessionStream(config);
    
    // Check that every 5th session (after the first few) is a review
    const reviewPositions = sessions
      .map((session, index) => ({ session, index }))
      .filter(({ session }) => session.isReview)
      .map(({ index }) => index);

    // Should have review sessions at positions 5, 10, 15, etc.
    reviewPositions.forEach(position => {
      expect((position + 1) % 5).toBe(0);
    });
  });

  it('should sort topics by composite score within each subject', () => {
    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 1,
      favouriteSubjects: [],
      k: 10
    };

    const sessions = buildSessionStream(config);
    
    // First session should be from Acute and emergency (first in order)
    expect(sessions[0].subject).toBe('Acute and emergency');
    
    // Should pick highest composite score topic first
    // Cardiac arrest: 0.4*8 + 0.3*9 + 0.3*8 = 8.3
    // Shock: 0.4*7 + 0.3*8 + 0.3*7 = 7.3
    expect(sessions[0].topic).toBe('Cardiac arrest');
  });

  it('should follow fixed subject order', () => {
    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: mockBaseBlockCounts,
      passCoverage: 1,
      favouriteSubjects: [],
      k: 10
    };

    const sessions = buildSessionStream(config);
    
    // Filter out review sessions and check subject order
    const mainSessions = sessions.filter(s => !s.isReview);
    
    // Should alternate between subjects in fixed order
    expect(mainSessions[0].subject).toBe('Acute and emergency');
    expect(mainSessions[1].subject).toBe('Cardiovascular');
    expect(mainSessions[2].subject).toBe('Acute and emergency');
    expect(mainSessions[3].subject).toBe('Cardiovascular');
  });
});