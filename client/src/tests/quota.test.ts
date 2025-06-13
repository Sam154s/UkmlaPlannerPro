import { describe, it, expect } from 'vitest';
import { buildSessionStream, SelectorConfig } from '../algorithms/selector';
import { BASE_BLOCK_COUNTS } from '../data/studyBlockCounts';

describe('Quota Management', () => {
  it('each subject meets its exact quota', () => {
    const subjectsData = [
      {
        name: 'Cardiology',
        topics: [
          { name: 'Heart Failure', ratings: { difficulty: 0.8, clinicalImportance: 0.9, examRelevance: 0.8 } },
          { name: 'Arrhythmias', ratings: { difficulty: 0.7, clinicalImportance: 0.8, examRelevance: 0.7 } }
        ]
      },
      {
        name: 'Respiratory',
        topics: [
          { name: 'Asthma', ratings: { difficulty: 0.6, clinicalImportance: 0.7, examRelevance: 0.9 } },
          { name: 'COPD', ratings: { difficulty: 0.7, clinicalImportance: 0.8, examRelevance: 0.8 } }
        ]
      }
    ];

    const stream = buildSessionStream({
      subjectsData,
      baseBlockCounts: BASE_BLOCK_COUNTS,
      passCoverage: 1,
      favouriteSubjects: [],
      leastFavouriteSubjects: [],
      k: 10,
    });

    const counts = stream.reduce((m, s) => {
      m[s.subject] = (m[s.subject] || 0) + 1;
      return m;
    }, {} as Record<string, number>);

    for (const subj of subjectsData.map(s => s.name)) {
      expect(counts[subj]).toBe((BASE_BLOCK_COUNTS[subj] || 5) * 5);
    }
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