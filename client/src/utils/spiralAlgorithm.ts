import { SubjectsData } from '../data/masterSubjects';

interface SpiralConfig {
  weeklyStudyHours: number;
  yearMultiplier: number;
  favouriteSubjects: string[];
  subjectsData: SubjectsData;
  revisionCount?: number; // Track how many times we've revised each subject
}

interface StudyBlock {
  subject: string;
  topic: string;
  type: 'main' | 'connection';
  hours: number;
  date: string;
  startTime: string;
  endTime: string;
  connectionTopics?: string[]; // For connection sessions
}

const HOURS_PER_SESSION = 2;
const DAILY_START_TIME = "09:00";
const CONNECTION_SESSION_RATIO = 0.2; // 20% of time for connection sessions
const BASE_TIME_PER_TOPIC = 1; // Base hours per topic
const TIME_REDUCTION_PER_REVISION = 0.2; // 20% reduction per complete revision

// Helper function to calculate topic base time
function calculateTopicBaseTime(topic: any): number {
  // Calculate base time needed based on difficulty and importance
  const complexityScore = (
    topic.ratings.difficulty +
    topic.ratings.clinicalImportance +
    topic.ratings.examRelevance
  ) / 3; // Average of all ratings

  // Scale the base time according to complexity (1-10 scale)
  return BASE_TIME_PER_TOPIC * (complexityScore / 5);
}

// Helper function to calculate subject total time
function calculateSubjectTime(
  subject: any, 
  yearGroup: number, 
  revisionCount: number = 0
): number {
  // Calculate base time for all topics in the subject
  let totalTime = subject.topics.reduce((acc: number, topic: any) => {
    return acc + calculateTopicBaseTime(topic);
  }, 0);

  // Apply year group multiplier (higher years study faster)
  const yearMultiplier = Math.max(0.4, 1 - ((yearGroup - 1) * 0.15));

  // Apply revision count reduction
  const revisionMultiplier = Math.max(0.3, 1 - (revisionCount * TIME_REDUCTION_PER_REVISION));

  return totalTime * yearMultiplier * revisionMultiplier;
}

// Helper to find related topics based on difficulty and importance
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

  // Find topics with similar difficulty and importance
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

  return relatedTopics.slice(0, 3); // Return top 3 related topics
}

export function generateSpiralTimetable(config: SpiralConfig): StudyBlock[] {
  const { weeklyStudyHours, yearMultiplier, favouriteSubjects, subjectsData, revisionCount = 0 } = config;
  const blocks: StudyBlock[] = [];

  // Calculate required time for each subject
  const subjectTimes = subjectsData.map(subject => ({
    subject: subject.name,
    totalTime: calculateSubjectTime(subject, yearMultiplier, revisionCount),
    topics: subject.topics,
    isFavorite: favouriteSubjects.includes(subject.name)
  }));

  // Adjust times based on favorites
  subjectTimes.forEach(subject => {
    if (subject.isFavorite) {
      subject.totalTime *= 1.2; // 20% more time for favorite subjects
    }
  });

  // Calculate total time needed
  const totalTimeNeeded = subjectTimes.reduce((acc, subject) => acc + subject.totalTime, 0);

  // Scale times to fit within weekly hours
  const timeScale = weeklyStudyHours / totalTimeNeeded;
  subjectTimes.forEach(subject => {
    subject.totalTime *= timeScale;
  });

  // Sort subjects by time needed (descending)
  subjectTimes.sort((a, b) => b.totalTime - a.totalTime);

  // Calculate number of sessions needed
  const totalSessions = Math.floor(weeklyStudyHours / HOURS_PER_SESSION);
  const connectionSessions = Math.floor(totalSessions * CONNECTION_SESSION_RATIO);
  const mainSessions = totalSessions - connectionSessions;

  // Generate study blocks for one week
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = new Date();
  const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));

  // Distribute main study sessions
  let currentDay = 0;
  let sessionsCreated = 0;

  // Allocate sessions to subjects based on their time requirements
  subjectTimes.forEach(subject => {
    const sessionsNeeded = Math.ceil(subject.totalTime / HOURS_PER_SESSION);

    for (let i = 0; i < sessionsNeeded && sessionsCreated < mainSessions; i++) {
      const date = new Date(monday);
      date.setDate(date.getDate() + currentDay);

      const startTime = addHours(DAILY_START_TIME, (sessionsCreated % 3) * HOURS_PER_SESSION);
      const endTime = addHours(startTime, HOURS_PER_SESSION);

      // Select topic based on position in revision cycle
      const topicIndex = Math.floor((i / sessionsNeeded) * subject.topics.length);
      const topic = subject.topics[topicIndex];

      blocks.push({
        subject: subject.subject,
        topic: topic.name,
        type: 'main',
        hours: HOURS_PER_SESSION,
        date: date.toISOString().split('T')[0],
        startTime,
        endTime
      });

      sessionsCreated++;
      currentDay = (currentDay + 1) % 5;
    }
  });

  // Add connection sessions
  for (let i = 0; i < connectionSessions; i++) {
    const mainBlock = blocks[Math.floor(Math.random() * blocks.length)];
    const date = new Date(monday);
    date.setDate(date.getDate() + currentDay);

    const startTime = addHours(DAILY_START_TIME, (sessionsCreated % 3) * HOURS_PER_SESSION);
    const endTime = addHours(startTime, HOURS_PER_SESSION);

    blocks.push({
      subject: mainBlock.subject,
      topic: mainBlock.topic,
      type: 'connection',
      hours: HOURS_PER_SESSION,
      date: date.toISOString().split('T')[0],
      startTime,
      endTime,
      connectionTopics: findRelatedTopics(mainBlock.subject, mainBlock.topic, subjectsData)
    });

    sessionsCreated++;
    currentDay = (currentDay + 1) % 5;
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