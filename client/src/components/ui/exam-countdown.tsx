import { useState, useEffect } from 'react';
import { CalendarIcon, PlusCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addDays, differenceInDays, format, isBefore } from 'date-fns';
import { Subject } from '@/data/masterSubjects';

export interface ExamDate {
  id: string;
  date: string;
  name: string;
  subjects: string[];
}

interface ExamCountdownProps {
  examDates: ExamDate[];
  onUpdateExamDates: (dates: ExamDate[]) => void;
}

export function ExamCountdown({ examDates, onUpdateExamDates }: ExamCountdownProps) {
  const [newExamName, setNewExamName] = useState("");
  const [newExamDate, setNewExamDate] = useState<Date | undefined>(undefined);
  const [newExamSubjects, setNewExamSubjects] = useState<string[]>([]);
  const [masterSubjectsList, setMasterSubjectsList] = useState<Subject[]>([]);

  // Fetch master subjects list
  useEffect(() => {
    import('@/data/masterSubjects').then(module => {
      setMasterSubjectsList(module.default);
    });
  }, []);

  // Get closest exam
  const getClosestExam = () => {
    const today = new Date();
    
    return examDates
      .filter(exam => isBefore(today, new Date(exam.date)))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })[0];
  };

  const closestExam = getClosestExam();
  
  // Calculate days until exam
  const calculateDaysUntil = (examDate: string) => {
    const today = new Date();
    const targetDate = new Date(examDate);
    return differenceInDays(targetDate, today);
  };

  const addExam = () => {
    if (!newExamName || !newExamDate) return;
    
    const newExam: ExamDate = {
      id: Date.now().toString(),
      date: format(newExamDate, 'yyyy-MM-dd'),
      name: newExamName,
      subjects: newExamSubjects
    };
    
    onUpdateExamDates([...examDates, newExam]);
    
    // Reset form
    setNewExamName("");
    setNewExamDate(undefined);
    setNewExamSubjects([]);
  };
  
  const removeExam = (id: string) => {
    onUpdateExamDates(examDates.filter(exam => exam.id !== id));
  };

  return (
    <div className="space-y-6">
      {closestExam && (
        <div className="bg-white rounded-lg border p-4 text-center">
          <h3 className="text-lg font-medium text-slate-700">Next Exam</h3>
          <div className="mt-2 mb-3">
            <Badge variant="secondary" className="text-xl font-bold px-3 py-1.5">
              {calculateDaysUntil(closestExam.date)} days
            </Badge>
          </div>
          <h4 className="text-md font-semibold">{closestExam.name}</h4>
          <p className="text-sm text-slate-500">{format(new Date(closestExam.date), 'PPP')}</p>
          
          {closestExam.subjects.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1">Subjects:</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {closestExam.subjects.map(subject => (
                  <Badge key={subject} variant="outline" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-4">All Exams</h3>
        <div className="space-y-3">
          {examDates.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No exams scheduled</p>
          ) : (
            examDates.map(exam => (
              <Card key={exam.id} className="border border-slate-200">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex justify-between items-center">
                    <span>{exam.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0" 
                      onClick={() => removeExam(exam.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 text-sm">
                  <div className="flex items-center text-slate-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{format(new Date(exam.date), 'PPPP')}</span>
                  </div>
                  <div className="text-right">
                    <Badge>{calculateDaysUntil(exam.date)} days left</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Add New Exam</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="exam-name">Exam Name</Label>
            <Input
              id="exam-name"
              value={newExamName}
              onChange={(e) => setNewExamName(e.target.value)}
              placeholder="Enter exam name"
            />
          </div>
          
          <div>
            <Label htmlFor="exam-date" className="mb-1 block">Exam Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newExamDate ? (
                    format(newExamDate, 'PPP')
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newExamDate}
                  onSelect={setNewExamDate}
                  initialFocus
                  disabled={(date) => {
                    return isBefore(date, addDays(new Date(), -1));
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="exam-subjects" className="mb-1 block">Subjects (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newExamSubjects.map(subject => (
                <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                  {subject}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 rounded-full"
                    onClick={() => setNewExamSubjects(prev => prev.filter(s => s !== subject))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="relative">
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value=""
                onChange={(e) => {
                  if (e.target.value && !newExamSubjects.includes(e.target.value)) {
                    setNewExamSubjects([...newExamSubjects, e.target.value]);
                  }
                  e.target.value = ""; // Reset select after adding
                }}
              >
                <option value="">Select subject...</option>
                {masterSubjectsList.map(subject => (
                  <option 
                    key={subject.name} 
                    value={subject.name}
                    disabled={newExamSubjects.includes(subject.name)}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <Button 
            onClick={addExam}
            disabled={!newExamName || !newExamDate}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Exam
          </Button>
        </div>
      </div>
    </div>
  );
}