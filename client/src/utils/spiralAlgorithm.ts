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

const HOURS_PER_SESSION = 2;
const DAILY_START_TIME = "09:00";
const BASE_TIME_PER_TOPIC = 0.5; // Base hours per topic
const TIME_REDUCTION_PER_REVISION = 0.2;
const FAVORITE_SUBJECT_PRIORITY_BOOST = 1.5;
const TOPICS_PER_SESSION = 3; // Number of topics to cover in each session

// Calculate base time needed for a topic based on its ratings
function calculateTopicTime(topic: any): number {
  const ratingSum = (
    topic.ratings.difficulty +
    topic.ratings.clinicalImportance +
    topic.ratings.examRelevance
  );
  return BASE_TIME_PER_TOPIC * (ratingSum / 15); // Scale based on total possible rating (30)
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

      const difficultyDiff = Math.abs(topic.ratings.difficulty - currentTopicData.ratings.difficulty);
      const importanceDiff = Math.abs(topic.ratings.clinicalImportance - currentTopicData.ratings.clinicalImportance);

      if (difficultyDiff <= 2 && importanceDiff <= 2) {
        relatedTopics.push(`${subject.name}: ${topic.name}`);
      }
    });
  });

  return relatedTopics.slice(0, 2); // Return top 2 related topics
}

export function generateSpiralTimetable(config: SpiralConfig): StudyBlock[] {
  const { weeklyStudyHours, yearMultiplier, favouriteSubjects, subjectsData, revisionCount = 0 } = config;
  const blocks: StudyBlock[] = [];

  // Start from today
  const startDate = new Date();
  let currentDate = new Date(startDate);

  // Calculate available sessions per week
  const sessionsPerWeek = Math.floor(weeklyStudyHours / HOURS_PER_SESSION);

  // Calculate subject priorities and total time needed
  const subjectPriorities = subjectsData.map(subject => {
    const isFavorite = favouriteSubjects.includes(subject.name);
    const totalTopicTime = subject.topics.reduce((acc, topic) => {
      return acc + calculateTopicTime(topic);
    }, 0);

    // Apply multipliers
    const yearAdjustment = Math.max(0.4, 1 - ((yearMultiplier - 1) * 0.15));
    const revisionAdjustment = Math.max(0.3, 1 - (revisionCount * TIME_REDUCTION_PER_REVISION));
    const favoriteMultiplier = isFavorite ? FAVORITE_SUBJECT_PRIORITY_BOOST : 1;

    return {
      subject: subject.name,
      topics: subject.topics,
      totalTime: totalTopicTime * yearAdjustment * revisionAdjustment * favoriteMultiplier,
      isFavorite
    };
  });

  // Calculate total time and scale factor to match weekly hours
  const totalTimeNeeded = subjectPriorities.reduce((acc, subject) => acc + subject.totalTime, 0);
  const scaleFactor = weeklyStudyHours / totalTimeNeeded;

  // Scale times to match weekly hours
  subjectPriorities.forEach(subject => {
    subject.totalTime *= scaleFactor;
  });

  // Sort subjects (favorites first, then by time needed)
  subjectPriorities.sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return b.totalTime - a.totalTime;
  });

  // Generate blocks for each subject
  subjectPriorities.forEach(subjectData => {
    const sessionsNeeded = Math.ceil(subjectData.totalTime / HOURS_PER_SESSION);
    const topicsPerSession = Math.min(TOPICS_PER_SESSION, Math.ceil(subjectData.topics.length / sessionsNeeded));

    for (let session = 0; session < sessionsNeeded; session++) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const sessionStartIndex = (session * topicsPerSession) % subjectData.topics.length;
      const sessionTopics = [];

      // Add main topics for this session
      for (let i = 0; i < topicsPerSession; i++) {
        const topicIndex = (sessionStartIndex + i) % subjectData.topics.length;
        const topic = subjectData.topics[topicIndex];
        sessionTopics.push({
          name: topic.name,
          type: 'main' as const
        });

        // Add connection topics for the last main topic in the session
        if (i === topicsPerSession - 1) {
          const excludeTopics = sessionTopics.map(t => `${subjectData.subject}: ${t.name}`);
          const connections = findRelatedTopics(
            subjectData.subject,
            topic.name,
            subjectsData,
            excludeTopics
          );

          sessionTopics.push({
            name: topic.name,
            type: 'connection' as const,
            connectionTopics: connections
          });
        }
      }

      const dailySessionIndex = session % 3;
      const startTime = addHours(DAILY_START_TIME, dailySessionIndex * HOURS_PER_SESSION);
      const endTime = addHours(startTime, HOURS_PER_SESSION);

      blocks.push({
        subject: subjectData.subject,
        topics: sessionTopics,
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