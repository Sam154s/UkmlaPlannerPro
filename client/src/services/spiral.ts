import masterSubjects from '@/data/masterSubjects';

export interface SpiralConfig {
  hoursPerWeek: number;
  studyDays: number[];
  yearMultiplier: number;
  subjects: any[];
  blocksTable: Record<string, number>;
  favouriteSubjects: string[];
}

export interface TopicAllocation {
  subject: string;
  topic: string;
  minutes: number;
  difficulty: number;
  clinicalImportance: number;
  examRelevance: number;
}

export interface StudySession {
  id: string;
  subject: string;
  topics: string[];
  minutes: number;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  isReview?: boolean;
}

/**
 * Production-ready spiral timetable generator with weighted condition allocation
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

    const totalMin = blocks * 60 * config.yearMultiplier;
    
    const wSum = subject.topics.reduce((s: number, t: any) => {
      return s + (t.ratings.difficulty + t.ratings.clinicalImportance + t.ratings.examRelevance);
    }, 0);

    subject.topics.forEach((t: any) => {
      const weight = t.ratings.difficulty + t.ratings.clinicalImportance + t.ratings.examRelevance;
      const minutes = Math.round(totalMin * (weight / wSum));
      
      if (minutes > 0) {
        allocations.push({
          subject: subjectName,
          topic: t.name,
          minutes,
          difficulty: t.ratings.difficulty,
          clinicalImportance: t.ratings.clinicalImportance,
          examRelevance: t.ratings.examRelevance,
        });
      }
    });
  });

  return allocations.sort((a, b) => b.difficulty - a.difficulty);
}

/**
 * Pack topics into variable-length sessions (60-120 minutes) using greedy algorithm
 */
function packIntoSessions(topicAllocations: TopicAllocation[]): StudySession[] {
  const sessions: StudySession[] = [];
  let currentSession: {
    subject: string;
    topics: string[];
    minutes: number;
  } | null = null;

  topicAllocations.forEach((allocation) => {
    if (!currentSession) {
      currentSession = {
        subject: allocation.subject,
        topics: [allocation.topic],
        minutes: allocation.minutes,
      };
    } else if (
      currentSession.minutes + allocation.minutes <= 120 &&
      currentSession.subject === allocation.subject
    ) {
      currentSession.topics.push(allocation.topic);
      currentSession.minutes += allocation.minutes;
    } else {
      if (currentSession.minutes >= 60) {
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

      currentSession = {
        subject: allocation.subject,
        topics: [allocation.topic],
        minutes: allocation.minutes,
      };
    }

    if (currentSession && currentSession.minutes >= 90) {
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
      currentSession = null;
    }
  });

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

  return sessions;
}

/**
 * Schedule sessions on calendar with time slots
 */
function scheduleOnCalendar(sessions: StudySession[], config: SpiralConfig): StudySession[] {
  const scheduledSessions: StudySession[] = [];
  const startDate = new Date();
  let currentDate = new Date(startDate);
  let dailyMinutesUsed = 0;
  const dailyLimit = (config.hoursPerWeek * 60) / config.studyDays.length;

  sessions.forEach((session) => {
    while (!config.studyDays.includes(currentDate.getDay()) || 
           dailyMinutesUsed + session.minutes > dailyLimit) {
      currentDate.setDate(currentDate.getDate() + 1);
      dailyMinutesUsed = 0;
    }

    const startHour = 17 + Math.floor(dailyMinutesUsed / 60);
    const startMinute = dailyMinutesUsed % 60;
    const endMinutes = dailyMinutesUsed + session.minutes;
    const endHour = 17 + Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;

    scheduledSessions.push({
      ...session,
      date: currentDate.toISOString().split('T')[0],
      startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
      endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
    });

    dailyMinutesUsed += session.minutes;
  });

  return scheduledSessions;
}

/**
 * Convert study sessions to FullCalendar events
 */
export function mapToEvents(sessions: StudySession[]): any[] {
  return sessions.map(session => ({
    id: session.id,
    title: `${session.subject} (${Math.round(session.minutes/60)}h)`,
    start: `${session.date}T${session.startTime}`,
    end: `${session.date}T${session.endTime}`,
    backgroundColor: getSubjectColor(session.subject),
    extendedProps: {
      session,
    },
  }));
}

function getSubjectColor(subject: string): string {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  const index = subject.length % colors.length;
  return colors[index];
}

// Legacy API compatibility
export const generateTimetableAPI = generateSpiralTimetable;