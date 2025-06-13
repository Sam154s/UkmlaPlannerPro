import { SubjectsData } from '../data/masterSubjects';
import { UserPerformance } from '../types/spiral';
import { LOW_PERFORMANCE_BOOST } from '../constants';

// Helper function to calculate topic importance score
export function calculateTopicImportance(topic: any): number {
  return (
    topic.ratings.difficulty +
    topic.ratings.clinicalImportance +
    topic.ratings.examRelevance
  ) / 3;
}

// Find related topics for connections with preference for same condition group
export function findRelatedTopics(
  currentSubject: string,
  currentTopic: string,
  subjectsData: SubjectsData,
  excludeTopics: string[] = []
): string[] {
  const relatedTopics: string[] = [];
  const sameGroupTopics: string[] = [];
  
  // Find the current subject and topic
  const currentSubjectData = subjectsData.find(s => s.name === currentSubject);
  const currentTopicData = currentSubjectData?.topics.find(t => t.name === currentTopic);

  if (!currentTopicData || !currentSubjectData) return relatedTopics;

  // Find which condition group(s) the current topic belongs to
  const topicGroups: string[] = [];
  currentSubjectData.conditionGroups.forEach(group => {
    if (group.conditions.includes(currentTopic)) {
      topicGroups.push(group.name);
    }
  });

  subjectsData.forEach(subject => {
    // First pass: look for topics in the same condition group
    if (topicGroups.length > 0 && subject.name === currentSubject) {
      subject.conditionGroups
        .filter(group => topicGroups.includes(group.name))
        .forEach(group => {
          group.conditions.forEach(topicName => {
            if (topicName !== currentTopic && 
                !excludeTopics.includes(`${subject.name}: ${topicName}`)) {
              const topicData = subject.topics.find(t => t.name === topicName);
              if (topicData) {
                sameGroupTopics.push(`${subject.name}: ${topicName}`);
              }
            }
          });
        });
    }
    
    // Second pass: look for topics with similar importance
    subject.topics.forEach(topic => {
      if (excludeTopics.includes(`${subject.name}: ${topic.name}`)) return;
      if (sameGroupTopics.includes(`${subject.name}: ${topic.name}`)) return;

      const importanceDiff = Math.abs(
        calculateTopicImportance(topic) - calculateTopicImportance(currentTopicData)
      );

      if (importanceDiff <= 2) {
        relatedTopics.push(`${subject.name}: ${topic.name}`);
      }
    });
  });

  // Prioritize topics from the same condition group
  const combinedTopics = [...sameGroupTopics, ...relatedTopics];
  return combinedTopics.slice(0, 2);
}

// Calculate performance multiplier based on user performance data
export function getPerformanceMultiplier(
  subjectName: string, 
  userPerformance?: UserPerformance
): number {
  if (!userPerformance?.subjects) {
    return 1;
  }
  
  const performance = userPerformance.subjects[subjectName];
  if (performance === undefined) {
    return 1;
  }
  
  // Lower performance (closer to 0) means more blocks needed
  return 1 + (LOW_PERFORMANCE_BOOST - 1) * (1 - performance);
}

interface SubjectWithPriority {
  subject: string;
  topics: any[];
  totalBlocks: number;
  isFavorite: boolean;
  performanceMultiplier: number;
}

// Get topics sorted by performance and condition groups
export function getTopicsByPerformance(
  subject: SubjectWithPriority, 
  userPerformance?: UserPerformance,
  subjectsData?: SubjectsData
): any[] {
  const topics = [...subject.topics];
  
  // First sort by performance if available
  if (userPerformance?.topics) {
    topics.sort((a, b) => {
      const topicKeyA = `${subject.subject}: ${a.name}`;
      const topicKeyB = `${subject.subject}: ${b.name}`;
      
      const perfA = userPerformance.topics?.[topicKeyA] ?? 0.5;
      const perfB = userPerformance.topics?.[topicKeyB] ?? 0.5;
      
      // Sort by performance (lower performance first)
      return perfA - perfB;
    });
  }
  
  return topics;
}