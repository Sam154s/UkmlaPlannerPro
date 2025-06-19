import { api } from '@/lib/apiClient';
import masterSubjects from '@/data/masterSubjects';

export interface SpiralConfig {
  blocksTable: Record<string, number>;
  yearMultiplier: number;
  studyDays: number[];
  hoursPerWeek: number;
  startDate: Date;
  favouriteSubjects: string[];
  leastFavouriteSubjects: string[];
  userPerformance?: Record<string, number>;
}

export interface StudySession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  topics: string[];
  minutes: number;
  type: 'study' | 'review';
  isReview?: boolean;
}

export interface TopicAllocation {
  subject: string;
  topic: string;
  minutes: number;
  difficulty: number;
  clinicalImportance: number;
  examRelevance: number;
}

/**
 * Enhanced spiral algorithm with variable-length sessions (60-120 min)
 * Implements weighted topic allocation and greedy session packing
 */
export function generateSpiralTimetable(config: SpiralConfig): StudySession[] {
  const topicAllocations = calculateTopicAllocations(config);
  const sessions = packIntoSessions(topicAllocations);
  return scheduleOnCalendar(sessions, config);
}

/**
 * Calculate minutes allocation for each topic based on weighted importance
 */
function calculateTopicAllocations(config: SpiralConfig): TopicAllocation[] {
  const allocations: TopicAllocation[] = [];

  Object.entries(config.blocksTable).forEach(([subjectName, blocks]) => {
    const subject = masterSubjects.find((s: any) => s.name === subjectName);
    if (!subject) return;

    const totalMinutes = blocks * 60 * config.yearMultiplier;
    
    // Calculate weight sum for proportional allocation
    const weightSum = subject.topics.reduce((sum: number, topic: any) => {
      return sum + (topic.ratings.difficulty + topic.ratings.clinicalImportance + topic.ratings.examRelevance);
    }, 0);

    subject.topics.forEach((topic: any) => {
      const weight = topic.ratings.difficulty + topic.ratings.clinicalImportance + topic.ratings.examRelevance;
      const minutes = Math.round(totalMinutes * (weight / weightSum));
      
      if (minutes > 0) {
        allocations.push({
          subject: subjectName,
          topic: topic.name,
          minutes,
          difficulty: topic.ratings.difficulty,
          clinicalImportance: topic.ratings.clinicalImportance,
          examRelevance: topic.ratings.examRelevance,
        });
      }
    });
  });

  return allocations.sort((a, b) => {
    // Prioritize by difficulty and clinical importance
    const aScore = a.difficulty * 0.4 + a.clinicalImportance * 0.6;
    const bScore = b.difficulty * 0.4 + b.clinicalImportance * 0.6;
    return bScore - aScore;
  });
}

/**
 * Pack topics into variable-length sessions using greedy algorithm
 */
interface SessionBuffer {
  subject: string;
  topics: string[];
  minutes: number;
}

function packIntoSessions(allocations: TopicAllocation[]): StudySession[] {
  const sessions: StudySession[] = [];
  let currentSession: SessionBuffer | null = null;

  allocations.forEach(allocation => {
    // Start new session if needed
    if (!currentSession || 
        currentSession.subject !== allocation.subject ||
        currentSession.minutes + allocation.minutes > 120) {
      
      // Save previous session if exists and meets minimum duration
      if (currentSession && currentSession.minutes >= 60) {
        sessions.push({
          id: `session-${sessions.length}`,
          subject: currentSession.subject,
          topics: currentSession.topics,
          minutes: currentSession.minutes,
          type: 'study',
          date: '',
          startTime: '',
          endTime: ''
        });
      }

      // Start new session
      currentSession = {
        subject: allocation.subject,
        topics: [allocation.topic],
        minutes: allocation.minutes
      } as SessionBuffer;
    } else {
      // Add to current session
      currentSession.topics.push(allocation.topic);
      currentSession.minutes += allocation.minutes;
    }
  });

  // Add final session
  if (currentSession && currentSession.minutes >= 60) {
    sessions.push({
      id: `session-${sessions.length}`,
      subject: currentSession.subject,
      topics: currentSession.topics,
      minutes: currentSession.minutes,
      type: 'study' as const,
      date: '',
      startTime: '',
      endTime: ''
    });
  }

  return sessions;
}

/**
 * Schedule sessions on calendar respecting study days and daily limits
 */
function scheduleOnCalendar(sessions: StudySession[], config: SpiralConfig): StudySession[] {
  const dailyMinutesLimit = (config.hoursPerWeek * 60) / config.studyDays.length;
  const scheduledSessions: StudySession[] = [];
  
  let currentDate = new Date(config.startDate);
  let dailyMinutesUsed = 0;
  let currentTime = 17 * 60; // Start at 5 PM (in minutes)

  sessions.forEach(session => {
    // Find next available study day
    while (!config.studyDays.includes(currentDate.getDay()) || 
           dailyMinutesUsed + session.minutes > dailyMinutesLimit) {
      
      if (config.studyDays.includes(currentDate.getDay())) {
        // Reset for new day
        dailyMinutesUsed = 0;
        currentTime = 17 * 60;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Schedule session
    const startTime = formatTime(currentTime);
    const endTime = formatTime(currentTime + session.minutes);
    
    scheduledSessions.push({
      ...session,
      date: currentDate.toISOString().split('T')[0],
      startTime,
      endTime
    });

    // Update counters
    dailyMinutesUsed += session.minutes;
    currentTime += session.minutes;
    
    // If day is full, move to next day
    if (dailyMinutesUsed >= dailyMinutesLimit) {
      currentDate.setDate(currentDate.getDate() + 1);
      dailyMinutesUsed = 0;
      currentTime = 17 * 60;
    }
  });

  return scheduledSessions;
}

/**
 * Convert minutes to HH:MM format
 */
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * API integration for timetable generation
 */
export async function generateTimetableAPI(config: SpiralConfig): Promise<StudySession[]> {
  try {
    const response = await api.post('/timetables/generate', config);
    return response.data;
  } catch (error) {
    console.error('API generation failed, using local algorithm:', error);
    return generateSpiralTimetable(config);
  }
}

/**
 * Convert sessions to calendar events format
 */
export function mapToEvents(sessions: StudySession[]) {
  return sessions.map(session => ({
    id: session.id,
    title: `${session.subject}: ${session.topics.slice(0, 2).join(', ')}${session.topics.length > 2 ? '...' : ''}`,
    start: `${session.date}T${session.startTime}`,
    end: `${session.date}T${session.endTime}`,
    backgroundColor: getSubjectColor(session.subject),
    extendedProps: {
      subject: session.subject,
      topics: session.topics,
      minutes: session.minutes,
      type: session.type
    }
  }));
}

/**
 * Get subject color for calendar display
 */
function getSubjectColor(subject: string): string {
  const colors = {
    'Acute and emergency medicine': '#ef4444',
    'Endocrinology and diabetes': '#f97316',
    'Gastroenterology': '#eab308',
    'Cardiovascular': '#22c55e',
    'Respiratory': '#06b6d4',
    'Neurology': '#8b5cf6',
    'Psychiatry': '#ec4899',
    'Dermatology': '#f59e0b',
    'Infectious diseases': '#10b981',
    'Haematology and oncology': '#6366f1',
  };
  return colors[subject as keyof typeof colors] || '#6b7280';
}