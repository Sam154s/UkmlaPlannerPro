import { SubjectsData } from '../data/masterSubjects';

interface SpiralConfig {
  weeklyStudyHours: number;
  yearMultiplier: number;
  favouriteSubjects: string[];
  subjectsData: SubjectsData;
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

// Helper function to calculate topic importance score
function calculateTopicScore(topic: any, yearMultiplier: number, isFavorite: boolean): number {
  const baseScore = topic.ratings.difficulty + 
                   topic.ratings.clinicalImportance + 
                   topic.ratings.examRelevance;
  const favoriteBonus = isFavorite ? 2 : 0;
  return (baseScore * yearMultiplier) + favoriteBonus;
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
  const { weeklyStudyHours, yearMultiplier, favouriteSubjects, subjectsData } = config;
  const blocks: StudyBlock[] = [];

  // Calculate priority scores for each subject and topic
  const subjectPriorities = subjectsData.map(subject => {
    const isFavorite = favouriteSubjects.includes(subject.name);
    const topicScores = subject.topics.map(topic => ({
      name: topic.name,
      score: calculateTopicScore(topic, yearMultiplier, isFavorite),
      difficulty: topic.ratings.difficulty
    }));

    return {
      subject: subject.name,
      topics: topicScores,
      totalScore: topicScores.reduce((sum, topic) => sum + topic.score, 0)
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  // Calculate number of sessions needed
  const totalSessions = Math.floor(weeklyStudyHours / HOURS_PER_SESSION);
  const connectionSessions = Math.floor(totalSessions * CONNECTION_SESSION_RATIO);
  const mainSessions = totalSessions - connectionSessions;

  // Generate study blocks for one week
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = new Date();
  const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));

  // Distribute main study sessions
  let currentSubjectIndex = 0;
  let currentDay = 0;
  let sessionsCreated = 0;

  while (sessionsCreated < mainSessions && currentSubjectIndex < subjectPriorities.length) {
    const currentSubject = subjectPriorities[currentSubjectIndex];
    const sessionsForSubject = Math.max(
      1,
      Math.floor((currentSubject.totalScore / subjectPriorities[0].totalScore) * mainSessions)
    );

    for (let i = 0; i < sessionsForSubject && sessionsCreated < mainSessions; i++) {
      const date = new Date(monday);
      date.setDate(date.getDate() + currentDay);

      const startTime = addHours(DAILY_START_TIME, (sessionsCreated % 3) * HOURS_PER_SESSION);
      const endTime = addHours(startTime, HOURS_PER_SESSION);

      // Pick a topic from the current subject
      const topic = currentSubject.topics[i % currentSubject.topics.length];

      blocks.push({
        subject: currentSubject.subject,
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

    currentSubjectIndex++;
  }

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