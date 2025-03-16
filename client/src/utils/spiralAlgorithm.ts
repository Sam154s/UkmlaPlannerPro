import { SubjectsData } from '../data/masterSubjects';
import { BASE_BLOCK_COUNTS, calculateBlocksForYear, HOURS_PER_BLOCK } from '../data/studyBlockCounts';

interface SpiralConfig {
  weeklyStudyHours: number;
  yearGroup: number;
  daysPerWeek: number;
  favouriteSubjects: string[];
  subjectsData: SubjectsData;
  revisionCount?: number;
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
}

const DAILY_START_TIME = "07:00";
const TOPICS_PER_SESSION = 3;
const FAVORITE_SUBJECT_PRIORITY_BOOST = 1.5;

// Helper function to calculate topic importance score
function calculateTopicImportance(topic: any): number {
  return (
    topic.ratings.difficulty +
    topic.ratings.clinicalImportance +
    topic.ratings.examRelevance
  ) / 3;
}

// Find related topics for connections
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

export function generateSpiralTimetable(config: SpiralConfig): StudyBlock[] {
  const { weeklyStudyHours, yearGroup, daysPerWeek, favouriteSubjects, subjectsData, revisionCount = 0 } = config;
  const blocks: StudyBlock[] = [];

  // Start from today
  const startDate = new Date();
  let currentDate = new Date(startDate);

  // Calculate blocks per week based on weekly hours
  const hoursPerDay = weeklyStudyHours / daysPerWeek;

  // Get available weekdays based on daysPerWeek
  const availableDays = Array.from({ length: 7 }, (_, i) => i + 1) // 1 = Monday, 7 = Sunday
    .slice(0, daysPerWeek);

  // Calculate and sort subjects by priority
  const subjectPriorities = subjectsData.map(subject => {
    const baseBlocks = BASE_BLOCK_COUNTS[subject.name] || 10;
    const adjustedBlocks = calculateBlocksForYear(baseBlocks, yearGroup);
    const isFavorite = favouriteSubjects.includes(subject.name);

    return {
      subject: subject.name,
      topics: subject.topics,
      totalBlocks: isFavorite ? Math.ceil(adjustedBlocks * FAVORITE_SUBJECT_PRIORITY_BOOST) : adjustedBlocks,
      isFavorite
    };
  }).sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return b.totalBlocks - a.totalBlocks;
  });

  // Process each subject sequentially
  for (const subjectData of subjectPriorities) {
    let remainingBlocks = subjectData.totalBlocks;
    let dailyHoursUsed = 0;
    let currentDayIndex = 0;

    // Complete this subject before moving to the next
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

      // Calculate topics for this block
      const progress = (subjectData.totalBlocks - remainingBlocks) / subjectData.totalBlocks;
      const topicStartIndex = Math.floor(progress * subjectData.topics.length);
      const sessionTopics = [];

      // Add main topics
      for (let i = 0; i < TOPICS_PER_SESSION; i++) {
        const topicIndex = (topicStartIndex + i) % subjectData.topics.length;
        const topic = subjectData.topics[topicIndex];
        sessionTopics.push({
          name: topic.name,
          type: 'main' as const
        });
      }

      // Add connection topics
      const lastTopic = subjectData.topics[topicStartIndex];
      const excludeTopics = sessionTopics.map(t => `${subjectData.subject}: ${t.name}`);
      const connections = findRelatedTopics(
        subjectData.subject,
        lastTopic.name,
        subjectsData,
        excludeTopics
      );

      sessionTopics.push({
        name: lastTopic.name,
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
        endTime: addHours(DAILY_START_TIME, dailyHoursUsed + blockHours)
      });

      remainingBlocks--;
      dailyHoursUsed += blockHours;
    }

    // Add a day break between subjects if needed
    if (dailyHoursUsed > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      dailyHoursUsed = 0;
    }
  }

  return blocks.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) return dateComparison;
    return a.startTime.localeCompare(b.startTime);
  });
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const newHours = h + Math.floor(hours);
  const newMinutes = m + ((hours % 1) * 60);
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}