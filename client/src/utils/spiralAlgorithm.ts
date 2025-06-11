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
  userEvents?: UserEvent[]; // User events that should not be overlapped
  revisionCount?: number;
}

// Represents user performance data for subjects and topics
export interface UserPerformance {
  subjects?: { [subjectName: string]: number }; // 0-1 value where 0 is struggling, 1 is mastery
  topics?: { [subjectAndTopic: string]: number }; // Format: "SubjectName: TopicName" => 0-1 score
}

// Represents a user-defined event that blocks a time slot
export interface UserEvent {
  name: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  recurringWeekly?: boolean; // Whether this event recurs weekly
  recurringDays?: string[]; // Days of the week for recurring events
  type?: 'personal' | 'placement' | 'meal' | 'sleep'; // Type of event
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
  isInterjection?: boolean; // Flag for blocks interjected from other subjects
}

interface SubjectWithPriority {
  subject: string;
  topics: any[];
  totalBlocks: number;
  isFavorite: boolean;
  performanceMultiplier: number;
}

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
}

const DAILY_START_TIME = "17:00"; // Default start time for revision sessions (5pm)
const DAILY_END_TIME = "22:00"; // End time for studying
const TOPICS_PER_SESSION = 3;
const FAVORITE_SUBJECT_PRIORITY_BOOST = 1.5;
const LOW_PERFORMANCE_BOOST = 1.3; // Boost for subjects/topics user is struggling with
const DEFAULT_PASS_COVERAGE = 3; // Default number of passes through all subjects
const INTERJECTION_INTERVAL = 4; // Interject after every X blocks
const POOR_PERFORMANCE_THRESHOLD = 0.4; // Threshold below which to consider poor performance

// Helper function to calculate topic importance score
function calculateTopicImportance(topic: any): number {
  return (
    topic.ratings.difficulty +
    topic.ratings.clinicalImportance +
    topic.ratings.examRelevance
  ) / 3;
}

// Find related topics for connections with preference for same condition group
function findRelatedTopics(
  currentSubject: string,
  currentTopic: string,
  subjectsData: SubjectsData,
  excludeTopics: string[] = []
): string[] {
  const relatedTopics: string[] = [];
  const sameGroupTopics: string[] = [];
  
  // Find the current subject and topic
  const currentSubjectData = subjectsData.find(s => s.name === currentSubject);
  const currentTopicData = currentSubjectData?.topics.find(t => t.name === currentTopic);

  if (!currentTopicData || !currentSubjectData) return relatedTopics;

  // Find which condition group(s) the current topic belongs to
  const topicGroups: string[] = [];
  currentSubjectData.conditionGroups.forEach(group => {
    if (group.conditions.includes(currentTopic)) {
      topicGroups.push(group.name);
    }
  });

  subjectsData.forEach(subject => {
    // First pass: look for topics in the same condition group
    if (topicGroups.length > 0 && subject.name === currentSubject) {
      subject.conditionGroups
        .filter(group => topicGroups.includes(group.name))
        .forEach(group => {
          group.conditions.forEach(topicName => {
            if (topicName !== currentTopic && 
                !excludeTopics.includes(`${subject.name}: ${topicName}`)) {
              const topicData = subject.topics.find(t => t.name === topicName);
              if (topicData) {
                sameGroupTopics.push(`${subject.name}: ${topicName}`);
              }
            }
          });
        });
    }
    
    // Second pass: look for topics with similar importance
    subject.topics.forEach(topic => {
      if (excludeTopics.includes(`${subject.name}: ${topic.name}`)) return;
      if (sameGroupTopics.includes(`${subject.name}: ${topic.name}`)) return;

      const importanceDiff = Math.abs(
        calculateTopicImportance(topic) - calculateTopicImportance(currentTopicData)
      );

      if (importanceDiff <= 2) {
        relatedTopics.push(`${subject.name}: ${topic.name}`);
      }
    });
  });

  // Prioritize topics from the same condition group
  const combinedTopics = [...sameGroupTopics, ...relatedTopics];
  return combinedTopics.slice(0, 2);
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

// Get topics sorted by performance and condition groups
function getTopicsByPerformance(
  subject: SubjectWithPriority, 
  userPerformance?: UserPerformance,
  subjectsData?: SubjectsData
): any[] {
  const topics = [...subject.topics];
  
  // First sort by performance if available
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
  
  // If we have access to the subjects data, we can group by condition groups
  if (subjectsData) {
    const subjectData = subjectsData.find(s => s.name === subject.subject);
    if (subjectData && subjectData.conditionGroups.length > 0) {
      // Map topics to their condition groups
      const topicGroups = new Map<string, string[]>();
      
      // Create a mapping of topic names to their condition groups
      subjectData.conditionGroups.forEach(group => {
        group.conditions.forEach(topicName => {
          if (!topicGroups.has(topicName)) {
            topicGroups.set(topicName, []);
          }
          topicGroups.get(topicName)?.push(group.name);
        });
      });
      
      // Regroup topics by condition groups while maintaining performance ordering
      const groupedTopics: any[] = [];
      const processedTopics = new Set<string>();
      
      // Process topics in their current (performance-based) order
      for (const topic of topics) {
        if (processedTopics.has(topic.name)) continue;
        
        // Add this topic to the result
        groupedTopics.push(topic);
        processedTopics.add(topic.name);
        
        // Find the condition groups this topic belongs to
        const groups = topicGroups.get(topic.name) || [];
        
        // For each group, add related topics that haven't been processed
        groups.forEach(groupName => {
          const groupConditions = subjectData.conditionGroups
            .find(g => g.name === groupName)?.conditions || [];
          
          // Add other topics from the same group that haven't been processed yet
          groupConditions.forEach(relatedTopicName => {
            if (relatedTopicName !== topic.name && !processedTopics.has(relatedTopicName)) {
              const relatedTopic = topics.find(t => t.name === relatedTopicName);
              if (relatedTopic) {
                groupedTopics.push(relatedTopic);
                processedTopics.add(relatedTopicName);
              }
            }
          });
        });
      }
      
      // Add any remaining topics not in condition groups
      topics.forEach(topic => {
        if (!processedTopics.has(topic.name)) {
          groupedTopics.push(topic);
          processedTopics.add(topic.name);
        }
      });
      
      return groupedTopics;
    }
  }
  
  // Fallback to just performance-sorted topics
  return topics;
}

// Get underperforming subject and its topics
function getUnderperformingSubject(
  subjectPriorities: SubjectWithPriority[],
  currentSubjectName: string,
  userPerformance?: UserPerformance
): SubjectWithPriority | null {
  // Filter out the current subject
  const otherSubjects = subjectPriorities.filter(s => s.subject !== currentSubjectName);
  if (otherSubjects.length === 0) return null;
  
  // Look for subjects with low performance scores
  const poorPerformers = otherSubjects.filter(s => {
    if (!userPerformance?.subjects) return false;
    const performance = userPerformance.subjects[s.subject] ?? 0.5;
    return performance < POOR_PERFORMANCE_THRESHOLD;
  });
  
  // If there are poor performers, return the worst one
  if (poorPerformers.length > 0) {
    return poorPerformers.sort((a, b) => {
      const perfA = userPerformance?.subjects?.[a.subject] ?? 0.5;
      const perfB = userPerformance?.subjects?.[b.subject] ?? 0.5;
      return perfA - perfB;
    })[0];
  }
  
  // Otherwise, return a random subject that isn't the current one
  return otherSubjects[Math.floor(Math.random() * otherSubjects.length)];
}

// Check if a time slot overlaps with any user event
function overlapsWithUserEvent(
  slot: TimeSlot,
  userEvents?: UserEvent[]
): boolean {
  if (!userEvents || userEvents.length === 0) return false;
  
  return userEvents.some(event => {
    // For recurring events, check if the day of the week matches
    if (event.recurringWeekly) {
      const slotDate = new Date(slot.date);
      const eventDate = new Date(event.date);
      if (slotDate.getDay() !== eventDate.getDay()) return false;
    } else {
      // For non-recurring events, dates must match exactly
      if (event.date !== slot.date) return false;
    }
    
    // Check time overlap
    const eventStart = timeToMinutes(event.startTime);
    const eventEnd = timeToMinutes(event.endTime);
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    
    return (slotStart < eventEnd && slotEnd > eventStart);
  });
}

// Convert time string (HH:MM) to minutes for comparison
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Find the next available time slot that doesn't overlap with user events
function findNextAvailableSlot(
  date: Date,
  startTime: string,
  hours: number,
  hoursPerDay: number,
  dailyHoursUsed: number,
  availableDays: number[],
  userEvents?: UserEvent[]
): { slot: TimeSlot, newDate: Date, newDailyHoursUsed: number } {
  let currentDate = new Date(date);
  let currDailyHoursUsed = dailyHoursUsed;
  let requestedHours = hours; // Store the originally requested hours
  
  // Try to find a slot today
  if (currDailyHoursUsed < hoursPerDay) {
    const potentialSlot: TimeSlot = {
      date: currentDate.toISOString().split('T')[0],
      startTime: addHours(startTime, currDailyHoursUsed),
      endTime: addHours(startTime, currDailyHoursUsed + hours),
      hours
    };
    
    if (!overlapsWithUserEvent(potentialSlot, userEvents)) {
      return {
        slot: potentialSlot,
        newDate: currentDate,
        newDailyHoursUsed: currDailyHoursUsed + hours
      };
    }
    
    // If slot overlaps, try to find another slot later today
    const startTimeMinutes = timeToMinutes(potentialSlot.startTime);
    const endTimeMinutes = timeToMinutes(DAILY_END_TIME);
    let nextStartMinutes = startTimeMinutes;
    
    // Try 1-minute increments for more precise scheduling
    while (nextStartMinutes + hours * 60 <= endTimeMinutes) {
      // Try 1-minute increments
      nextStartMinutes += 1;
      
      const nextStartTime = minutesToTime(nextStartMinutes);
      const nextEndTime = addHours(nextStartTime, hours);
      
      const nextSlot: TimeSlot = {
        date: currentDate.toISOString().split('T')[0],
        startTime: nextStartTime,
        endTime: nextEndTime,
        hours
      };
      
      if (!overlapsWithUserEvent(nextSlot, userEvents)) {
        // Calculate new daily hours used based on the end time
        const newHoursUsed = (timeToMinutes(nextEndTime) - timeToMinutes(startTime)) / 60;
        return {
          slot: nextSlot,
          newDate: currentDate,
          newDailyHoursUsed: newHoursUsed > hoursPerDay ? hoursPerDay : newHoursUsed
        };
      }
    }
    
    // If we couldn't find a slot with the requested hours, 
    // and this is a main block (2 hours), try with 1 hour instead
    if (hours === 2) {
      return findNextAvailableSlot(
        currentDate,
        startTime,
        1, // Fallback to 1 hour
        hoursPerDay,
        dailyHoursUsed,
        availableDays,
        userEvents
      );
    }
  }
  
  // If we couldn't find a slot today, try the next day
  do {
    currentDate.setDate(currentDate.getDate() + 1);
  } while (!availableDays.includes(currentDate.getDay() || 7));
  
  // Start fresh in the morning with the originally requested hours
  const nextDaySlot: TimeSlot = {
    date: currentDate.toISOString().split('T')[0],
    startTime: DAILY_START_TIME,
    endTime: addHours(DAILY_START_TIME, requestedHours),
    hours: requestedHours
  };
  
  // If this slot overlaps with events, recursively find the next one
  if (overlapsWithUserEvent(nextDaySlot, userEvents)) {
    return findNextAvailableSlot(
      currentDate,
      DAILY_START_TIME,
      requestedHours,
      hoursPerDay,
      0,
      availableDays,
      userEvents
    );
  }
  
  return {
    slot: nextDaySlot,
    newDate: currentDate,
    newDailyHoursUsed: requestedHours
  };
}

// Convert minutes back to time string (HH:MM)
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
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
    userEvents,
    passCoverage = DEFAULT_PASS_COVERAGE,
    revisionCount = 0 
  } = config;
  
  const blocks: StudyBlock[] = [];
  const BLOCK_DURATION_HOURS = 2;
  
  // Filter selected subjects
  const selectedSubjectsData = subjectsData.filter(subject => 
    favouriteSubjects.includes(subject.name)
  );
  
  if (selectedSubjectsData.length === 0) {
    return blocks;
  }

  // Generate exactly one study session per day, spread across weeks
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  
  let subjectIndex = 0;
  
  // Generate schedule for 4 weeks
  for (let week = 0; week < 4; week++) {
    // For each week, create study days based on daysPerWeek
    for (let dayInWeek = 0; dayInWeek < daysPerWeek; dayInWeek++) {
      // Calculate the actual date for this study day
      const currentDate = new Date(startDate);
      
      // For 5 days per week: Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5
      // For 7 days per week: Monday=1, Tuesday=2, ..., Sunday=0
      let targetDayOfWeek;
      if (daysPerWeek <= 5) {
        // Weekdays only: Monday (1) through Friday (5)
        targetDayOfWeek = dayInWeek + 1;
      } else {
        // All days: Monday (1) through Sunday (0)
        targetDayOfWeek = dayInWeek === 6 ? 0 : dayInWeek + 1;
      }
      
      // Find the target day in the current week
      const daysToAdd = (week * 7) + ((targetDayOfWeek - currentDate.getDay() + 7) % 7);
      currentDate.setDate(startDate.getDate() + daysToAdd);
      
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Create exactly ONE study block for this day
      const startTime = '09:00'; // Always start at 9 AM
      const endTime = '11:00';   // Always 2-hour blocks
      
      // Assign one subject per day (rotating through subjects)
      const currentSubject = selectedSubjectsData[subjectIndex % selectedSubjectsData.length];
      
      const sessionTopics = currentSubject.topics.slice(0, 3).map(topic => ({
        name: topic.name,
        type: 'main' as const
      }));
      
      blocks.push({
        subject: currentSubject.name,
        topics: sessionTopics,
        hours: BLOCK_DURATION_HOURS,
        date: dateStr,
        startTime,
        endTime,
        passNumber: 1,
        isInterjection: false
      });
      
      subjectIndex++;
    }
  }
  
  return blocks;
}

// Helper to add hours to a time string
function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const newHours = h + Math.floor(hours);
  const newMinutes = m + ((hours % 1) * 60);
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}