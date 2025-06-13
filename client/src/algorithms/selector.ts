import { PriorityQueue } from '@datastructures-js/priority-queue';
import { UserPerformance, SpiralConfig, ConditionPlan } from '../types/spiral';

export interface SessionStub {
  subject: string;
  topics: string[];
  minutes: number;
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
 * Hour-based generator that creates condition plans with time budgets.
 * 
 * Algorithm:
 * 1. Calculate subject hour budgets: blocks × 2.5 × yearMultiplier
 * 2. Weight conditions: raw = 0.4D + 0.3C + 0.3E, adj = raw × (1 + (1 - mastery)/2)
 * 3. Allocate hours: subjectHours × adj / Σadj
 * 4. Review injection based on session gaps, not time
 */
export function buildHourPlan(config: SpiralConfig): ConditionPlan[] {
  const { subjectsData, blocksTable, yearMultiplier, favouriteSubjects, userPerformance } = config;
  
  // 1. Calculate subject hour budgets
  const subjectHoursMap: Record<string, number> = {};
  for (const subject of subjectsData) {
    const baseBlocks = blocksTable[subject.name] || 5;
    subjectHoursMap[subject.name] = baseBlocks * 2.5 * yearMultiplier;
  }
  
  const conditionPlans: ConditionPlan[] = [];
  
  // 2. Process each subject
  for (const subject of subjectsData) {
    const subjectHours = subjectHoursMap[subject.name];
    if (subjectHours <= 0) continue;
    
    // Calculate condition weights
    const conditionWeights: { condition: string; rawWeight: number; adjustedWeight: number }[] = [];
    let totalAdjustedWeight = 0;
    
    for (const topic of subject.topics) {
      const difficulty = topic.ratings.difficulty;
      const clinical = topic.ratings.clinicalImportance;
      const exam = topic.ratings.examRelevance;
      
      const rawWeight = 0.4 * difficulty + 0.3 * clinical + 0.3 * exam;
      
      // Get mastery (default 0.7 if no performance data)
      const topicKey = `${subject.name}: ${topic.name}`;
      const mastery = userPerformance?.topics?.[topicKey] || 0.7;
      
      const adjustedWeight = rawWeight * (1 + (1 - mastery) / 2);
      
      conditionWeights.push({
        condition: topic.name,
        rawWeight,
        adjustedWeight
      });
      
      totalAdjustedWeight += adjustedWeight;
    }
    
    // 3. Allocate hours to conditions
    for (const weightData of conditionWeights) {
      const conditionHours = (subjectHours * weightData.adjustedWeight) / totalAdjustedWeight;
      const conditionMinutes = Math.round(conditionHours * 60);
      
      if (conditionMinutes >= 30) { // Minimum 30 minutes
        conditionPlans.push({
          subject: subject.name,
          condition: weightData.condition,
          minutes: conditionMinutes,
          adjustedWeight: weightData.adjustedWeight,
          isReview: false
        });
      }
    }
  }
  
  return conditionPlans;
}

/**
 * Legacy session-based generator for backward compatibility
 */
export function buildSessionStream(config: SelectorConfig): SessionStub[] {
  const { subjectsData, baseBlockCounts, passCoverage, favouriteSubjects, userPerformance, k } = config;
  
  const sessions: SessionStub[] = [];
  const subjectSessionCounts: { [key: string]: number } = {};
  const reviewHeap = new PriorityQueue<ReviewCandidate>((a, b) => b.reviewWeight - a.reviewWeight);
  const topicGaps: { [key: string]: number } = {}; // "subject:topic" -> gap since last study
  
  // Initialize session counts from subjectsData order
  for (const s of subjectsData) {
    subjectSessionCounts[s.name] = 0;
  }

  // Process each subject in order
  for (const subject of subjectsData) {
    const maxSessionsForSubject = (baseBlockCounts[subject.name] || 5) * passCoverage;
    if (subjectSessionCounts[subject.name] >= maxSessionsForSubject) continue;
    
    // Get and sort topics by composite score
    const topics = subject.topics
      .map((topic: any) => ({
        ...topic,
        compositeScore: 0.4 * topic.ratings.difficulty + 
                       0.3 * topic.ratings.clinicalImportance + 
                       0.3 * topic.ratings.examRelevance
      }))
      .sort((a: any, b: any) => b.compositeScore - a.compositeScore);

    // Emit sessions for this subject, checking for review interjection
    for (const topic of topics) {
      // Check if we should inject a review
      if (sessions.length > 0 && sessions.length % k === 0 && reviewHeap.size() > 0) {
        const candidate = reviewHeap.dequeue();
        if (candidate && 
            subjectSessionCounts[candidate.subject] < (baseBlockCounts[candidate.subject] || 5) * passCoverage) {
          
          subjectSessionCounts[candidate.subject] += 1;
          
          const reviewSession: SessionStub = {
            subject: candidate.subject,
            topics: [candidate.topic],
            minutes: 120, // Default 2 hours for review
            isReview: true
          };
          
          sessions.push(reviewSession);
          subjectSessionCounts[candidate.subject] += 1;
        }
      }
      
      // Check quota before adding main session
      if (subjectSessionCounts[subject.name] >= maxSessionsForSubject) break;
      
      const session: SessionStub = {
        subject: subject.name,
        topics: [topic.name],
        minutes: 120, // Default 2 hours
        isReview: false
      };

      sessions.push(session);
      subjectSessionCounts[subject.name] += 1;
      
      // Add to review heap for future review
      const topicKey = `${subject.name}:${topic.name}`;
      topicGaps[topicKey] = 0; // Reset gap
      
      // Calculate review weight
      const rawScore = userPerformance?.topics?.[`${subject.name}: ${topic.name}`] || 0.7;
      const difficultyFactor = Math.min(2, Math.max(0.5, 1 + (1 - rawScore)));
      const prefMultiplier = favouriteSubjects.includes(subject.name) ? 1.5 : 1.0;
      
      reviewHeap.enqueue({
        subject: subject.name,
        topic: topic.name,
        gap: 1, // Will be updated later
        difficultyFactor,
        prefMultiplier,
        reviewWeight: (1 / 1) * difficultyFactor * prefMultiplier
      });
    }
  }
  
  return sessions;
}

function getSubjectTopicCount(subjectsData: any[], subjectName: string): number {
  const subject = subjectsData.find(s => s.name === subjectName);
  return subject ? subject.topics.length : 0;
}