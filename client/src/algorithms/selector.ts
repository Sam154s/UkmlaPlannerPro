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

interface ReviewCandidate {
  subject: string;
  topic: string;
  gap: number;
  difficultyFactor: number;
  prefMultiplier: number;
  reviewWeight: number;
}

/**
 * Pure generator that creates an ordered session stream following the spiral algorithm.
 * 
 * Algorithm:
 * 1. Level-0 coverage: For each subject in subjectsData order, emit sessions sorted by composite score
 * 2. Review injection: Every k sessions, insert highest-priority review session 
 * 3. Respect quotas: Never exceed totalSessions = baseBlocks × 5 × passCoverage per subject
 * 4. Review weight = (1 / gap) × difficultyFactor × prefMultiplier
 */
export function buildSessionStream(config: SelectorConfig): SessionStub[] {
  const { subjectsData, baseBlockCounts, passCoverage, favouriteSubjects, leastFavouriteSubjects = [], userPerformance, k } = config;
  
  const sessions: SessionStub[] = [];
  const subjectSessionCounts: { [key: string]: number } = {};
  const reviewHeap = new PriorityQueue<ReviewCandidate>((a, b) => b.reviewWeight - a.reviewWeight);
  const topicGaps: { [key: string]: number } = {}; // "subject:topic" -> gap since last study
  
  // Initialize session counts from subjectsData order
  const subjectOrder = subjectsData.map(s => s.name);
  for (const subject of subjectOrder) {
    subjectSessionCounts[subject] = 0;
  }
  
  let currentSubjectIndex = 0;
  let sessionsEmitted = 0;
  
  while (true) {
    // Check if all subjects have reached their quotas
    const allQuotasReached = subjectOrder.every(subject => {
      const quota = (baseBlockCounts[subject] || 5) * 5 * passCoverage;
      return subjectSessionCounts[subject] >= quota;
    });
    
    if (allQuotasReached) {
      break;
    }
    
    // Update gaps for all topics
    for (const key in topicGaps) {
      topicGaps[key]++;
    }
    
    // Check if we should inject a review session
    if (sessionsEmitted > 0 && sessionsEmitted % k === 0) {
      if (!reviewHeap.isEmpty()) {
        const candidate = reviewHeap.dequeue();
        if (candidate) {
          const subjectQuota = (baseBlockCounts[candidate.subject] || 5) * 5 * passCoverage;
          
          if (subjectSessionCounts[candidate.subject] < subjectQuota) {
            const reviewSession: SessionStub = {
              subject: candidate.subject,
              topic: candidate.topic,
              pass: Math.floor(subjectSessionCounts[candidate.subject] / getSubjectTopicCount(subjectsData, candidate.subject)) + 1,
              isReview: true
            };
            
            sessions.push(reviewSession);
            subjectSessionCounts[candidate.subject]++;
            sessionsEmitted++;
            
            // Reset gap for this topic
            topicGaps[`${candidate.subject}:${candidate.topic}`] = 0;
            continue;
          }
        }
      }
    }
    
    // Get current subject from subjectsData order
    let attempts = 0;
    while (attempts < subjectOrder.length) {
      const currentSubject = subjectOrder[currentSubjectIndex];
      const subjectQuota = (baseBlockCounts[currentSubject] || 5) * 5 * passCoverage;
      
      // Check if current subject has reached its quota
      if (subjectSessionCounts[currentSubject] < subjectQuota) {
        // Find subject data
        const subjectData = subjectsData.find(s => s.name === currentSubject);
        if (subjectData) {
          // Get next topic for this subject, sorted by composite score
          const topics = subjectData.topics.slice().sort((a: any, b: any) => {
            const scoreA = 0.4 * a.ratings.difficulty + 0.3 * a.ratings.clinicalImportance + 0.3 * a.ratings.examRelevance;
            const scoreB = 0.4 * b.ratings.difficulty + 0.3 * b.ratings.clinicalImportance + 0.3 * b.ratings.examRelevance;
            return scoreB - scoreA;
          });
          
          const topicIndex = subjectSessionCounts[currentSubject] % topics.length;
          const topic = topics[topicIndex];
          
          if (topic) {
            // Calculate difficulty factor based on user performance
            const perfKey = `${currentSubject}:${topic.name}`;
            const rawScore = userPerformance?.topics?.[perfKey] ?? 0.7; // default 0.7
            const difficultyFactor = Math.min(2, Math.max(0.5, 1 + (1 - rawScore)));
            
            const session: SessionStub = {
              subject: currentSubject,
              topic: topic.name,
              pass: Math.floor(subjectSessionCounts[currentSubject] / topics.length) + 1,
              isReview: false
            };
            
            sessions.push(session);
            subjectSessionCounts[currentSubject]++;
            sessionsEmitted++;
            
            // Initialize or reset gap for this topic
            const topicKey = `${currentSubject}:${topic.name}`;
            topicGaps[topicKey] = 0;
            
            // Add to review heap if this is a repeat topic
            if (session.pass > 1) {
              const gap = topicGaps[topicKey] || 1;
              
              let prefMultiplier = 1.0;
              if (favouriteSubjects.includes(currentSubject)) {
                prefMultiplier = 1.5;
              } else if (leastFavouriteSubjects.includes(currentSubject)) {
                prefMultiplier = 0.6;
              }
              
              const reviewWeight = (1 / Math.max(gap, 1)) * difficultyFactor * prefMultiplier;
              
              reviewHeap.enqueue({
                subject: currentSubject,
                topic: topic.name,
                gap,
                difficultyFactor,
                prefMultiplier,
                reviewWeight
              });
            }
            
            break;
          }
        }
      }
      
      currentSubjectIndex = (currentSubjectIndex + 1) % subjectOrder.length;
      attempts++;
    }
    
    // If all subjects are exhausted, break
    if (attempts >= subjectOrder.length) {
      break;
    }
  }
  
  return sessions;
}

function getSubjectTopicCount(subjectsData: any[], subjectName: string): number {
  const subject = subjectsData.find(s => s.name === subjectName);
  return subject ? subject.topics.length : 1;
}