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
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="weekly-hours">Weekly Study Hours</Label>
          <div className="flex items-center space-x-2">
            <Slider
              id="weekly-hours"
              min={1}
              max={40}
              step={1}
              value={[weeklyHours]}
              onValueChange={(value) => onWeeklyHoursChange(value[0])}
              className="flex-1"
            />
            <Input
              type="number"
              value={weeklyHours}
              onChange={(e) => onWeeklyHoursChange(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year-group">Year Group</Label>
          <div className="flex items-center space-x-2">
            <Slider
              id="year-group"
              min={1}
              max={5}
              step={1}
              value={[yearGroup]}
              onValueChange={(value) => onYearGroupChange(value[0])}
              className="flex-1"
            />
            <Input
              type="number"
              value={yearGroup}
              onChange={(e) => onYearGroupChange(Number(e.target.value))}
              className="w-20"
              min={1}
              max={5}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="days-per-week">Study Days Per Week</Label>
          <div className="flex items-center space-x-2">
            <Slider
              id="days-per-week"
              min={1}
              max={7}
              step={1}
              value={[daysPerWeek]}
              onValueChange={(value) => onDaysPerWeekChange(value[0])}
              className="flex-1"
            />
            <Input
              type="number"
              value={daysPerWeek}
              onChange={(e) => onDaysPerWeekChange(Number(e.target.value))}
              className="w-20"
              min={1}
              max={7}
            />
          </div>
        </div>
      </CardContent>
      
      {onGenerate && (
        <CardFooter className="pt-2 pb-6">
          <Button 
            onClick={onGenerate}
            disabled={!isGenerateEnabled}
            className="w-full bg-theme hover:bg-theme/90 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Timetable
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}