import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface StudyConfigProps {
  weeklyHours: number;
  yearMultiplier: number;
  onWeeklyHoursChange: (hours: number) => void;
  onYearMultiplierChange: (multiplier: number) => void;
}

export function StudyConfig({
  weeklyHours,
  yearMultiplier,
  onWeeklyHoursChange,
  onYearMultiplierChange,
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
          <Label htmlFor="year-multiplier">Year Multiplier</Label>
          <div className="flex items-center space-x-2">
            <Slider
              id="year-multiplier"
              min={0.5}
              max={2}
              step={0.1}
              value={[yearMultiplier]}
              onValueChange={(value) => onYearMultiplierChange(value[0])}
              className="flex-1"
            />
            <Input
              type="number"
              value={yearMultiplier}
              onChange={(e) => onYearMultiplierChange(Number(e.target.value))}
              className="w-20"
              step={0.1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
