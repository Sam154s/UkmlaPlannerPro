import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { TimePicker } from "@/components/ui/time-picker";
import { useState } from "react";

interface TimeRange {
  start: string;
  end: string;
}

export interface BreakPreferences {
  enabled: boolean;
  shortBreakLength: number; // in minutes
  longBreakLength: number; // in minutes
  blocksBetweenLongBreaks: number;
}

interface MealPreferences {
  enabled: boolean;
  breakfast: TimeRange;
  lunch: TimeRange;
  dinner: TimeRange;
  breakfastDuration: number; // in minutes
  lunchDuration: number; // in minutes
  dinnerDuration: number; // in minutes
}

interface SleepPreferences {
  enabled: boolean;
  bedtime: string;
  wakeup: string;
}

interface PlacementPreferences {
  enabled: boolean;
  monday: TimeRange;
  tuesday: TimeRange;
  wednesday: TimeRange;
  thursday: TimeRange;
  friday: TimeRange;
  saturday: TimeRange;
  sunday: TimeRange;
  [key: string]: boolean | TimeRange; // Index signature to allow dynamic access
}

interface NotificationPreferences {
  enabled: boolean;
  minutesBefore: number;
}

export interface UserPreferences {
  breaks: BreakPreferences;
  meals: MealPreferences;
  sleep: SleepPreferences;
  placement: PlacementPreferences;
  notifications: NotificationPreferences;
}

interface BreakSettingsProps {
  preferences: UserPreferences;
  onChange: (preferences: UserPreferences) => void;
}

// Default values
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  breaks: {
    enabled: true,
    shortBreakLength: 5,
    longBreakLength: 30,
    blocksBetweenLongBreaks: 2
  },
  meals: {
    enabled: true,
    breakfast: { start: "07:00", end: "07:30" },
    lunch: { start: "12:00", end: "13:00" },
    dinner: { start: "18:00", end: "19:00" },
    breakfastDuration: 30,
    lunchDuration: 60,
    dinnerDuration: 60
  },
  sleep: {
    enabled: true,
    bedtime: "23:00",
    wakeup: "07:00"
  },
  placement: {
    enabled: false,
    monday: { start: "08:00", end: "12:00" },
    tuesday: { start: "08:00", end: "12:00" },
    wednesday: { start: "08:00", end: "12:00" },
    thursday: { start: "08:00", end: "12:00" },
    friday: { start: "08:00", end: "12:00" },
    saturday: { start: "", end: "" },
    sunday: { start: "", end: "" }
  },
  notifications: {
    enabled: true,
    minutesBefore: 15
  }
};

export function BreakSettings({ preferences, onChange }: BreakSettingsProps) {
  // Helper to update a specific section of preferences
  const updatePreferences = <T extends keyof UserPreferences>(
    section: T,
    value: UserPreferences[T]
  ) => {
    onChange({
      ...preferences,
      [section]: value
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="breaks">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="breaks">Breaks</TabsTrigger>
          <TabsTrigger value="meals">Meals</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="placement">Placement</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
        </TabsList>
        
        {/* Breaks Settings */}
        <TabsContent value="breaks" className="mt-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Break Preferences</span>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="breaks-enabled" className="text-sm font-normal">
                    Enable breaks
                  </Label>
                  <Switch 
                    id="breaks-enabled" 
                    checked={preferences.breaks.enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences('breaks', { ...preferences.breaks, enabled: checked })
                    }
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="short-break-length">
                  Short break duration: {preferences.breaks.shortBreakLength} minutes
                </Label>
                <Slider 
                  id="short-break-length" 
                  min={5} 
                  max={15} 
                  step={1} 
                  value={[preferences.breaks.shortBreakLength]}
                  onValueChange={([value]) => 
                    updatePreferences('breaks', { ...preferences.breaks, shortBreakLength: value })
                  }
                  disabled={!preferences.breaks.enabled}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="long-break-length">
                  Long break duration: {preferences.breaks.longBreakLength} minutes
                </Label>
                <Slider 
                  id="long-break-length" 
                  min={15} 
                  max={60} 
                  step={5} 
                  value={[preferences.breaks.longBreakLength]}
                  onValueChange={([value]) => 
                    updatePreferences('breaks', { ...preferences.breaks, longBreakLength: value })
                  }
                  disabled={!preferences.breaks.enabled}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="blocks-between-breaks">
                  Study blocks between long breaks: {preferences.breaks.blocksBetweenLongBreaks}
                </Label>
                <Slider 
                  id="blocks-between-breaks" 
                  min={1} 
                  max={5} 
                  step={1} 
                  value={[preferences.breaks.blocksBetweenLongBreaks]}
                  onValueChange={([value]) => 
                    updatePreferences('breaks', { ...preferences.breaks, blocksBetweenLongBreaks: value })
                  }
                  disabled={!preferences.breaks.enabled}
                />
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">
                  Breaks will be automatically scheduled after study blocks. Short breaks will be added after each study session, and longer breaks after {preferences.breaks.blocksBetweenLongBreaks} consecutive study blocks.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Meals Settings */}
        <TabsContent value="meals" className="mt-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Meal Times</span>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="meals-enabled" className="text-sm font-normal">
                    Schedule meals
                  </Label>
                  <Switch 
                    id="meals-enabled" 
                    checked={preferences.meals.enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences('meals', { ...preferences.meals, enabled: checked })
                    }
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Breakfast</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="breakfast-start" className="text-xs text-muted-foreground">Start</Label>
                      <Input 
                        id="breakfast-start"
                        type="time"
                        value={preferences.meals.breakfast.start}
                        onChange={(e) => updatePreferences('meals', {
                          ...preferences.meals,
                          breakfast: {
                            ...preferences.meals.breakfast,
                            start: e.target.value
                          }
                        })}
                        disabled={!preferences.meals.enabled}
                      />
                    </div>
                    <div>
                      <Label htmlFor="breakfast-duration" className="text-xs text-muted-foreground">Duration</Label>
                      <div className="flex items-center">
                        <Input 
                          id="breakfast-duration"
                          type="number"
                          min={15}
                          max={90}
                          step={5}
                          value={preferences.meals.breakfastDuration}
                          onChange={(e) => updatePreferences('meals', {
                            ...preferences.meals,
                            breakfastDuration: parseInt(e.target.value) || 30
                          })}
                          disabled={!preferences.meals.enabled}
                        />
                        <span className="ml-1 text-xs text-muted-foreground">min</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Lunch</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="lunch-start" className="text-xs text-muted-foreground">Start</Label>
                      <Input 
                        id="lunch-start"
                        type="time"
                        value={preferences.meals.lunch.start}
                        onChange={(e) => updatePreferences('meals', {
                          ...preferences.meals,
                          lunch: {
                            ...preferences.meals.lunch,
                            start: e.target.value
                          }
                        })}
                        disabled={!preferences.meals.enabled}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lunch-duration" className="text-xs text-muted-foreground">Duration</Label>
                      <div className="flex items-center">
                        <Input 
                          id="lunch-duration"
                          type="number"
                          min={15}
                          max={90}
                          step={5}
                          value={preferences.meals.lunchDuration}
                          onChange={(e) => updatePreferences('meals', {
                            ...preferences.meals,
                            lunchDuration: parseInt(e.target.value) || 60
                          })}
                          disabled={!preferences.meals.enabled}
                        />
                        <span className="ml-1 text-xs text-muted-foreground">min</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Dinner</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="dinner-start" className="text-xs text-muted-foreground">Start</Label>
                      <Input 
                        id="dinner-start"
                        type="time"
                        value={preferences.meals.dinner.start}
                        onChange={(e) => updatePreferences('meals', {
                          ...preferences.meals,
                          dinner: {
                            ...preferences.meals.dinner,
                            start: e.target.value
                          }
                        })}
                        disabled={!preferences.meals.enabled}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dinner-duration" className="text-xs text-muted-foreground">Duration</Label>
                      <div className="flex items-center">
                        <Input 
                          id="dinner-duration"
                          type="number"
                          min={15}
                          max={120}
                          step={5}
                          value={preferences.meals.dinnerDuration}
                          onChange={(e) => updatePreferences('meals', {
                            ...preferences.meals,
                            dinnerDuration: parseInt(e.target.value) || 60
                          })}
                          disabled={!preferences.meals.enabled}
                        />
                        <span className="ml-1 text-xs text-muted-foreground">min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">
                  Study sessions will not be scheduled during meal times. The AI will account for these times when generating your timetable.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sleep Settings */}
        <TabsContent value="sleep" className="mt-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Sleep Schedule</span>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="sleep-enabled" className="text-sm font-normal">
                    Block sleep hours
                  </Label>
                  <Switch 
                    id="sleep-enabled" 
                    checked={preferences.sleep.enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences('sleep', { ...preferences.sleep, enabled: checked })
                    }
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedtime">Bedtime</Label>
                  <Input 
                    id="bedtime"
                    type="time"
                    value={preferences.sleep.bedtime}
                    onChange={(e) => updatePreferences('sleep', {
                      ...preferences.sleep,
                      bedtime: e.target.value
                    })}
                    disabled={!preferences.sleep.enabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wakeup">Wake up time</Label>
                  <Input 
                    id="wakeup"
                    type="time"
                    value={preferences.sleep.wakeup}
                    onChange={(e) => updatePreferences('sleep', {
                      ...preferences.sleep,
                      wakeup: e.target.value
                    })}
                    disabled={!preferences.sleep.enabled}
                  />
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">
                  No study sessions or events will be scheduled during your sleep hours. This ensures you maintain a healthy sleep schedule while studying.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Placement Settings */}
        <TabsContent value="placement" className="mt-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Placement Hours</span>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="placement-enabled" className="text-sm font-normal">
                    Block placement hours
                  </Label>
                  <Switch 
                    id="placement-enabled" 
                    checked={preferences.placement.enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences('placement', { ...preferences.placement, enabled: checked })
                    }
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-center">
                <div className="text-xs font-medium">Mon</div>
                <div className="text-xs font-medium">Tue</div>
                <div className="text-xs font-medium">Wed</div>
                <div className="text-xs font-medium">Thu</div>
                <div className="text-xs font-medium">Fri</div>
                <div className="text-xs font-medium">Sat</div>
                <div className="text-xs font-medium">Sun</div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="space-y-1">
                    <div className="grid grid-cols-1 gap-1">
                      <Input 
                        type="time"
                        placeholder="Start"
                        value={preferences.placement.enabled ? (preferences.placement[day as keyof PlacementPreferences] as TimeRange).start : ""}
                        onChange={(e) => {
                          if (preferences.placement.enabled) {
                            updatePreferences('placement', {
                              ...preferences.placement,
                              [day]: {
                                ...(preferences.placement[day as keyof PlacementPreferences] as TimeRange),
                                start: e.target.value
                              }
                            });
                          }
                        }}
                        disabled={!preferences.placement.enabled}
                        className="text-xs"
                      />
                      <Input 
                        type="time"
                        placeholder="End"
                        value={preferences.placement.enabled ? (preferences.placement[day as keyof PlacementPreferences] as TimeRange).end : ""}
                        onChange={(e) => {
                          if (preferences.placement.enabled) {
                            updatePreferences('placement', {
                              ...preferences.placement,
                              [day]: {
                                ...(preferences.placement[day as keyof PlacementPreferences] as TimeRange),
                                end: e.target.value
                              }
                            });
                          }
                        }}
                        disabled={!preferences.placement.enabled}
                        className="text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">
                  These hours will be blocked for clinical placements. No study sessions will be scheduled during these times. This is especially important for Years 3-5.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Notifications</span>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="notifications-enabled" className="text-sm font-normal">
                    Enable reminders
                  </Label>
                  <Switch 
                    id="notifications-enabled" 
                    checked={preferences.notifications.enabled}
                    onCheckedChange={(checked) => 
                      updatePreferences('notifications', { ...preferences.notifications, enabled: checked })
                    }
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minutes-before">
                  Remind me {preferences.notifications.minutesBefore} minutes before each event
                </Label>
                <Slider 
                  id="minutes-before" 
                  min={5} 
                  max={60} 
                  step={5} 
                  value={[preferences.notifications.minutesBefore]}
                  onValueChange={([value]) => 
                    updatePreferences('notifications', { ...preferences.notifications, minutesBefore: value })
                  }
                  disabled={!preferences.notifications.enabled}
                />
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">
                  You'll receive browser notifications before each scheduled event or study session to help you stay on track.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}