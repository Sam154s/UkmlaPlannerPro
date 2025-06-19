import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: StudySettings) => void;
  currentSettings: StudySettings;
}

export interface StudySettings {
  hoursPerWeek: number;
  studyDays: number[];
  startDate: string;
  yearGroup: number;
  favouriteSubjects: string[];
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SettingsDialog({ 
  isOpen, 
  onClose, 
  onSettingsChange, 
  currentSettings 
}: SettingsDialogProps) {
  const [settings, setSettings] = useState<StudySettings>(currentSettings);

  const handleSave = () => {
    onSettingsChange(settings);
    onClose();
  };

  const updateStudyDays = (value: string[]) => {
    const numericDays = value.map(Number);
    setSettings(prev => ({ ...prev, studyDays: numericDays }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Study Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Hours per week</Label>
            <div className="px-3">
              <Slider
                value={[settings.hoursPerWeek]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, hoursPerWeek: value }))}
                max={50}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>5h</span>
                <span>{settings.hoursPerWeek}h</span>
                <span>50h</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Study days</Label>
            <ToggleGroup 
              type="multiple" 
              value={settings.studyDays.map(String)}
              onValueChange={updateStudyDays}
              className="grid grid-cols-7 gap-1"
            >
              {dayLabels.map((day, index) => (
                <ToggleGroupItem key={index} value={String(index)} size="sm">
                  {day}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input
              id="startDate"
              type="date"
              value={settings.startDate}
              onChange={(e) => setSettings(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Year group</Label>
            <ToggleGroup 
              type="single" 
              value={String(settings.yearGroup)}
              onValueChange={(value) => value && setSettings(prev => ({ ...prev, yearGroup: Number(value) }))}
              className="grid grid-cols-3 gap-2"
            >
              <ToggleGroupItem value="4">Year 4</ToggleGroupItem>
              <ToggleGroupItem value="5">Year 5</ToggleGroupItem>
              <ToggleGroupItem value="6">Year 6</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}