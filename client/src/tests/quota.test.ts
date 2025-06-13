import { describe, it, expect } from 'vitest';
import { buildSessionStream, SelectorConfig } from '../algorithms/selector';

describe('Quota Management', () => {
  it('should ensure each subject emits exactly its quota of sessions', () => {
    const mockSubjectsData = [
      {
        name: 'Subject A',
        topics: [
          { name: 'Topic 1', ratings: { difficulty: 0.8, clinicalImportance: 0.9, examRelevance: 0.8 } },
          { name: 'Topic 2', ratings: { difficulty: 0.7, clinicalImportance: 0.8, examRelevance: 0.7 } }
        ]
      },
      {
        name: 'Subject B',
        topics: [
          { name: 'Topic X', ratings: { difficulty: 0.6, clinicalImportance: 0.7, examRelevance: 0.9 } }
        ]
      }
    ];

    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: {
        'Subject A': 2,
        'Subject B': 3
      },
      passCoverage: 3,
      favouriteSubjects: [],
      k: 10
    };

    const sessions = buildSessionStream(config);
    
    // Calculate expected quotas: baseBlocks × 5 × passCoverage
    const expectedQuotaA = 2 * 5 * 3; // 30
    const expectedQuotaB = 3 * 5 * 3; // 45

    // Count actual sessions per subject
    const sessionCounts = sessions.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    expect(sessionCounts['Subject A']).toBe(expectedQuotaA);
    expect(sessionCounts['Subject B']).toBe(expectedQuotaB);
  });

  it('should stop generating sessions when all quotas are reached', () => {
    const mockSubjectsData = [
      {
        name: 'Single Subject',
        topics: [
          { name: 'Only Topic', ratings: { difficulty: 0.5, clinicalImportance: 0.5, examRelevance: 0.5 } }
        ]
      }
    ];

    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: { 'Single Subject': 1 },
      passCoverage: 1,
      favouriteSubjects: [],
      k: 5
    };

    const sessions = buildSessionStream(config);
    
    // Expected quota: 1 × 5 × 1 = 5
    const expectedQuota = 1 * 5 * 1;
    
    expect(sessions.length).toBe(expectedQuota);
    expect(sessions.every(s => s.subject === 'Single Subject')).toBe(true);
  });
});