import { SubjectsData } from '../data/masterSubjects';

interface SpiralConfig {
  weeklyStudyHours: number;
  yearMultiplier: number;
  favouriteSubjects: string[];
  subjectsData: SubjectsData;
  revisionCount?: number;
}

interface StudyBlock {
  subject: string;
  topic: string;
  type: 'main' | 'connection';
  hours: number;
  date: string;
  startTime: string;
  endTime: string;
  connectionTopics?: string[];
}

const HOURS_PER_SESSION = 2;
const DAILY_START_TIME = "09:00";
const CONNECTION_SESSION_RATIO = 0.2;
const BASE_TIME_PER_TOPIC = 1;
const TIME_REDUCTION_PER_REVISION = 0.2;
const FAVORITE_SUBJECT_PRIORITY_BOOST = 2;

// Helper function to calculate topic base time
function calculateTopicBaseTime(topic: any): number {
  const complexityScore = (
    topic.ratings.difficulty +
    topic.ratings.clinicalImportance +
    topic.ratings.examRelevance
  ) / 3;
  return BASE_TIME_PER_TOPIC * (complexityScore / 5);
}

// Helper function to calculate subject total time
function calculateSubjectTime(
  subject: any, 
  yearGroup: number, 
  revisionCount: number = 0,
  isFavorite: boolean = false
): number {
  let totalTime = subject.topics.reduce((acc: number, topic: any) => {
    return acc + calculateTopicBaseTime(topic);
  }, 0);

  const yearMultiplier = Math.max(0.4, 1 - ((yearGroup - 1) * 0.15));
  const revisionMultiplier = Math.max(0.3, 1 - (revisionCount * TIME_REDUCTION_PER_REVISION));
  const favoriteMultiplier = isFavorite ? FAVORITE_SUBJECT_PRIORITY_BOOST : 1;

  return totalTime * yearMultiplier * revisionMultiplier * favoriteMultiplier;
}

function findRelatedTopics(
  currentSubject: string,
  currentTopic: string,
  subjectsData: SubjectsData
): string[] {
  const relatedTopics: string[] = [];
  const currentTopicData = subjectsData
    .find(s => s.name === currentSubject)
    ?.topics.find(t => t.name === currentTopic);

  if (!currentTopicData) return relatedTopics;

  subjectsData.forEach(subject => {
    subject.topics.forEach(topic => {
      if (subject.name === currentSubject && topic.name === currentTopic) return;

      const difficultyDiff = Math.abs(topic.ratings.difficulty - currentTopicData.ratings.difficulty);
      const importanceDiff = Math.abs(topic.ratings.clinicalImportance - currentTopicData.ratings.clinicalImportance);

      if (difficultyDiff <= 2 && importanceDiff <= 2) {
        relatedTopics.push(`${subject.name}: ${topic.name}`);
      }
    });
  });

  return relatedTopics.slice(0, 3);
}

export function generateSpiralTimetable(config: SpiralConfig): StudyBlock[] {
  const { weeklyStudyHours, yearMultiplier, favouriteSubjects, subjectsData, revisionCount = 0 } = config;
  const blocks: StudyBlock[] = [];

  // Start from today
  const startDate = new Date();
  let currentDate = new Date(startDate);

  // Calculate and sort subjects by priority
  const subjectPriorities = subjectsData.map(subject => {
    const isFavorite = favouriteSubjects.includes(subject.name);
    return {
      subject: subject.name,
      topics: subject.topics,
      totalTime: calculateSubjectTime(subject, yearMultiplier, revisionCount, isFavorite),
      isFavorite
    };
  });

  // Sort by favorite status first, then by total time
  subjectPriorities.sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return b.totalTime - a.totalTime;
  });

  // Process each subject sequentially
  subjectPriorities.forEach(subjectData => {
    const sessionsNeeded = Math.ceil(subjectData.totalTime / HOURS_PER_SESSION);
    const mainSessions = Math.floor(sessionsNeeded * (1 - CONNECTION_SESSION_RATIO));
    const connectionSessions = Math.floor(sessionsNeeded * CONNECTION_SESSION_RATIO);

    // Add main sessions
    for (let i = 0; i < mainSessions; i++) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const dailySessionIndex = Math.min(2, Math.floor(i % 3));
      const startTime = addHours(DAILY_START_TIME, dailySessionIndex * HOURS_PER_SESSION);
      const endTime = addHours(startTime, HOURS_PER_SESSION);

      // Select topic based on progress through the subject
      const topicIndex = Math.floor((i / mainSessions) * subjectData.topics.length);
      const topic = subjectData.topics[topicIndex];

      blocks.push({
        subject: subjectData.subject,
        topic: topic.name,
        type: 'main',
        hours: HOURS_PER_SESSION,
        date: currentDate.toISOString().split('T')[0],
        startTime,
        endTime
      });

      // Move to next day if we've completed 3 sessions
      if (dailySessionIndex === 2) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Add connection sessions
    for (let i = 0; i < connectionSessions; i++) {
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const dailySessionIndex = Math.min(2, Math.floor(i % 3));
      const startTime = addHours(DAILY_START_TIME, dailySessionIndex * HOURS_PER_SESSION);
      const endTime = addHours(startTime, HOURS_PER_SESSION);

      const mainTopic = subjectData.topics[i % subjectData.topics.length];

      blocks.push({
        subject: subjectData.subject,
        topic: mainTopic.name,
        type: 'connection',
        hours: HOURS_PER_SESSION,
        date: currentDate.toISOString().split('T')[0],
        startTime,
        endTime,
        connectionTopics: findRelatedTopics(subjectData.subject, mainTopic.name, subjectsData)
      });

      if (dailySessionIndex === 2) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
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