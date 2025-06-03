import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExamDate, ExamCountdown } from "@/components/ui/exam-countdown";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { differenceInDays, format, startOfWeek, endOfWeek, isWithinInterval, parseISO, isToday, isTomorrow } from "date-fns";
import {
  Clock,
  Calendar,
  Star,
  Brain,
  AlarmClock,
}  from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  
  // State for various data
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [studyEvents, setStudyEvents] = useState<any[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [studyStreak, setStudyStreak] = useState({ current: 0, longest: 0 });
  const [aiTip, setAiTip] = useState<string>("");
  
  // Load data from localStorage
  useEffect(() => {
    // Load exam dates
    const savedExamDates = localStorage.getItem('exam-dates');
    if (savedExamDates) {
      try {
        setExamDates(JSON.parse(savedExamDates));
      } catch (error) {
        console.error('Failed to parse saved exam dates', error);
      }
    }
    
    // Load study events/timetable
    const savedStudyEvents = localStorage.getItem('study-events');
    if (savedStudyEvents) {
      try {
        setStudyEvents(JSON.parse(savedStudyEvents));
      } catch (error) {
        console.error('Failed to parse saved study events', error);
      }
    }
    
    // Load selected subjects
    const savedSubjects = localStorage.getItem('selected-subjects');
    if (savedSubjects) {
      try {
        setSelectedSubjects(JSON.parse(savedSubjects));
      } catch (error) {
        console.error('Failed to parse saved subjects', error);
      }
    }
    
    // Load study streak
    const savedStreak = localStorage.getItem('study-streak');
    if (savedStreak) {
      try {
        setStudyStreak(JSON.parse(savedStreak));
      } catch (error) {
        console.error('Failed to parse saved streak', error);
      }
    }
  }, []);
  
  // Generate AI study tip
  const generateAITip = () => {
    const tips = [
      "Break study sessions into 25-minute focused intervals with 5-minute breaks for optimal retention.",
      "Review yesterday's material for 10 minutes before starting new topics to strengthen memory.",
      "Focus on understanding concepts rather than memorizing facts for long-term retention.",
      "Use active recall by testing yourself without looking at notes to identify knowledge gaps.",
      "Study the most challenging subjects when your energy levels are highest.",
      "Connect new information to what you already know to create stronger memory associations.",
      "Practice spaced repetition by reviewing material at increasing intervals.",
      "Teach concepts to someone else or explain them aloud to deepen understanding.",
      "Take regular breaks and stay hydrated to maintain concentration throughout study sessions.",
      "Set specific, measurable goals for each study session to maintain focus and motivation."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setAiTip(randomTip);
  };
  
  // Generate tip on component mount
  useEffect(() => {
    generateAITip();
  }, []);
  
  // Get closest upcoming exam
  const closestExam = examDates
    .filter(exam => new Date(exam.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  
  // Calculate days until exam
  const daysUntil = closestExam ? differenceInDays(new Date(closestExam.date), new Date()) : null;
  
  // Calculate hours studied this week from completed study sessions
  const calculateWeeklyHours = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    // Get completed sessions from localStorage
    const completedSessions = JSON.parse(localStorage.getItem('completed-sessions') || '[]');
    
    const weeklyHours = completedSessions
      .filter((session: any) => {
        const sessionDate = parseISO(session.date);
        return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
      })
      .reduce((total: number, session: any) => total + (session.duration || 0), 0);
    
    return weeklyHours;
  };

  // Get next sessions for today and tomorrow from timetable
  const getNextSessions = () => {
    const todayEvents = studyEvents.filter(event => {
      const eventDate = parseISO(event.start);
      return isToday(eventDate);
    });
    
    const tomorrowEvents = studyEvents.filter(event => {
      const eventDate = parseISO(event.start);
      return isTomorrow(eventDate);
    });
    
    const sessions: any[] = [];
    
    // Add today's sessions
    todayEvents.forEach(event => {
      const eventDate = parseISO(event.start);
      const endDate = parseISO(event.end);
      const duration = Math.round((endDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 100)) / 10; // hours
      
      sessions.push({
        subject: event.title,
        time: `Today, ${format(eventDate, 'h:mm a')}`,
        duration: `${duration} hours`,
        topics: event.extendedProps?.topics || []
      });
    });
    
    // Add tomorrow's sessions
    tomorrowEvents.forEach(event => {
      const eventDate = parseISO(event.start);
      const endDate = parseISO(event.end);
      const duration = Math.round((endDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 100)) / 10; // hours
      
      sessions.push({
        subject: event.title,
        time: `Tomorrow, ${format(eventDate, 'h:mm a')}`,
        duration: `${duration} hours`,
        topics: event.extendedProps?.topics || []
      });
    });
    
    return sessions.slice(0, 3); // Limit to 3 sessions
  };

  const hoursStudied = calculateWeeklyHours();
  const weeklyGoal = parseInt(localStorage.getItem('weekly-hours') || '10');
  const studyProgress = {
    hoursStudied,
    weeklyGoal,
    percentage: weeklyGoal > 0 ? Math.min((hoursStudied / weeklyGoal) * 100, 100) : 0,
  };

  const nextSessions = getNextSessions();
  const favoriteSubjects = selectedSubjects;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient-theme">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your revision progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hours Per Week Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
            <Clock className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-theme">
              {studyProgress.hoursStudied} / {studyProgress.weeklyGoal} hours
            </div>
            <Progress
              value={studyProgress.percentage}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {studyProgress.hoursStudied === 0 ? "No sessions completed yet" : "From completed study sessions"}
            </p>
          </CardContent>
        </Card>

        {/* Next Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[120px]">
              <div className="space-y-2">
                {nextSessions.length > 0 ? (
                  nextSessions.map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="font-medium text-theme">{session.subject}</div>
                      <div className="text-muted-foreground">{session.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nothing scheduled
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Study Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Star className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-theme">
              {studyStreak.current} {studyStreak.current === 1 ? 'day' : 'days'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Longest streak: {studyStreak.longest} {studyStreak.longest === 1 ? 'day' : 'days'}
            </p>
          </CardContent>
        </Card>

        {/* Exam Countdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exam Countdown</CardTitle>
            <AlarmClock className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            {closestExam ? (
              <>
                <div className="flex items-center gap-2">
                  {daysUntil !== null && (
                    <>
                      <div 
                        className={`p-2 rounded-full ${
                          daysUntil <= 7 ? 'bg-red-50 text-red-700' :
                          daysUntil <= 14 ? 'bg-orange-50 text-orange-700' :
                          'bg-blue-50 text-blue-700'
                        } w-14 h-14 flex flex-col items-center justify-center`}
                      >
                        <span className="text-xl font-bold">{daysUntil}</span>
                        <span className="text-[10px]">days</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-theme">{closestExam.name}</div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(closestExam.date), 'MMMM do, yyyy')}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {closestExam.subjects.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {closestExam.subjects.slice(0, 2).map(subject => (
                        <Badge key={subject} variant="outline" className="text-xs bg-slate-50 border-slate-200">
                          {subject}
                        </Badge>
                      ))}
                      {closestExam.subjects.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{closestExam.subjects.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                No upcoming exams scheduled
              </div>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                  <span className="text-xs">Set exam date</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Exam Countdown</DialogTitle>
                  <DialogDescription>
                    Track the time remaining until your important exams
                  </DialogDescription>
                </DialogHeader>
                
                <ExamCountdown
                  examDates={examDates}
                  onUpdateExamDates={(updatedExamDates) => {
                    setExamDates(updatedExamDates);
                    localStorage.setItem('exam-dates', JSON.stringify(updatedExamDates));
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Favorite Subjects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Favorite Subjects</CardTitle>
            <Star className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {favoriteSubjects.length > 0 ? (
                favoriteSubjects.map((subject, i) => (
                  <div
                    key={i}
                    className="text-sm font-medium flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-theme" />
                    <span className="text-theme">{subject}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No subjects selected
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Study Tip */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Tip</CardTitle>
            <Brain className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-theme">
              {aiTip || "Focus on high-yield topics and use active recall techniques for better retention."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}