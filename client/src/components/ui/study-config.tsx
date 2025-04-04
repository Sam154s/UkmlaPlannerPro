import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StudyConfigProps {
  weeklyHours: number;
  yearGroup: number;
  daysPerWeek: number;
  onWeeklyHoursChange: (hours: number) => void;
  onYearGroupChange: (group: number) => void;
  onDaysPerWeekChange: (days: number) => void;
  onGenerate?: () => void;
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
  // Calculate if generate button should be enabled
  const isGenerateEnabled = weeklyHours > 0 && yearGroup > 0 && daysPerWeek > 0;
  
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
            <Input
              type="number"
              value={weeklyHours}
              onChange={(e) => onWeeklyHoursChange(Number(e.target.value))}
              className="w-20 font-medium border-slate-300"
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
            <Input
              type="number"
              value={yearGroup}
              onChange={(e) => onYearGroupChange(Number(e.target.value))}
              className="w-20 font-medium border-slate-300"
              min={1}
              max={5}
            />
          </div>
          <div className="grid grid-cols-5 gap-0.5 text-xs text-slate-500 text-center mt-1">
            <div className={`p-1 rounded ${yearGroup === 1 ? 'bg-green-100 text-green-800 font-medium' : ''}`}>Y1</div>
            <div className={`p-1 rounded ${yearGroup === 2 ? 'bg-green-100 text-green-800 font-medium' : ''}`}>Y2</div>
            <div className={`p-1 rounded ${yearGroup === 3 ? 'bg-green-100 text-green-800 font-medium' : ''}`}>Y3</div>
            <div className={`p-1 rounded ${yearGroup === 4 ? 'bg-green-100 text-green-800 font-medium' : ''}`}>Y4</div>
            <div className={`p-1 rounded ${yearGroup === 5 ? 'bg-green-100 text-green-800 font-medium' : ''}`}>Y5</div>
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
            <Input
              type="number"
              value={daysPerWeek}
              onChange={(e) => onDaysPerWeekChange(Number(e.target.value))}
              className="w-20 font-medium border-slate-300"
              min={1}
              max={7}
            />
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-xs text-slate-500 text-center mt-1">
            <div className={`p-1 rounded ${daysPerWeek >= 1 ? 'bg-purple-100 text-purple-800 font-medium' : ''}`}>M</div>
            <div className={`p-1 rounded ${daysPerWeek >= 2 ? 'bg-purple-100 text-purple-800 font-medium' : ''}`}>T</div>
            <div className={`p-1 rounded ${daysPerWeek >= 3 ? 'bg-purple-100 text-purple-800 font-medium' : ''}`}>W</div>
            <div className={`p-1 rounded ${daysPerWeek >= 4 ? 'bg-purple-100 text-purple-800 font-medium' : ''}`}>T</div>
            <div className={`p-1 rounded ${daysPerWeek >= 5 ? 'bg-purple-100 text-purple-800 font-medium' : ''}`}>F</div>
            <div className={`p-1 rounded ${daysPerWeek >= 6 ? 'bg-purple-100 text-purple-800 font-medium' : ''}`}>S</div>
            <div className={`p-1 rounded ${daysPerWeek >= 7 ? 'bg-purple-100 text-purple-800 font-medium' : ''}`}>S</div>
          </div>
        </div>
      </CardContent>
      
      {onGenerate && (
        <CardFooter className="pt-2 pb-6">
          <Button 
            onClick={onGenerate}
            disabled={!isGenerateEnabled}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Timetable
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}