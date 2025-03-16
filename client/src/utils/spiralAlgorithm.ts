import { SubjectsData } from '../data/masterSubjects';
import { BASE_BLOCK_COUNTS, calculateBlocksForYear, HOURS_PER_BLOCK, BLOCKS_PER_WEEK } from '../data/studyBlockCounts';

interface SpiralConfig {
  weeklyStudyHours: number;
  yearGroup: number;
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

const DAILY_START_TIME = "09:00";
const TOPICS_PER_SESSION = 3;
const FAVORITE_SUBJECT_PRIORITY_BOOST = 1.5;

// Calculate base time needed for a topic based on its ratings
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
  const { weeklyStudyHours, yearGroup, favouriteSubjects, subjectsData, revisionCount = 0 } = config;
  const blocks: StudyBlock[] = [];

  // Start from today
  const startDate = new Date();
  let currentDate = new Date(startDate);

  // Calculate study blocks for each subject
  const subjectStudyBlocks = subjectsData.map(subject => {
    const baseBlocks = BASE_BLOCK_COUNTS[subject.name] || 10; // Default to 10 if not specified
    const adjustedBlocks = calculateBlocksForYear(baseBlocks, yearGroup);
    const isFavorite = favouriteSubjects.includes(subject.name);

    return {
      subject: subject.name,
      topics: subject.topics,
      totalBlocks: isFavorite ? Math.ceil(adjustedBlocks * FAVORITE_SUBJECT_PRIORITY_BOOST) : adjustedBlocks,
      isFavorite
    };
  });

  // Sort subjects (favorites first, then by block count)
  subjectStudyBlocks.sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return b.totalBlocks - a.totalBlocks;
  });

  // Process each subject sequentially
  subjectStudyBlocks.forEach(subjectData => {
    const blocksPerDay = Math.min(3, weeklyStudyHours / HOURS_PER_BLOCK);
    let remainingBlocks = subjectData.totalBlocks;

    while (remainingBlocks > 0) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const dailyBlocks = Math.min(blocksPerDay, remainingBlocks);

      for (let blockIndex = 0; blockIndex < dailyBlocks; blockIndex++) {
        const startTime = addHours(DAILY_START_TIME, blockIndex * HOURS_PER_BLOCK);
        const endTime = addHours(startTime, HOURS_PER_BLOCK);

        // Select topics for this block based on progress
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

        blocks.push({
          subject: subjectData.subject,
          topics: sessionTopics,
          hours: HOURS_PER_BLOCK,
          date: currentDate.toISOString().split('T')[0],
          startTime,
          endTime
        });
      }

      remainingBlocks -= dailyBlocks;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add a day break between subjects
    currentDate.setDate(currentDate.getDate() + 1);
  });

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