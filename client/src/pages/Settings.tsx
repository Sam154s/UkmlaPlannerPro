import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { colorSchemes, useTheme } from "@/hooks/use-theme";
import { Moon, Sun, Trophy, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import masterSubjects from '@/data/masterSubjects';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Settings() {
  const { toast } = useToast();
  const { isDarkMode, toggleDarkMode, currentScheme, setColorScheme } = useTheme();

  // Exam mode state
  const [isExamMode, setIsExamMode] = useState(() => {
    const saved = localStorage.getItem('exam-mode-active');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [examModeSettings, setExamModeSettings] = useState(() => {
    const saved = localStorage.getItem('exam-mode-settings');
    return saved ? JSON.parse(saved) : {
      weeks: 4,
      hoursPerDay: 4,
      daysPerWeek: 5
    };
  });

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  // Find the coral/orange color scheme from the available schemes
  const coralScheme = colorSchemes.find(scheme => 
    scheme.name.toLowerCase().includes('orange') || 
    scheme.name.toLowerCase().includes('coral') ||
    scheme.name.toLowerCase().includes('red')
  ) || colorSchemes[0]; // fallback to first scheme

  // Handle exam mode toggle with site-wide theme switching
  const handleExamModeToggle = () => {
    const newExamMode = !isExamMode;
    setIsExamMode(newExamMode);
    
    if (newExamMode) {
      // Entering exam mode - switch to coral theme and dark mode
      setColorScheme(coralScheme);
      if (!isDarkMode) {
        toggleDarkMode();
      }
    }
    
    // Persist exam mode state
    localStorage.setItem('exam-mode-active', JSON.stringify(newExamMode));
    
    toast({
      title: newExamMode ? "Exam Mode Enabled" : "Exam Mode Disabled",
      description: newExamMode ? 
        "Site theme switched to coral with dark mode for intensive study" : 
        "Exam mode disabled - you can now change themes manually",
    });
  };

  // Restore exam mode theme on component mount
  useEffect(() => {
    if (isExamMode) {
      setColorScheme(coralScheme);
      if (!isDarkMode) {
        toggleDarkMode();
      }
    }
  }, []); // Only run on mount

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      // TODO: Implement password change
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <h1 className="text-3xl font-bold text-gradient-theme">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Exam Mode</span>
          </CardTitle>
          <CardDescription>
            Intensive study mode with coral theme and enhanced focus settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="exam-mode">Enable Exam Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switches to coral theme with dark mode for focused studying
              </p>
            </div>
            <Switch
              id="exam-mode"
              checked={isExamMode}
              onCheckedChange={handleExamModeToggle}
            />
          </div>

          {isExamMode && (
            <div className="space-y-4 border-t pt-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-orange-700 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Exam Mode Active</span>
                </div>
                <p className="text-sm text-orange-600">
                  Theme is locked to coral with dark mode for intensive study focus
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-weeks">Study Duration (weeks)</Label>
                  <Input
                    id="exam-weeks"
                    type="number"
                    min="1"
                    max="8"
                    value={examModeSettings.weeks}
                    onChange={(e) => {
                      const newSettings = {...examModeSettings, weeks: parseInt(e.target.value) || 4};
                      setExamModeSettings(newSettings);
                      localStorage.setItem('exam-mode-settings', JSON.stringify(newSettings));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam-hours">Hours per day</Label>
                  <Input
                    id="exam-hours"
                    type="number"
                    min="4"
                    max="16"
                    value={examModeSettings.hoursPerDay}
                    onChange={(e) => {
                      const newSettings = {...examModeSettings, hoursPerDay: parseInt(e.target.value) || 4};
                      setExamModeSettings(newSettings);
                      localStorage.setItem('exam-mode-settings', JSON.stringify(newSettings));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam-days">Days per week</Label>
                  <Input
                    id="exam-days"
                    type="number"
                    min="5"
                    max="7"
                    value={examModeSettings.daysPerWeek}
                    onChange={(e) => {
                      const newSettings = {...examModeSettings, daysPerWeek: parseInt(e.target.value) || 5};
                      setExamModeSettings(newSettings);
                      localStorage.setItem('exam-mode-settings', JSON.stringify(newSettings));
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum recommended: 4 hours per day, 5 days per week for effective exam preparation
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-gradient-theme text-white hover:opacity-90">
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Color Scheme</Label>
            {isExamMode && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Exam Mode Active</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  Color scheme is locked to coral theme while exam mode is enabled
                </p>
              </div>
            )}
            <RadioGroup
              value={currentScheme.name}
              onValueChange={(value) => {
                if (isExamMode) {
                  toast({
                    title: "Theme locked",
                    description: "Disable exam mode to change color schemes",
                    variant: "destructive",
                  });
                  return;
                }
                const selectedScheme = colorSchemes.find(s => s.name === value);
                if (selectedScheme) {
                  setColorScheme(selectedScheme);
                }
              }}
              className="grid grid-cols-2 gap-4"
            >
              {colorSchemes.map((scheme) => (
                <Label
                  key={scheme.name}
                  className={`flex items-center space-x-3 border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    currentScheme.name === scheme.name ? 'border-theme ring-2 ring-theme/20' : ''
                  } ${isExamMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RadioGroupItem value={scheme.name} className="sr-only" />
                  <div className="flex-1">
                    <div className="font-medium">{scheme.name}</div>
                    <div
                      className="h-4 w-full rounded-full mt-1.5"
                      style={{
                        background: `linear-gradient(to right, rgb(var(--${scheme.from})), ${
                          scheme.via ? `rgb(var(--${scheme.via})),` : ''
                        } rgb(var(--${scheme.to})))`
                      }}
                    />
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}