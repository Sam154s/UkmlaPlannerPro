import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronUp, ChevronDown } from "lucide-react";

interface StudyConfigProps {
  weeklyHours: number;
  yearGroup: number;
  daysPerWeek: number;
  onWeeklyHoursChange: (hours: number) => void;
  onYearGroupChange: (group: number) => void;
  onDaysPerWeekChange: (days: number) => void;
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
        className={`font-medium border-slate-300 ${className}`}
        min={min}
        max={max}
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
  weeklyHours,
  yearGroup,
  daysPerWeek,
  onWeeklyHoursChange,
  onYearGroupChange,
  onDaysPerWeekChange,
  onGenerate,
}: StudyConfigProps) {
  
  return (
    <Card className="shadow-sm bg-white rounded-lg">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="weekly-hours" className="font-medium text-slate-800">Weekly Study Hours</Label>
            <span className="text-sm font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{weeklyHours} hrs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Slider
              id="weekly-hours"
              min={1}
              max={40}
              step={1}
              value={[weeklyHours]}
              onValueChange={(value) => onWeeklyHoursChange(value[0])}
              className="flex-1"
              // Custom darker styling for the slider
              style={{
                "--track-background": "#e2e8f0",
                "--range-background": "#3b82f6", 
                "--thumb-background": "#3b82f6",
                "--thumb-border": "2px solid white",
                "--thumb-width": "1.25rem",
                "--thumb-height": "1.25rem"
              } as React.CSSProperties}
            />
            <NumberInput
              value={weeklyHours}
              onChange={onWeeklyHoursChange}
              min={1}
              max={40}
              className="w-20"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Min: 1</span>
            <span>Max: 40</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="year-group" className="font-medium text-slate-800">Year Group</Label>
            <span className="text-sm font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Year {yearGroup}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Slider
              id="year-group"
              min={1}
              max={5}
              step={1}
              value={[yearGroup]}
              onValueChange={(value) => onYearGroupChange(value[0])}
              className="flex-1"
              // Custom darker styling for the slider
              style={{
                "--track-background": "#e2e8f0",
                "--range-background": "#10b981", 
                "--thumb-background": "#10b981",
                "--thumb-border": "2px solid white",
                "--thumb-width": "1.25rem",
                "--thumb-height": "1.25rem"
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
          <div className="grid grid-cols-5 gap-0.5 text-xs text-slate-500 text-center mt-1">
            <button 
              onClick={() => onYearGroupChange(1)}
              className={`p-1 rounded cursor-pointer hover:bg-green-50 transition-colors ${yearGroup === 1 ? 'bg-green-100 text-green-800 font-medium' : 'hover:text-green-700'}`}
            >
              Y1
            </button>
            <button 
              onClick={() => onYearGroupChange(2)}
              className={`p-1 rounded cursor-pointer hover:bg-green-50 transition-colors ${yearGroup === 2 ? 'bg-green-100 text-green-800 font-medium' : 'hover:text-green-700'}`}
            >
              Y2
            </button>
            <button 
              onClick={() => onYearGroupChange(3)}
              className={`p-1 rounded cursor-pointer hover:bg-green-50 transition-colors ${yearGroup === 3 ? 'bg-green-100 text-green-800 font-medium' : 'hover:text-green-700'}`}
            >
              Y3
            </button>
            <button 
              onClick={() => onYearGroupChange(4)}
              className={`p-1 rounded cursor-pointer hover:bg-green-50 transition-colors ${yearGroup === 4 ? 'bg-green-100 text-green-800 font-medium' : 'hover:text-green-700'}`}
            >
              Y4
            </button>
            <button 
              onClick={() => onYearGroupChange(5)}
              className={`p-1 rounded cursor-pointer hover:bg-green-50 transition-colors ${yearGroup === 5 ? 'bg-green-100 text-green-800 font-medium' : 'hover:text-green-700'}`}
            >
              Y5
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="days-per-week" className="font-medium text-slate-800">Study Days Per Week</Label>
            <span className="text-sm font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{daysPerWeek} days</span>
          </div>
          <div className="flex items-center space-x-2">
            <Slider
              id="days-per-week"
              min={1}
              max={7}
              step={1}
              value={[daysPerWeek]}
              onValueChange={(value) => onDaysPerWeekChange(value[0])}
              className="flex-1"
              // Custom darker styling for the slider
              style={{
                "--track-background": "#e2e8f0",
                "--range-background": "#8b5cf6", 
                "--thumb-background": "#8b5cf6",
                "--thumb-border": "2px solid white",
                "--thumb-width": "1.25rem",
                "--thumb-height": "1.25rem"
              } as React.CSSProperties}
            />
            <NumberInput
              value={daysPerWeek}
              onChange={onDaysPerWeekChange}
              min={1}
              max={7}
              className="w-20"
            />
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-xs text-slate-500 text-center mt-1">
            <button 
              onClick={() => onDaysPerWeekChange(1)}
              className={`p-1 rounded cursor-pointer hover:bg-purple-50 transition-colors ${daysPerWeek >= 1 ? 'bg-purple-100 text-purple-800 font-medium' : 'hover:text-purple-700'}`}
            >
              M
            </button>
            <button 
              onClick={() => onDaysPerWeekChange(2)}
              className={`p-1 rounded cursor-pointer hover:bg-purple-50 transition-colors ${daysPerWeek >= 2 ? 'bg-purple-100 text-purple-800 font-medium' : 'hover:text-purple-700'}`}
            >
              T
            </button>
            <button 
              onClick={() => onDaysPerWeekChange(3)}
              className={`p-1 rounded cursor-pointer hover:bg-purple-50 transition-colors ${daysPerWeek >= 3 ? 'bg-purple-100 text-purple-800 font-medium' : 'hover:text-purple-700'}`}
            >
              W
            </button>
            <button 
              onClick={() => onDaysPerWeekChange(4)}
              className={`p-1 rounded cursor-pointer hover:bg-purple-50 transition-colors ${daysPerWeek >= 4 ? 'bg-purple-100 text-purple-800 font-medium' : 'hover:text-purple-700'}`}
            >
              T
            </button>
            <button 
              onClick={() => onDaysPerWeekChange(5)}
              className={`p-1 rounded cursor-pointer hover:bg-purple-50 transition-colors ${daysPerWeek >= 5 ? 'bg-purple-100 text-purple-800 font-medium' : 'hover:text-purple-700'}`}
            >
              F
            </button>
            <button 
              onClick={() => onDaysPerWeekChange(6)}
              className={`p-1 rounded cursor-pointer hover:bg-purple-50 transition-colors ${daysPerWeek >= 6 ? 'bg-purple-100 text-purple-800 font-medium' : 'hover:text-purple-700'}`}
            >
              S
            </button>
            <button 
              onClick={() => onDaysPerWeekChange(7)}
              className={`p-1 rounded cursor-pointer hover:bg-purple-50 transition-colors ${daysPerWeek >= 7 ? 'bg-purple-100 text-purple-800 font-medium' : 'hover:text-purple-700'}`}
            >
              S
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}