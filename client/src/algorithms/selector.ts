import { PriorityQueue } from '@datastructures-js/priority-queue';
import { UserPerformance } from '../types/spiral';

export interface SessionStub {
  subject: string;
  topic: string;
  pass: number;
  isReview: boolean;
}

export interface SelectorConfig {
  subjectsData: any[];
  baseBlockCounts: { [key: string]: number };
  passCoverage: number;
  favouriteSubjects: string[];
  leastFavouriteSubjects?: string[];
  userPerformance?: UserPerformance;
  k: number; // Review injection interval
}

/**
 * Pure generator that creates an ordered session stream following the spiral algorithm.
 * 
 * Algorithm:
 * 1. Level-0 coverage: For each subject in fixed order, emit sessions sorted by composite score
 * 2. Review injection: Every k sessions, insert a review session from highest-performing topics
 * 3. Respect quotas: Never exceed totalSessions per subject
 */
export function buildSessionStream(config: SelectorConfig): SessionStub[] {
  const {
    subjectsData,
    baseBlockCounts,
    passCoverage,
    favouriteSubjects,
    userPerformance = {},
    k = 10
  } = config;

  const sessions: SessionStub[] = [];
  const subjectQuotas = new Map<string, number>();
  const subjectSessionCounts = new Map<string, number>();
  const topicHistory = new Map<string, number>(); // Track how many times each topic was covered

  // Calculate total sessions per subject
  subjectsData.forEach(subject => {
    const baseBlocks = baseBlockCounts[subject.name] || 10;
    const totalSessions = baseBlocks * 5 * passCoverage;
    subjectQuotas.set(subject.name, totalSessions);
    subjectSessionCounts.set(subject.name, 0);
  });

  // Fixed order list for level-0 coverage
  const subjectOrder = [
    'Acute and emergency',
    'Cardiovascular',
    'Cancer',
    'Dermatology',
    'Endocrine',
    'Gastrointestinal',
    'Genitourinary',
    'Haematology',
    'Immunology',
    'Infectious diseases',
    'Musculoskeletal',
    'Neurological',
    'Obstetrics and gynaecology',
    'Ophthalmology',
    'Otolaryngology',
    'Paediatrics',
    'Psychiatry',
    'Renal',
    'Respiratory',
    'Sexual health'
  ];

  // Create ordered subject list with data
  const orderedSubjects = subjectOrder
    .map(name => subjectsData.find(s => s.name === name))
    .filter(Boolean);

  let sessionCount = 0;
  let currentPass = 1;

  // Main spiral generation loop
  while (true) {
    let addedSessionThisPass = false;

    // Level-0 coverage for each subject in order
    for (const subject of orderedSubjects) {
      const currentCount = subjectSessionCounts.get(subject.name) || 0;
      const quota = subjectQuotas.get(subject.name) || 0;

      if (currentCount >= quota) continue;

      // Calculate composite scores and sort topics
      const topicsWithScores = subject.topics.map((topic: any) => {
        const compositeScore = 
          0.4 * topic.ratings.difficulty +
          0.3 * topic.ratings.clinicalImportance +
          0.3 * topic.ratings.examRelevance;
        
        return { topic, compositeScore };
      });

      // Sort by composite score (descending)
      topicsWithScores.sort((a: any, b: any) => b.compositeScore - a.compositeScore);

      // Find next topic to cover in this pass
      const topicIndex = currentCount % topicsWithScores.length;
      const selectedTopic = topicsWithScores[topicIndex].topic;

      // Check if we need to inject a review session
      if (sessionCount > 0 && sessionCount % k === 0) {
        const reviewSession = generateReviewSession(topicHistory, subjectsData, subjectQuotas, subjectSessionCounts);
        if (reviewSession) {
          sessions.push(reviewSession);
          sessionCount++;
        }
      }

      // Add main session
      sessions.push({
        subject: subject.name,
        topic: selectedTopic.name,
        pass: currentPass,
        isReview: false
      });

      // Update counters
      subjectSessionCounts.set(subject.name, currentCount + 1);
      topicHistory.set(`${subject.name}:${selectedTopic.name}`, 
        (topicHistory.get(`${subject.name}:${selectedTopic.name}`) || 0) + 1);
      sessionCount++;
      addedSessionThisPass = true;
    }

    // If no sessions were added this pass, we're done
    if (!addedSessionThisPass) break;
    currentPass++;
  }

  return sessions;
}

/**
 * Generate a review session from topics that have been covered multiple times
 */
function generateReviewSession(
  topicHistory: Map<string, number>,
  subjectsData: any[],
  subjectQuotas: Map<string, number>,
  subjectSessionCounts: Map<string, number>
): SessionStub | null {
  
  // Create priority queue of topics by coverage frequency (max heap)
  const reviewCandidates = new PriorityQueue<{topic: string, subject: string, frequency: number}>(
    (a, b) => b.frequency - a.frequency
  );

  // Find topics that have been covered multiple times
  for (const topicEntry of Array.from(topicHistory.entries())) {
    const [topicKey, frequency] = topicEntry;
    if (frequency > 1) {
      const [subject, topic] = topicKey.split(':');
      const currentCount = subjectSessionCounts.get(subject) || 0;
      const quota = subjectQuotas.get(subject) || 0;
      
      // Only add if subject hasn't exceeded quota
      if (currentCount < quota) {
        reviewCandidates.enqueue({ topic, subject, frequency });
      }
    }
  }

  if (reviewCandidates.isEmpty()) return null;

  const selected = reviewCandidates.dequeue();
  
  if (!selected) return null;
  
  // Update counters for review session
  const currentCount = subjectSessionCounts.get(selected.subject) || 0;
  subjectSessionCounts.set(selected.subject, currentCount + 1);

  return {
    subject: selected.subject,
    topic: selected.topic,
    pass: Math.floor(selected.frequency),
    isReview: true
  };
}