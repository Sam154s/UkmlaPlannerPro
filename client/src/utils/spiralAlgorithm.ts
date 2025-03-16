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

  // Calculate available blocks per week based on weekly hours
  const availableBlocksPerWeek = weeklyStudyHours / HOURS_PER_BLOCK;

  // Calculate study blocks for each subject
  let subjectStudyBlocks = subjectsData.map(subject => {
    const baseBlocks = BASE_BLOCK_COUNTS[subject.name] || 10;
    const adjustedBlocks = calculateBlocksForYear(baseBlocks, yearGroup);
    const isFavorite = favouriteSubjects.includes(subject.name);

    return {
      subject: subject.name,
      topics: subject.topics,
      totalBlocks: isFavorite ? Math.ceil(adjustedBlocks * FAVORITE_SUBJECT_PRIORITY_BOOST) : adjustedBlocks,
      isFavorite
    };
  });

  // Calculate total blocks and scaling factor
  const totalBlocks = subjectStudyBlocks.reduce((acc, subject) => acc + subject.totalBlocks, 0);
  const scalingFactor = availableBlocksPerWeek / totalBlocks;

  // Scale blocks to match weekly hours
  subjectStudyBlocks = subjectStudyBlocks.map(subject => ({
    ...subject,
    totalBlocks: Math.max(1, Math.round(subject.totalBlocks * scalingFactor))
  }));

  // Sort subjects (favorites first, then by block count)
  subjectStudyBlocks.sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return b.totalBlocks - a.totalBlocks;
  });

  // Process each subject sequentially
  subjectStudyBlocks.forEach(subjectData => {
    let remainingBlocks = subjectData.totalBlocks;

    while (remainingBlocks > 0) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

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
        hours: HOURS_PER_BLOCK,
        date: currentDate.toISOString().split('T')[0],
        startTime: addHours(DAILY_START_TIME, blocks.length % 3 * HOURS_PER_BLOCK),
        endTime: addHours(DAILY_START_TIME, (blocks.length % 3 + 1) * HOURS_PER_BLOCK)
      });

      remainingBlocks--;

      // Move to next day if we've completed 3 blocks
      if (blocks.length % 3 === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Add a day break between subjects
    if (blocks.length % 3 !== 0) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
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