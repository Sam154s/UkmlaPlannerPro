import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface StudyConfigProps {
  weeklyHours: number;
  yearGroup: number;
  onWeeklyHoursChange: (hours: number) => void;
  onYearGroupChange: (group: number) => void;
}

export function StudyConfig({
  weeklyHours,
  yearGroup,
  onWeeklyHoursChange,
  onYearGroupChange,
}: StudyConfigProps) {
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
      </CardContent>
    </Card>
  );
}