import { describe, it, expect } from 'vitest';
import { buildSessionStream } from '../algorithms/selector';

describe('Preference Ratio Tests', () => {
  it('favourite ≥1.4× neutral, least ≤0.7×', () => {
    const subjectsData = [
      {
        name: 'Favourite Subject',
        topics: [
          { name: 'Topic 1', ratings: { difficulty: 0.5, clinicalImportance: 0.5, examRelevance: 0.5 } },
          { name: 'Topic 2', ratings: { difficulty: 0.5, clinicalImportance: 0.5, examRelevance: 0.5 } }
        ]
      },
      {
        name: 'Neutral Subject',
        topics: [
          { name: 'Topic A', ratings: { difficulty: 0.5, clinicalImportance: 0.5, examRelevance: 0.5 } },
          { name: 'Topic B', ratings: { difficulty: 0.5, clinicalImportance: 0.5, examRelevance: 0.5 } }
        ]
      },
      {
        name: 'Least Favourite Subject',
        topics: [
          { name: 'Topic X', ratings: { difficulty: 0.5, clinicalImportance: 0.5, examRelevance: 0.5 } },
          { name: 'Topic Y', ratings: { difficulty: 0.5, clinicalImportance: 0.5, examRelevance: 0.5 } }
        ]
      }
    ];

    const stream = buildSessionStream({
      subjectsData,
      baseBlockCounts: {
        'Favourite Subject': 2,
        'Neutral Subject': 2,
        'Least Favourite Subject': 2
      },
      passCoverage: 1,
      favouriteSubjects: ['Favourite Subject'],
      leastFavouriteSubjects: ['Least Favourite Subject'],
      k: 10,
    });

    const counts = stream.reduce((m, s) => {
      m[s.subject] = (m[s.subject] || 0) + 1;
      return m;
    }, {} as Record<string, number>);

    const favouriteCount = counts['Favourite Subject'] || 0;
    const neutralCount = counts['Neutral Subject'] || 0;
    const leastCount = counts['Least Favourite Subject'] || 0;

    // Favourite should appear ≥1.4× more than neutral
    expect(favouriteCount / neutralCount).toBeGreaterThanOrEqual(1.4);
    
    // Least favourite should appear ≤0.7× compared to neutral
    expect(leastCount / neutralCount).toBeLessThanOrEqual(0.7);
  });
});