import { UserPerformance } from '../types/spiral';

export interface HourPlanConfig {
  subjectsData: any[];
  blocksTable: Record<string, number>;
  yearMultiplier: number;
  userPerformance?: UserPerformance;
}

export interface ConditionAllocation {
  subject: string;
  condition: string;
  minutes: number;
}

/**
 * Allocate minutes to conditions based on weighted importance and mastery levels.
 * 
 * Algorithm:
 * 1. Calculate total subject minutes: blocks × 150 × yearMultiplier
 * 2. Weight conditions: raw = 0.4·D + 0.3·C + 0.3·E
 * 3. Adjust for mastery: adj = raw × (1 + (1-mastery)/2)
 * 4. Allocate minutes proportionally: subjectMinutes × adj / Σadj
 */
export function buildHourPlan(config: HourPlanConfig): ConditionAllocation[] {
  const { subjectsData, blocksTable, yearMultiplier, userPerformance } = config;
  const plan: ConditionAllocation[] = [];

  subjectsData.forEach((subject: any) => {
    const baseBlocks = blocksTable[subject.name] || 4;
    const totalMinutes = baseBlocks * 150 * yearMultiplier;

    // Calculate condition weights
    const weights = subject.topics.map((topic: any) => {
      const difficulty = topic.ratings.difficulty;
      const clinical = topic.ratings.clinicalImportance;
      const exam = topic.ratings.examRelevance;
      
      const rawWeight = 0.4 * difficulty + 0.3 * clinical + 0.3 * exam;
      
      // Get mastery level (default 0.7 if no performance data)
      const topicKey = `${subject.name}:${topic.name}`;
      const mastery = userPerformance?.topics?.[topicKey] ?? 0.7;
      
      const adjustedWeight = rawWeight * (1 + (1 - mastery) / 2);
      
      return {
        name: topic.name,
        adjustedWeight
      };
    });

    // Calculate total adjusted weight for this subject
    const totalAdjustedWeight = weights.reduce((sum: number, weight: any) => sum + weight.adjustedWeight, 0);

    // Allocate minutes to each condition
    weights.forEach((weight: any) => {
      const minutes = Math.round(totalMinutes * weight.adjustedWeight / totalAdjustedWeight);
      
      if (minutes > 0) { // Only include conditions with allocated time
        plan.push({
          subject: subject.name,
          condition: weight.name,
          minutes
        });
      }
    });
  });

  return plan;
}