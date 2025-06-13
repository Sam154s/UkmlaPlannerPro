import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronUp, ChevronDown } from "lucide-react";

interface StudyConfigProps {
  hoursPerWeek: number;
  yearGroup: number;
  studyDays: number[];
  onHoursPerWeekChange: (hours: number) => void;
  onYearGroupChange: (group: number) => void;
  onStudyDaysChange: (days: number[]) => void;
  onGenerate?: () => void;
}

// Custom NumberInput component with visible arrows
function NumberInput({ 
  value, 
  onChange, 
  min = 1, 
  max = 100, 
  className = "" 
}: { 
  value: number; 
  onChange: (value: number) => void; 
  min?: number; 
  max?: number; 
  className?: string;
}) {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="number-input-container">
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          if (newValue >= min && newValue <= max) {
            onChange(newValue);
          }
        }}
        min={min}
        max={max}
        className={`number-input text-center pr-8 ${className}`}
      />
      <div className="number-input-arrows">
        <button
          type="button"
          className="number-input-arrow up"
          onClick={increment}
          disabled={value >= max}
        >
          <ChevronUp size={12} />
        </button>
        <button
          type="button"
          className="number-input-arrow down"
          onClick={decrement}
          disabled={value <= min}
        >
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}

export function StudyConfig({
  hoursPerWeek,
  yearGroup,
  studyDays,
  onHoursPerWeekChange,
  onYearGroupChange,
  onStudyDaysChange,
  onGenerate,
}: StudyConfigProps) {
  
  const weekdays = [
    { name: 'Sun', value: 0 },
    { name: 'Mon', value: 1 },
    { name: 'Tue', value: 2 },
    { name: 'Wed', value: 3 },
    { name: 'Thu', value: 4 },
    { name: 'Fri', value: 5 },
    { name: 'Sat', value: 6 }
  ];

  const toggleStudyDay = (dayValue: number) => {
    if (studyDays.includes(dayValue)) {
      // Remove day (but ensure at least one day remains)
      if (studyDays.length > 1) {
        onStudyDaysChange(studyDays.filter(d => d !== dayValue));
      }
    } else {
      // Add day
      onStudyDaysChange([...studyDays, dayValue].sort());
    }
  };

  const dailyHours = studyDays.length > 0 ? (hoursPerWeek / studyDays.length).toFixed(1) : '0';
  
  return (
    <Card className="shadow-sm bg-white rounded-lg">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="hours-per-week" className="font-medium text-slate-800">Hours Per Week</Label>
            <span className="text-sm font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{hoursPerWeek} hrs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Slider
              id="hours-per-week"
              min={1}
              max={40}
              step={1}
              value={[hoursPerWeek]}
              onValueChange={(value) => onHoursPerWeekChange(value[0])}
              className="flex-1 slider-enhanced"
              style={{
                "--track-background": "#e2e8f0",
                "--range-background": "#3b82f6", 
                "--thumb-background": "#ffffff",
                "--thumb-border": "4px solid #3b82f6",
                "--thumb-width": "2.25rem",
                "--thumb-height": "2.25rem",
                "--thumb-shadow": "0 4px 12px rgba(0, 0, 0, 0.2)"
              } as React.CSSProperties}
            />
            <NumberInput
              value={hoursPerWeek}
              onChange={onHoursPerWeekChange}
              min={1}
              max={40}
              className="w-20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="font-medium text-slate-800">Study Days</Label>
            <span className="text-sm font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              {dailyHours}h/day
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekdays.map((day) => (
              <Button
                key={day.value}
                variant={studyDays.includes(day.value) ? "default" : "outline"}
                size="sm"
                className={`h-10 text-xs font-medium transition-all ${
                  studyDays.includes(day.value)
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    : "bg-white hover:bg-blue-50 text-slate-600 border-slate-200"
                }`}
                onClick={() => toggleStudyDay(day.value)}
              >
                {day.name}
              </Button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Select your preferred study days. Daily hours = {hoursPerWeek} ÷ {studyDays.length} days
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="year-group" className="font-medium text-slate-800">Year Group</Label>
            <span className="text-sm font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">Year {yearGroup}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Slider
              id="year-group"
              min={1}
              max={5}
              step={1}
              value={[yearGroup]}
              onValueChange={(value) => onYearGroupChange(value[0])}
              className="flex-1 slider-enhanced"
              style={{
                "--track-background": "#e2e8f0",
                "--range-background": "#8b5cf6", 
                "--thumb-background": "#ffffff",
                "--thumb-border": "4px solid #8b5cf6",
                "--thumb-width": "2.25rem",
                "--thumb-height": "2.25rem",
                "--thumb-shadow": "0 4px 12px rgba(0, 0, 0, 0.2)"
              } as React.CSSProperties}
            />
            <NumberInput
              value={yearGroup}
              onChange={onYearGroupChange}
              min={1}
              max={5}
              className="w-20"
            />
          </div>
        </div>
      </CardContent>
      {onGenerate && (
        <CardFooter>
          <Button 
            onClick={onGenerate} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 shadow-sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Timetable
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}