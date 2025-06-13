import { describe, it, expect } from 'vitest';
import { buildSessionStream, SelectorConfig } from '@/algorithms/selector';

describe('Spiral Algorithm Selector', () => {
  it('should prioritize favourite subjects over neutral subjects', () => {
    const mockSubjectsData = [
      {
        name: 'Favourite Subject',
        topics: [
          { name: 'Topic 1', ratings: { difficulty: 0.8, clinicalImportance: 0.9, examRelevance: 0.8 } },
          { name: 'Topic 2', ratings: { difficulty: 0.7, clinicalImportance: 0.8, examRelevance: 0.7 } }
        ]
      },
      {
        name: 'Neutral Subject',
        topics: [
          { name: 'Topic A', ratings: { difficulty: 0.8, clinicalImportance: 0.9, examRelevance: 0.8 } },
          { name: 'Topic B', ratings: { difficulty: 0.7, clinicalImportance: 0.8, examRelevance: 0.7 } }
        ]
      },
      {
        name: 'Least Favourite Subject',
        topics: [
          { name: 'Topic X', ratings: { difficulty: 0.8, clinicalImportance: 0.9, examRelevance: 0.8 } },
          { name: 'Topic Y', ratings: { difficulty: 0.7, clinicalImportance: 0.8, examRelevance: 0.7 } }
        ]
      }
    ];

    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: {
        'Favourite Subject': 4,
        'Neutral Subject': 4,
        'Least Favourite Subject': 4
      },
      passCoverage: 2,
      favouriteSubjects: ['Favourite Subject'],
      leastFavouriteSubjects: ['Least Favourite Subject'],
      k: 10
    };

    const sessions = buildSessionStream(config);
    
    // Count sessions per subject
    const sessionCounts = sessions.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favouriteCount = sessionCounts['Favourite Subject'] || 0;
    const neutralCount = sessionCounts['Neutral Subject'] || 0;
    const leastFavCount = sessionCounts['Least Favourite Subject'] || 0;

    // Verify frequency ratios according to prefMultiplier
    // Favourite should appear ≥1.4× more than neutral (1.5/1.0 = 1.5)
    expect(favouriteCount / neutralCount).toBeGreaterThanOrEqual(1.4);
    
    // Least favourite should appear ≤0.7× compared to neutral (0.6/1.0 = 0.6)
    expect(leastFavCount / neutralCount).toBeLessThanOrEqual(0.7);
  });

  it('should respect subject quotas', () => {
    const mockSubjectsData = [
      {
        name: 'Test Subject',
        topics: [
          { name: 'Topic 1', ratings: { difficulty: 0.8, clinicalImportance: 0.9, examRelevance: 0.8 } },
          { name: 'Topic 2', ratings: { difficulty: 0.7, clinicalImportance: 0.8, examRelevance: 0.7 } }
        ]
      }
    ];

    const config: SelectorConfig = {
      subjectsData: mockSubjectsData,
      baseBlockCounts: { 'Test Subject': 3 },
      passCoverage: 2,
      favouriteSubjects: [],
      k: 10
    };

    const sessions = buildSessionStream(config);
    
    // Calculate expected quota: baseBlocks × 5 × passCoverage = 3 × 5 × 2 = 30
    const expectedQuota = 3 * 5 * 2;
    
    const sessionCount = sessions.filter(s => s.subject === 'Test Subject').length;
    expect(sessionCount).toBe(expectedQuota);
  });
});