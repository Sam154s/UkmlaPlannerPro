import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ExamDate } from '@/data/masterSubjects';
import { addDays, format, isAfter, isBefore, subWeeks } from 'date-fns';

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
        <CardTitle>Exam Mode Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Label htmlFor="exam-mode">Exam Mode</Label>
          <Switch
            id="exam-mode"
            checked={isExamMode}
            onCheckedChange={onExamModeToggle}
          />
          {isInExamPeriod && !isExamMode && (
            <span className="text-sm text-orange-500">
              You're in an exam period! Consider enabling exam mode.
            </span>
          )}
        </div>

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
