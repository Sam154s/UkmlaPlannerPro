import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ExamDate } from '@/data/masterSubjects';
import { addDays, format, isAfter, isBefore, subWeeks } from 'date-fns';
import { AlertCircle } from 'lucide-react';

interface ExamSettingsProps {
  examDates: ExamDate[];
  onExamDateAdd: (examDate: ExamDate) => void;
  onExamDateRemove: (id: string) => void;
  isExamMode: boolean;
  onExamModeToggle: (enabled: boolean) => void;
}

export function ExamSettings({
  examDates,
  onExamDateAdd,
  onExamDateRemove,
  isExamMode,
  onExamModeToggle
}: ExamSettingsProps) {
  const [newExamDate, setNewExamDate] = useState<Date>();
  const [examName, setExamName] = useState('');

  const isInExamPeriod = examDates.some(exam => {
    const examDate = new Date(exam.date);
    const examPeriodStart = subWeeks(examDate, 4);
    return isAfter(new Date(), examPeriodStart) && isBefore(new Date(), addDays(examDate, 1));
  });

  // Find the next upcoming exam
  const nextExam = examDates
    .map(exam => ({ ...exam, date: new Date(exam.date) }))
    .filter(exam => isAfter(exam.date, new Date()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  const handleAddExam = () => {
    if (!newExamDate || !examName) return;

    const newExam: ExamDate = {
      id: crypto.randomUUID(),
      date: format(newExamDate, 'yyyy-MM-dd'),
      name: examName,
      subjects: []
    };

    onExamDateAdd(newExam);
    setNewExamDate(undefined);
    setExamName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Exam Mode Settings</span>
          <div className="flex items-center space-x-2">
            <Switch
              id="exam-mode"
              checked={isExamMode}
              onCheckedChange={onExamModeToggle}
              className="data-[state=checked]:bg-red-500"
            />
            <Label htmlFor="exam-mode" className="font-normal text-base">
              Exam Mode
            </Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isInExamPeriod && !isExamMode && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">
              You're in an exam period! Consider enabling exam mode.
            </span>
          </div>
        )}

        {nextExam && (
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Time until next exam</p>
            <p className="text-2xl font-semibold mt-1">
              {format(nextExam.date, 'PPP')}
            </p>
            <p className="text-sm mt-1">{nextExam.name}</p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Exam</h3>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="exam-name">Exam Name</Label>
              <Input
                id="exam-name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Enter exam name"
              />
            </div>
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={newExamDate}
                onSelect={setNewExamDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            <Button
              onClick={handleAddExam}
              disabled={!newExamDate || !examName}
            >
              Add Exam
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Upcoming Exams</h3>
          <div className="space-y-2">
            {examDates.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{exam.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(exam.date), 'PPP')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExamDateRemove(exam.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}