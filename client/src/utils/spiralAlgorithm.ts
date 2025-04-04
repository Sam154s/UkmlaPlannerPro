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

  // Start from today
  const startDate = new Date();
  let currentDate = new Date(startDate);

  // Calculate blocks per week based on weekly hours
  const hoursPerDay = weeklyStudyHours / daysPerWeek;

  // Get available weekdays based on daysPerWeek
  const availableDays = Array.from({ length: 7 }, (_, i) => i + 1) // 1 = Monday, 7 = Sunday
    .slice(0, daysPerWeek);

  // Calculate and sort subjects by priority with performance adjustment
  const subjectPriorities: SubjectWithPriority[] = subjectsData.map(subject => {
    const baseBlocks = BASE_BLOCK_COUNTS[subject.name] || 10;
    const adjustedBlocks = calculateBlocksForYear(baseBlocks, yearGroup);
    const isFavorite = favouriteSubjects.includes(subject.name);
    const performanceMultiplier = getPerformanceMultiplier(subject.name, userPerformance);

    // Apply favorite boost and performance multiplier
    const totalBoost = isFavorite ? FAVORITE_SUBJECT_PRIORITY_BOOST : 1;
    
    return {
      subject: subject.name,
      topics: subject.topics,
      totalBlocks: Math.ceil(adjustedBlocks * totalBoost * performanceMultiplier),
      isFavorite,
      performanceMultiplier
    };
  }).sort((a, b) => {
    // Sort by performance issues first, then favorites, then block count
    if (a.performanceMultiplier !== b.performanceMultiplier) {
      return b.performanceMultiplier - a.performanceMultiplier;
    }
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return b.totalBlocks - a.totalBlocks;
  });

  // Get all subjects for processing
  let subjectsToProcess = [...subjectPriorities];
  
  // For first revision cycle (cycle 1), go through subjects linearly
  if (revisionCount === 0) {
    // Move favorite subjects to equal positions throughout the list
    if (favouriteSubjects.length > 0) {
      const favoriteSubjects = subjectsToProcess.filter(s => s.isFavorite);
      const nonFavoriteSubjects = subjectsToProcess.filter(s => !s.isFavorite);
      subjectsToProcess = [];
      
      // Calculate spacing for favorite subjects
      const spacing = Math.max(1, Math.floor(nonFavoriteSubjects.length / (favoriteSubjects.length + 1)));
      
      // Interleave favorite subjects with equal spacing
      let favoriteIndex = 0;
      for (let i = 0; i < nonFavoriteSubjects.length; i++) {
        subjectsToProcess.push(nonFavoriteSubjects[i]);
        
        // Insert a favorite subject at regular intervals
        if (favoriteIndex < favoriteSubjects.length && (i + 1) % spacing === 0) {
          subjectsToProcess.push(favoriteSubjects[favoriteIndex]);
          favoriteIndex++;
        }
      }
      
      // Add any remaining favorite subjects
      while (favoriteIndex < favoriteSubjects.length) {
        subjectsToProcess.push(favoriteSubjects[favoriteIndex]);
        favoriteIndex++;
      }
    }
  }
  
  // Multiple passes through all subjects
  for (let pass = 1; pass <= passCoverage; pass++) {
    for (const subjectData of subjectsToProcess) {
      // For each pass, allocate a percentage of the total blocks
      const blocksForThisPass = Math.ceil(subjectData.totalBlocks / passCoverage);
      let remainingBlocks = blocksForThisPass;
      let dailyHoursUsed = 0;
      let blockCount = 0; // Count blocks for interjection timing
      
      // Sort topics by performance and group by condition groups
      const sortedTopics = getTopicsByPerformance(subjectData, userPerformance, subjectsData);

      // Process blocks for this subject in this pass
      while (remainingBlocks > 0) {
        // Interject underperforming subject periodically
        if (blockCount > 0 && blockCount % INTERJECTION_INTERVAL === 0) {
          const underperformingSubject = getUnderperformingSubject(
            subjectPriorities, 
            subjectData.subject,
            userPerformance
          );
          
          if (underperformingSubject) {
            const underperformingTopics = getTopicsByPerformance(underperformingSubject, userPerformance, subjectsData);
            
            // Find next available time slot
            const { slot, newDate, newDailyHoursUsed } = findNextAvailableSlot(
              currentDate,
              DAILY_START_TIME,
              1, // Just 1 hour for interjection
              hoursPerDay,
              dailyHoursUsed,
              availableDays,
              userEvents
            );
            
            currentDate = newDate;
            dailyHoursUsed = newDailyHoursUsed;
            
            // Create topics list for interjection - limited to available topics
            const sessionTopics = [];
            const availableTopicCount = Math.min(TOPICS_PER_SESSION, underperformingTopics.length);
            
            for (let i = 0; i < availableTopicCount; i++) {
              sessionTopics.push({
                name: underperformingTopics[i].name,
                type: 'main' as const
              });
            }
            
            // Add connection topics if we have any main topics
            if (sessionTopics.length > 0) {
              const mainTopic = underperformingTopics[0];
              const excludeTopics = sessionTopics.map(t => `${underperformingSubject.subject}: ${t.name}`);
              const connections = findRelatedTopics(
                underperformingSubject.subject,
                mainTopic.name,
                subjectsData,
                excludeTopics
              );
              
              sessionTopics.push({
                name: mainTopic.name,
                type: 'connection' as const,
                connectionTopics: connections
              });
              
              // Add the interjection block
              blocks.push({
                subject: underperformingSubject.subject,
                topics: sessionTopics,
                hours: 1,
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                passNumber: pass,
                isInterjection: true
              });
            }
          }
        }
        
        // Find next available time slot for the main subject
        const { slot, newDate, newDailyHoursUsed } = findNextAvailableSlot(
          currentDate,
          DAILY_START_TIME,
          2, // Prefer 2 hours for main blocks
          hoursPerDay,
          dailyHoursUsed,
          availableDays,
          userEvents
        );
        
        currentDate = newDate;
        dailyHoursUsed = newDailyHoursUsed;
        
        // Calculate topics for this block based on the progress through this pass
        const passProgress = (blocksForThisPass - remainingBlocks) / blocksForThisPass;
        const topicStartIndex = Math.floor(passProgress * sortedTopics.length);
        const sessionTopics = [];
        
        // Add main topics - limited to the number of available topics
        const availableTopicCount = Math.min(TOPICS_PER_SESSION, sortedTopics.length);
        
        for (let i = 0; i < availableTopicCount; i++) {
          // Don't wrap around if we don't have enough topics
          const topicIndex = topicStartIndex + i;
          if (topicIndex >= sortedTopics.length) break;
          
          const topic = sortedTopics[topicIndex];
          sessionTopics.push({
            name: topic.name,
            type: 'main' as const
          });
        }
        
        // Add connection topics if we have any main topics
        if (sessionTopics.length > 0) {
          const mainTopic = sortedTopics[topicStartIndex < sortedTopics.length ? topicStartIndex : 0];
          const excludeTopics = sessionTopics.map(t => `${subjectData.subject}: ${t.name}`);
          const connections = findRelatedTopics(
            subjectData.subject,
            mainTopic.name,
            subjectsData,
            excludeTopics
          );
          
          sessionTopics.push({
            name: mainTopic.name,
            type: 'connection' as const,
            connectionTopics: connections
          });
        }
        
        // Add the main block to schedule
        blocks.push({
          subject: subjectData.subject,
          topics: sessionTopics,
          hours: slot.hours,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          passNumber: pass
        });
        
        remainingBlocks--;
        blockCount++;
      }
    }
    
    // Add a brief break between passes if we're not on the last pass
    if (pass < passCoverage) {
      currentDate.setDate(currentDate.getDate() + 1);
      // Reset daily hours at the start of a new pass
      // Note: This variable is declared inside the for loop for each subject
    }
  }

  // Sort the blocks by date and time to ensure chronological order
  return blocks.sort((a, b) => {
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) return dateComparison;
    return a.startTime.localeCompare(b.startTime);
  });
}

// Helper to add hours to a time string
function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const newHours = h + Math.floor(hours);
  const newMinutes = m + ((hours % 1) * 60);
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}