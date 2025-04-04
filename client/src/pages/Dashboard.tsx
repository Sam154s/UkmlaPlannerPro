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
import { differenceInDays, format } from "date-fns";
import {
  Clock,
  Calendar,
  TrendingUp,
  Star,
  Brain,
  Clock4,
  AlertCircle,
  BarChart3,
  AlarmClock,
}  from "lucide-react";

export default function Dashboard() {
  // State for exams
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  
  // Load exam dates from localStorage
  useEffect(() => {
    const savedExamDates = localStorage.getItem('exam-dates');
    if (savedExamDates) {
      try {
        setExamDates(JSON.parse(savedExamDates));
      } catch (error) {
        console.error('Failed to parse saved exam dates', error);
      }
    }
  }, []);
  
  // Get closest upcoming exam
  const closestExam = examDates
    .filter(exam => new Date(exam.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  
  // Calculate days until exam
  const daysUntil = closestExam ? differenceInDays(new Date(closestExam.date), new Date()) : null;
  
  // Placeholder data
  const studyProgress = {
    hoursStudied: 6,
    weeklyGoal: 10,
    percentage: 60,
  };

  const nextSessions = [
    { subject: "Cardiovascular", time: "Today, 2:00 PM", duration: "2 hours" },
    { subject: "Neurology", time: "Tomorrow, 10:00 AM", duration: "1.5 hours" },
    { subject: "Respiratory", time: "Tomorrow, 2:00 PM", duration: "2 hours" },
  ];

  const weeklyFocus = [
    { subject: "Acute and Emergency", hours: 4 },
    { subject: "Cancer", hours: 3 },
    { subject: "Cardiovascular", hours: 3 },
  ];

  const favoriteSubjects = [
    "Acute and Emergency",
    "Cardiovascular",
    "Neuroscience",
  ];

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
        {/* Progress Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Progress</CardTitle>
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
                {nextSessions.map((session, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="font-medium text-theme">{session.subject}</div>
                    <div className="text-muted-foreground">{session.time}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Weekly Focus */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Week's Focus</CardTitle>
            <TrendingUp className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[120px]">
              <div className="space-y-2">
                {weeklyFocus.map((focus, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="font-medium text-theme">{focus.subject}</div>
                    <div className="text-muted-foreground">{focus.hours} hours</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Star className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-theme">7 days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep up the great work!
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

        {/* AI Tip */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Tip</CardTitle>
            <Brain className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-theme">
              Focus on high-yield topics first. Consider reviewing Cardiovascular
              system today based on your progress.
            </p>
          </CardContent>
        </Card>

        {/* Favorite Subjects */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Favorite Subjects</CardTitle>
            <Star className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {favoriteSubjects.map((subject, i) => (
                <div
                  key={i}
                  className="text-sm font-medium flex items-center space-x-2"
                >
                  <div className="w-2 h-2 rounded-full bg-theme" />
                  <span className="text-theme">{subject}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Breakdown */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time Breakdown</CardTitle>
            <BarChart3 className="h-4 w-4 text-theme" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weeklyFocus.map((focus, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium text-theme">{focus.subject}</div>
                    <div className="text-muted-foreground">{focus.hours} hours</div>
                  </div>
                  <Progress
                    value={focus.hours * 10}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}