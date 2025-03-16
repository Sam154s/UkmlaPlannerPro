import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  Calendar,
  TrendingUp,
  Star,
  Brain,
  Clock4,
  AlertCircle,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
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
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
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
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[120px]">
              <div className="space-y-2">
                {nextSessions.map((session, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="font-medium">{session.subject}</div>
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
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[120px]">
              <div className="space-y-2">
                {weeklyFocus.map((focus, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="font-medium">{focus.subject}</div>
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
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep up the great work!
            </p>
          </CardContent>
        </Card>

        {/* Exam Countdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exam Countdown</CardTitle>
            <Clock4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Until UKMLA exam
            </p>
          </CardContent>
        </Card>

        {/* AI Tip */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Tip</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Focus on high-yield topics first. Consider reviewing Cardiovascular
              system today based on your progress.
            </p>
          </CardContent>
        </Card>

        {/* Favorite Subjects */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Favorite Subjects</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {favoriteSubjects.map((subject, i) => (
                <div
                  key={i}
                  className="text-sm font-medium flex items-center space-x-2"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>{subject}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Breakdown */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time Breakdown</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weeklyFocus.map((focus, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{focus.subject}</div>
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
