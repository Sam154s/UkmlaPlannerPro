import { SubjectsData } from '../data/masterSubjects';
import { BASE_BLOCK_COUNTS, calculateBlocksForYear, HOURS_PER_BLOCK } from '../data/studyBlockCounts';

interface SpiralConfig {
  weeklyStudyHours: number;
  yearGroup: number;
  daysPerWeek: number;
  favouriteSubjects: string[];
  subjectsData: SubjectsData;
  userPerformance?: UserPerformance;
  passCoverage?: number; // Number of times each subject should be covered
  revisionCount?: number;
}

// Represents user performance data for subjects and topics
export interface UserPerformance {
  subjects?: { [subjectName: string]: number }; // 0-1 value where 0 is struggling, 1 is mastery
  topics?: { [subjectAndTopic: string]: number }; // Format: "SubjectName: TopicName" => 0-1 score
}

interface StudyBlock {
  subject: string;
  topics: {
    name: string;
    type: 'main' | 'connection';
    connectionTopics?: string[];
  }[];
  hours: number;
  date: string;
  startTime: string;
  endTime: string;
  passNumber?: number; // Tracking which pass this block belongs to
}

interface SubjectWithPriority {
  subject: string;
  topics: any[];
  totalBlocks: number;
  isFavorite: boolean;
  performanceMultiplier: number;
}

const DAILY_START_TIME = "07:00";
const TOPICS_PER_SESSION = 3;
const FAVORITE_SUBJECT_PRIORITY_BOOST = 1.5;
const LOW_PERFORMANCE_BOOST = 1.3; // Boost for subjects/topics user is struggling with
const DEFAULT_PASS_COVERAGE = 3; // Default number of passes through all subjects

// Helper function to calculate topic importance score
function calculateTopicImportance(topic: any): number {
  return (
    topic.ratings.difficulty +
    topic.ratings.clinicalImportance +
    topic.ratings.examRelevance
  ) / 3;
}

// Find related topics for connections based on importance similarity
function findRelatedTopics(
  currentSubject: string,
  currentTopic: string,
  subjectsData: SubjectsData,
  excludeTopics: string[] = []
): string[] {
  const relatedTopics: string[] = [];
  const currentTopicData = subjectsData
    .find(s => s.name === currentSubject)
    ?.topics.find(t => t.name === currentTopic);

  if (!currentTopicData) return relatedTopics;

  subjectsData.forEach(subject => {
    subject.topics.forEach(topic => {
      if (excludeTopics.includes(`${subject.name}: ${topic.name}`)) return;

      const importanceDiff = Math.abs(
        calculateTopicImportance(topic) - calculateTopicImportance(currentTopicData)
      );

      if (importanceDiff <= 2) {
        relatedTopics.push(`${subject.name}: ${topic.name}`);
      }
    });
  });

  return relatedTopics.slice(0, 2);
}

// Calculate performance multiplier based on user performance data
function getPerformanceMultiplier(
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

// Get topics sorted by performance (struggling topics first)
function getTopicsByPerformance(
  subject: SubjectWithPriority, 
  userPerformance?: UserPerformance
): any[] {
  const topics = [...subject.topics];
  
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

// Main function to generate spiral timetable
export function generateSpiralTimetable(config: SpiralConfig): StudyBlock[] {
  const { 
    weeklyStudyHours, 
    yearGroup, 
    daysPerWeek, 
    favouriteSubjects, 
    subjectsData,
    userPerformance,
    passCoverage = DEFAULT_PASS_COVERAGE,
    revisionCount = 0 
  } = config;
  
  const blocks: StudyBlock[] = [];

  // Start from today
  const startDate = new Date();
  let currentDate = new Date(startDate);

  // Calculate blocks per week based on weekly hours
  const hoursPerDay = weeklyStudyHours / daysPerWeek;

  // Get available weekdays based on daysPerWeek
  const availableDays = Array.from({ length: 7 }, (_, i) => i + 1) // 1 = Monday, 7 = Sunday
    .slice(0, daysPerWeek);

  // Calculate and sort subjects by priority with performance adjustment
  const subjectPriorities: SubjectWithPriority[] = subjectsData.map(subject => {
    const baseBlocks = BASE_BLOCK_COUNTS[subject.name] || 10;
    const adjustedBlocks = calculateBlocksForYear(baseBlocks, yearGroup);
    const isFavorite = favouriteSubjects.includes(subject.name);
    const performanceMultiplier = getPerformanceMultiplier(subject.name, userPerformance);

    // Apply favorite boost and performance multiplier
    const totalBoost = isFavorite ? FAVORITE_SUBJECT_PRIORITY_BOOST : 1;
    
    return {
      subject: subject.name,
      topics: subject.topics,
      totalBlocks: Math.ceil(adjustedBlocks * totalBoost * performanceMultiplier),
      isFavorite,
      performanceMultiplier
    };
  }).sort((a, b) => {
    // Sort by performance issues first, then favorites, then block count
    if (a.performanceMultiplier !== b.performanceMultiplier) {
      return b.performanceMultiplier - a.performanceMultiplier;
    }
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return b.totalBlocks - a.totalBlocks;
  });

  // Multiple passes through all subjects
  for (let pass = 1; pass <= passCoverage; pass++) {
    for (const subjectData of subjectPriorities) {
      // For each pass, allocate a percentage of the total blocks
      const blocksForThisPass = Math.ceil(subjectData.totalBlocks / passCoverage);
      let remainingBlocks = blocksForThisPass;
      let dailyHoursUsed = 0;
      let currentDayIndex = 0;
      
      // Sort topics by performance for this subject - struggling topics first
      const sortedTopics = getTopicsByPerformance(subjectData, userPerformance);

      // Process blocks for this subject in this pass
      while (remainingBlocks > 0) {
        // Check if we need to move to the next available day
        if (dailyHoursUsed >= hoursPerDay || currentDayIndex >= daysPerWeek) {
          currentDate.setDate(currentDate.getDate() + 1);
          dailyHoursUsed = 0;
          currentDayIndex = (currentDayIndex + 1) % daysPerWeek;
          continue;
        }

        // Skip days not in availableDays
        while (!availableDays.includes(currentDate.getDay() || 7)) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate remaining hours for the day
        const remainingHoursToday = hoursPerDay - dailyHoursUsed;

        // Determine block duration (prefer 2 hours, but allow 1 hour if needed)
        const blockHours = Math.min(
          remainingHoursToday >= 2 ? 2 : 1,
          remainingBlocks * HOURS_PER_BLOCK
        );

        // Calculate topics for this block based on the progress through this pass
        const passProgress = (blocksForThisPass - remainingBlocks) / blocksForThisPass;
        const topicStartIndex = Math.floor(passProgress * sortedTopics.length);
        const sessionTopics = [];

        // Add main topics
        for (let i = 0; i < TOPICS_PER_SESSION; i++) {
          const topicIndex = (topicStartIndex + i) % sortedTopics.length;
          const topic = sortedTopics[topicIndex];
          sessionTopics.push({
            name: topic.name,
            type: 'main' as const
          });
        }

        // Add connection topics
        const mainTopic = sortedTopics[topicStartIndex];
        const excludeTopics = sessionTopics.map(t => `${subjectData.subject}: ${t.name}`);
        const connections = findRelatedTopics(
          subjectData.subject,
          mainTopic.name,
          subjectsData,
          excludeTopics
        );

        sessionTopics.push({
          name: mainTopic.name,
          type: 'connection' as const,
          connectionTopics: connections
        });

        // Add block to schedule
        blocks.push({
          subject: subjectData.subject,
          topics: sessionTopics,
          hours: blockHours,
          date: currentDate.toISOString().split('T')[0],
          startTime: addHours(DAILY_START_TIME, dailyHoursUsed),
          endTime: addHours(DAILY_START_TIME, dailyHoursUsed + blockHours),
          passNumber: pass
        });

        remainingBlocks--;
        dailyHoursUsed += blockHours;
      }
    }

    // Add a brief break between passes if we're not on the last pass
    if (pass < passCoverage) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Sort the blocks by date and time to ensure chronological order
  return blocks.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) return dateComparison;
    return a.startTime.localeCompare(b.startTime);
  });
}

// Helper to add hours to a time string
function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const newHours = h + Math.floor(hours);
  const newMinutes = m + ((hours % 1) * 60);
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}