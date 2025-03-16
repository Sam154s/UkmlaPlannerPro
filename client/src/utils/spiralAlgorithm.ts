import { SubjectsData, SubjectCondition } from '../data/masterSubjects';

interface SpiralConfig {
  weeklyStudyHours: number;
  yearMultiplier: number;
  favouriteSubjects: string[];
  subjectsData: SubjectsData;
}

interface StudyBlock {
  subject: string;
  conditionName: string;
  hours: number;
  date: string;
  startTime: string;
  endTime: string;
}

const FAVORITE_SUBJECT_BONUS = 2;
const DAILY_START_TIME = "09:00";
const HOURS_PER_SESSION = 2;

export function generateSpiralTimetable(config: SpiralConfig): StudyBlock[] {
  const { weeklyStudyHours, yearMultiplier, favouriteSubjects, subjectsData } = config;
  const blocks: StudyBlock[] = [];
  const subjectScores = calculateSubjectScores();
  const dailyHours = weeklyStudyHours / 5; // Monday-Friday

  // Calculate total score and proportional hours
  function calculateSubjectScores() {
    const scores: { [key: string]: number } = {};
    let totalScore = 0;

    Object.entries(subjectsData).forEach(([subject, conditions]) => {
      const baseScore = conditions.reduce((acc, condition) => {
        return acc + (condition.difficulty + condition.clinicalImportance + condition.examRelevance);
      }, 0);

      const favoriteBonus = favouriteSubjects.includes(subject) ? FAVORITE_SUBJECT_BONUS : 0;
      const finalScore = (baseScore * yearMultiplier) + favoriteBonus;
      
      scores[subject] = finalScore;
      totalScore += finalScore;
    });

    // Convert scores to proportional hours
    Object.keys(scores).forEach(subject => {
      scores[subject] = (scores[subject] / totalScore) * weeklyStudyHours;
    });

    return scores;
  }

  // Generate study blocks for one week
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = new Date();
  const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));

  weekDays.forEach((day, dayIndex) => {
    let currentDate = new Date(monday);
    currentDate.setDate(currentDate.getDate() + dayIndex);
    
    let remainingHours = dailyHours;
    let currentTime = DAILY_START_TIME;

    while (remainingHours > 0) {
      const subjectsToStudy = Object.entries(subjectScores)
        .sort(([,a], [,b]) => b - a)
        .filter(([,hours]) => hours > 0);

      if (subjectsToStudy.length === 0) break;

      const [subject, hours] = subjectsToStudy[0];
      const sessionHours = Math.min(HOURS_PER_SESSION, remainingHours, hours);

      // Calculate time slots
      const startTime = currentTime;
      const endTime = addHours(startTime, sessionHours);

      blocks.push({
        subject,
        conditionName: subjectsData[subject][0].conditionName, // Simplified for now
        hours: sessionHours,
        date: currentDate.toISOString().split('T')[0],
        startTime,
        endTime
      });

      subjectScores[subject] -= sessionHours;
      remainingHours -= sessionHours;
      currentTime = endTime;
    }
  });

  return blocks;
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const newHours = h + Math.floor(hours);
  const newMinutes = m + ((hours % 1) * 60);
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}
