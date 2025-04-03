import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timelinePlugin from '@fullcalendar/timeline';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { SelectSubjects } from '@/components/ui/select-subjects';
import { StudyConfig } from '@/components/ui/study-config';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Calendar as CalendarIcon, PlusCircle, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import masterSubjects from '@/data/masterSubjects';
import { generateSpiralTimetable } from '@/utils/spiralAlgorithm';
import { UserEvent, UserPerformance } from '@/utils/spiralAlgorithm';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import '../styles/calendar.css';

// Types
interface UserPreferences {
  weeklyHours: number;
  yearGroup: number;
  daysPerWeek: number;
  selectedSubjects: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  allDay?: boolean;
  classNames?: string[];
  extendedProps?: {
    topics?: any[];
    isHoliday?: boolean;
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  weeklyHours: 0,
  yearGroup: 0,
  daysPerWeek: 0,
  selectedSubjects: [],
};

const STORAGE_KEYS = {
  PREFERENCES: 'study-preferences',
  HOLIDAYS: 'holiday-events',
  USER_EVENTS: 'user-events',
  USER_PERFORMANCE: 'user-performance',
  REVISION_COUNTS: 'revision-counts',
  STUDY_EVENTS: 'study-events',
};

// Generate a random ID for events
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function Timetable() {
  // Get toast notification function
  const { toast } = useToast();
  
  // State for user preferences
  const [weeklyHours, setWeeklyHours] = useState(DEFAULT_PREFERENCES.weeklyHours);
  const [yearGroup, setYearGroup] = useState(DEFAULT_PREFERENCES.yearGroup);
  const [daysPerWeek, setDaysPerWeek] = useState(DEFAULT_PREFERENCES.daysPerWeek);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(DEFAULT_PREFERENCES.selectedSubjects);
  
  // State for events and calendar
  const [studyEvents, setStudyEvents] = useState<CalendarEvent[]>([]);
  const [holidayEvents, setHolidayEvents] = useState<CalendarEvent[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [revisionCount, setRevisionCount] = useState(0);
  const [calendarRef, setCalendarRef] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // State for holidays
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayStartDate, setNewHolidayStartDate] = useState<Date | undefined>(undefined);
  const [newHolidayEndDate, setNewHolidayEndDate] = useState<Date | undefined>(undefined);
  
  // State for user performance (placeholder for AI-related features)
  const [userPerformance, setUserPerformance] = useState<UserPerformance>({
    subjects: {},
    topics: {},
  });
  
  // State for tracking session study counts
  const [sessionRevisionCounts, setSessionRevisionCounts] = useState<Record<string, number>>({});
  
  // State for session detail modal
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Loaded flag to prevent multiple loads
  const preferencesLoaded = useRef(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle session click events from calendar events
  useEffect(() => {
    const handleSessionClickEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ eventId: string, event: any }>;
      const eventId = customEvent.detail.eventId;
      const event = customEvent.detail.event;
      
      // Store the selected event info
      setSelectedEvent(event);
      setIsSessionDetailOpen(true);
      
      // Increment the study count for this session
      setSessionRevisionCounts((prev: Record<string, number>) => {
        const newCounts = { ...prev };
        newCounts[eventId] = (newCounts[eventId] || 0) + 1;
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.REVISION_COUNTS, JSON.stringify(newCounts));
        
        return newCounts;
      });
    };
    
    document.addEventListener('session:click', handleSessionClickEvent);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('session:click', handleSessionClickEvent);
    };
  }, []);

  // Save study events when they change
  useEffect(() => {
    if (!preferencesLoaded.current) return;
    localStorage.setItem(STORAGE_KEYS.STUDY_EVENTS, JSON.stringify(studyEvents));
  }, [studyEvents]);

// Load saved preferences on first mount
  useEffect(() => {
    if (preferencesLoaded.current) return;
    
    // First load from localStorage for offline functionality
    // Load user preferences
    const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences) as UserPreferences;
        setWeeklyHours(parsedPreferences.weeklyHours);
        setYearGroup(parsedPreferences.yearGroup);
        setDaysPerWeek(parsedPreferences.daysPerWeek);
        setSelectedSubjects(parsedPreferences.selectedSubjects);
      } catch (error) {
        console.error('Failed to parse saved preferences', error);
      }
    }
    
    // Load saved study events directly
    const savedStudyEvents = localStorage.getItem(STORAGE_KEYS.STUDY_EVENTS);
    if (savedStudyEvents) {
      try {
        setStudyEvents(JSON.parse(savedStudyEvents));
      } catch (error) {
        console.error('Failed to parse saved study events', error);
      }
    }
    
    // Load saved revision counts
    const savedRevisionCounts = localStorage.getItem(STORAGE_KEYS.REVISION_COUNTS);
    if (savedRevisionCounts) {
      try {
        setSessionRevisionCounts(JSON.parse(savedRevisionCounts));
      } catch (error) {
        console.error('Failed to parse saved revision counts', error);
      }
    }

    // Load saved holidays
    const savedHolidays = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    if (savedHolidays) {
      try {
        setHolidayEvents(JSON.parse(savedHolidays));
      } catch (error) {
        console.error('Failed to parse saved holidays', error);
      }
    }

    // Load user events
    const savedUserEvents = localStorage.getItem(STORAGE_KEYS.USER_EVENTS);
    if (savedUserEvents) {
      try {
        setUserEvents(JSON.parse(savedUserEvents));
      } catch (error) {
        console.error('Failed to parse saved user events', error);
      }
    }

    // Load user performance data
    const savedPerformance = localStorage.getItem(STORAGE_KEYS.USER_PERFORMANCE);
    if (savedPerformance) {
      try {
        setUserPerformance(JSON.parse(savedPerformance));
      } catch (error) {
        console.error('Failed to parse saved performance data', error);
      }
    }

    // Then try to load from backend API
    const loadBackendData = async () => {
      try {
        const apiModule = await import('../lib/api');
        const { api } = apiModule;
        
        // Load timetable data
        api.timetable.get()
          .then(data => {
            if (data) {
              // Update preferences if available
              if (data.preferences) {
                setWeeklyHours(data.preferences.weeklyHours);
                setYearGroup(data.preferences.yearGroup);
                setDaysPerWeek(data.preferences.daysPerWeek);
                setSelectedSubjects(data.preferences.selectedSubjects);
                localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences));
              }
              
              // Update study events if available
              if (data.studyEvents && data.studyEvents.length > 0) {
                setStudyEvents(data.studyEvents);
              }
              
              // Update holiday events if available
              if (data.holidayEvents && data.holidayEvents.length > 0) {
                setHolidayEvents(data.holidayEvents);
                localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(data.holidayEvents));
              }
            }
          })
          .catch(err => console.error('Error loading timetable data:', err));
        
        // Load user performance data
        api.performance.get()
          .then(data => {
            if (data) {
              setUserPerformance(data);
              localStorage.setItem(STORAGE_KEYS.USER_PERFORMANCE, JSON.stringify(data));
            }
          })
          .catch(err => console.error('Error loading user performance data:', err));
      } catch (error) {
        console.error('Error importing API module:', error);
      }
    };
    
    loadBackendData();
    preferencesLoaded.current = true;

    // Generate timetable with saved preferences if subjects are selected
    setTimeout(() => {
      if (selectedSubjects.length > 0) {
        handleGenerate();
      }
    }, 500);
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    if (!preferencesLoaded.current) return;

    const preferencesToSave: UserPreferences = {
      weeklyHours,
      yearGroup,
      daysPerWeek,
      selectedSubjects,
    };

    // Save to localStorage for offline functionality
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferencesToSave));
    
    // Optional: Save to backend API
    try {
      import('../lib/api').then(({ api }) => {
        api.timetable.save({ 
          preferences: preferencesToSave,
          studyEvents,
          holidayEvents 
        }).catch(err => console.error('Error saving timetable to API:', err));
      });
    } catch (error) {
      console.error('Error importing API module:', error);
    }
  }, [weeklyHours, yearGroup, daysPerWeek, selectedSubjects, studyEvents, holidayEvents]);

  // Save holidays when they change
  useEffect(() => {
    if (!preferencesLoaded.current) return;
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidayEvents));
  }, [holidayEvents]);

  // Save user events when they change
  useEffect(() => {
    if (!preferencesLoaded.current) return;
    localStorage.setItem(STORAGE_KEYS.USER_EVENTS, JSON.stringify(userEvents));
  }, [userEvents]);
  
  // Calendar midnight refresh
  useEffect(() => {
    if (!calendarRef) return;

    const updateCalendarView = () => {
      const calendarApi = calendarRef.getApi();
      calendarApi.today();
      calendarApi.render();
    };

    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        updateCalendarView();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [calendarRef]);

  // Generate timetable based on current settings
  const handleGenerate = () => {
    // Create blocks with the spiral algorithm
    const blocks = generateSpiralTimetable({
      weeklyStudyHours: weeklyHours,
      yearGroup,
      daysPerWeek,
      favouriteSubjects: selectedSubjects,
      subjectsData: masterSubjects,
      userEvents, // Pass user events to avoid scheduling conflicts
      userPerformance, // Pass performance data for adaptive scheduling
      revisionCount: revisionCount
    });

    // Convert blocks to calendar events
    const calendarEvents = blocks.map(block => ({
      id: generateId(),
      title: block.subject,
      start: `${block.date}T${block.startTime}`,
      end: `${block.date}T${block.endTime}`,
      backgroundColor: getSubjectColor(block.subject),
      borderColor: block.isInterjection ? '#ffffff' : getSubjectColor(block.subject),
      classNames: block.isInterjection ? ['interjection-event'] : undefined,
      extendedProps: {
        topics: block.topics
      }
    }));

    setStudyEvents(calendarEvents);
    setRevisionCount(prev => prev + 1);

    if (calendarRef) {
      const calendarApi = calendarRef.getApi();
      calendarApi.today();
    }
  };

  // Handle event drag and drop
  const handleEventDrop = (eventDropInfo: any) => {
    const { event } = eventDropInfo;
    
    if (event.extendedProps.isHoliday) {
      // Handle holiday event drop
      setHolidayEvents(prev => prev.map(ev => {
        if (ev.id === event.id) {
          return {
            ...ev,
            start: event.start.toISOString(),
            end: event.end ? event.end.toISOString() : event.start.toISOString(),
          };
        }
        return ev;
      }));
    } else {
      // Handle study event drop
      setStudyEvents(prev => prev.map(ev => {
        if (ev.id === event.id) {
          return {
            ...ev,
            start: event.start.toISOString(),
            end: event.end ? event.end.toISOString() : event.start.toISOString(),
          };
        }
        return ev;
      }));
    }
  };

  // Add a new holiday
  const handleAddHoliday = () => {
    if (!newHolidayName || !newHolidayStartDate) return;
    
    const endDate = newHolidayEndDate || newHolidayStartDate;
    
    // Create array of dates between start and end
    const dates: Date[] = [];
    const currentDate = new Date(newHolidayStartDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Create a holiday event for each day
    const newHolidays = dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      return {
        id: generateId(),
        title: newHolidayName,
        start: `${dateStr}T00:00:00`,
        end: `${dateStr}T23:59:59`,
        allDay: true,
        backgroundColor: '#f43f5e',
        borderColor: '#e11d48',
        textColor: '#ffffff',
        extendedProps: {
          isHoliday: true
        }
      };
    });
    
    setHolidayEvents(prev => [...prev, ...newHolidays]);
    
    // Convert to UserEvent format to block scheduling
    const newUserEvents: UserEvent[] = dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      return {
        name: newHolidayName,
        date: dateStr,
        startTime: '00:00',
        endTime: '23:59',
        recurringWeekly: false
      };
    });
    
    setUserEvents(prev => [...prev, ...newUserEvents]);
    
    // Reset form
    setNewHolidayName('');
    setNewHolidayStartDate(undefined);
    setNewHolidayEndDate(undefined);
  };
  
  // Run AI reflow (placeholder function for future implementation)
  const handleAiReflow = async () => {
    // Only proceed if we have study events to reflow
    if (studyEvents.length === 0) return;
    
    try {
      // Show loading state
      toast({
        title: "AI Reflow in progress",
        description: "Analyzing your schedule and optimizing your study plan...",
        duration: 5000,
      });
      
      // Convert events to a format suitable for AI
      const formattedEvents = studyEvents.map(event => ({
        subject: event.title,
        date: event.start.split('T')[0],
        startTime: event.start.split('T')[1].substring(0, 5),
        endTime: event.end.split('T')[1].substring(0, 5),
        topics: event.extendedProps?.topics || []
      }));
      
      // Call the backend API which will use OpenAI
      const response = await fetch('/api/ai-reflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: formattedEvents,
          preferences: {
            weeklyStudyHours: weeklyHours,
            yearGroup,
            daysPerWeek,
            favouriteSubjects: selectedSubjects,
          },
          userEvents, // Existing holidays/blocked time
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI optimized schedule');
      }
      
      const data = await response.json();
      
      // Convert optimized schedule back to calendar events
      const optimizedEvents = data.events.map((block: any) => ({
        id: generateId(),
        title: block.subject,
        start: `${block.date}T${block.startTime}`,
        end: `${block.date}T${block.endTime}`,
        backgroundColor: getSubjectColor(block.subject),
        borderColor: block.isInterleaved ? '#ffffff' : getSubjectColor(block.subject),
        classNames: block.isInterleaved ? ['interjection-event'] : undefined,
        extendedProps: {
          topics: block.topics
        }
      }));
      
      // Update calendar with new events
      setStudyEvents(optimizedEvents);
      
      toast({
        title: "AI Reflow complete",
        description: "Your schedule has been optimized for better knowledge retention.",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('AI Reflow error:', error);
      toast({
        title: "AI Reflow failed",
        description: "Falling back to standard algorithm. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
      
      // Fallback to standard algorithm
      handleGenerate();
    }
  };

  // Get color for a subject (using official UKMLA content map headings)
  const getSubjectColor = (subject: string) => {
    const colors = {
      "Acute and emergency": '#8b5cf6',
      "Cancer": '#6366f1',
      "Cardiovascular": '#3b82f6',
      "Child health": '#06b6d4',
      "Clinical haematology": '#f97316',
      "Clinical imaging": '#d946ef',
      "Dermatology": '#14b8a6',
      "Ear, nose and throat": '#8b5cf6',
      "Endocrine and metabolic": '#10b981',
      "Gastrointestinal": '#22c55e',
      "General practice": '#84cc16',
      "Infection": '#f43f5e',
      "Medicine of older adult": '#a78bfa',
      "Mental health": '#ec4899',
      "Musculoskeletal": '#eab308',
      "Neurosciences": '#0ea5e9',
      "Obstetrics and gynaecology": '#f59e0b',
      "Ophthalmology": '#a855f7',
      "Palliative and end of life care": '#c084fc',
      "Perioperative medicine and anaesthesia": '#e879f9',
      "Renal and urology": '#fb7185',
      "Respiratory": '#fda4af',
      "Sexual health": '#f472b6',
      "Surgery": '#64748b',
    };
    return colors[subject as keyof typeof colors] || '#666';
  };

  // Get calendar views based on screen size - now returns a properly typed object
  const getAvailableViews = () => {
    const views: Record<string, any> = windowWidth < 640 
      ? { timeGridDay: { buttonText: 'Day' } }
      : {
          timeGridDay: { buttonText: 'Day' },
          timeGridWeek: { buttonText: 'Week' },
          dayGridMonth: { buttonText: 'Month' },
          timelineWeek: { buttonText: 'Timeline' }
        };
    
    return views;
  };

  // Combine study events and holidays for the calendar
  const allEvents = [...studyEvents, ...holidayEvents];

  // Add session detail modal component
  const SessionDetailModal = () => {
    if (!selectedEvent) return null;
    
    const event = selectedEvent;
    const topics = event.extendedProps?.topics || [];
    const eventId = event.id;
    const studyCount = sessionRevisionCounts[eventId] || 0;
    
    // Calculate duration in minutes
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    
    // Calculate phase durations (10% orientation, 45% learning, 45% practice)
    const orientationMinutes = Math.round(durationMinutes * 0.1);
    const learningMinutes = Math.round(durationMinutes * 0.45);
    const practiceMinutes = durationMinutes - orientationMinutes - learningMinutes;
    
    return (
      <div className="session-detail-overlay" onClick={() => setIsSessionDetailOpen(false)}>
        <div 
          className="session-detail-card dark:bg-gray-800 dark:text-white" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{event.title} Session</h2>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Studied {studyCount} {studyCount === 1 ? 'time' : 'times'}
            </Badge>
            <button 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsSessionDetailOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {format(startDate, 'EEEE, MMM d, yyyy • h:mm a')} - {format(endDate, 'h:mm a')}
            <span className="ml-2">({durationMinutes} minutes)</span>
          </div>
          
          <div className="space-y-4">
            {/* Orientation Phase */}
            <div className="session-phase phase-orientation">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Orientation Phase ({orientationMinutes} min)
              </h3>
              <p className="text-sm">
                Review session goals and prepare your learning environment. 
                Connect this material with what you already know.
              </p>
            </div>
            
            {/* Learning Phase */}
            <div className="session-phase phase-learning">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                Learning Phase ({learningMinutes} min)
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-medium mb-2">Focus on these topics:</p>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {topics.map((topic: any, index: number) => (
                    <li key={index} className="text-sm ml-2">
                      • {topic.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Practice Phase */}
            <div className="session-phase phase-practice">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                Practice Phase ({practiceMinutes} min)
              </h3>
              <p className="text-sm">
                Test your knowledge with practice questions. Try explaining topics out loud 
                or teaching them to someone else. Create summary notes for later review.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-4 space-y-4 max-w-full h-[calc(100vh-80px)] flex flex-col">
      {/* Session detail modal */}
      {isSessionDetailOpen && <SessionDetailModal />}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-theme">
            Study Planner
          </h1>
          {revisionCount > 0 && (
            <p className="text-sm text-muted-foreground">
              Revision cycle: {revisionCount}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Holiday Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <CalendarIcon className="h-4 w-4" />
                <span>Add Holiday</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Holiday Period</DialogTitle>
                <DialogDescription>
                  Block out dates for holidays. No study sessions will be scheduled during these times.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input 
                    id="name" 
                    value={newHolidayName}
                    onChange={e => setNewHolidayName(e.target.value)}
                    className="col-span-3" 
                    placeholder="e.g., Summer Break" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Start Date</Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newHolidayStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newHolidayStartDate ? (
                            newHolidayStartDate.toLocaleDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newHolidayStartDate}
                          onSelect={setNewHolidayStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">End Date</Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newHolidayEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newHolidayEndDate ? (
                            newHolidayEndDate.toLocaleDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newHolidayEndDate}
                          onSelect={setNewHolidayEndDate}
                          initialFocus
                          disabled={(date) => 
                            newHolidayStartDate ? date < newHolidayStartDate : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddHoliday} disabled={!newHolidayName || !newHolidayStartDate}>
                    Add Holiday
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Settings Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Settings</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Study Settings</DialogTitle>
                <DialogDescription>
                  Configure your study preferences and subject selections.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <StudyConfig
                  weeklyHours={weeklyHours}
                  yearGroup={yearGroup}
                  daysPerWeek={daysPerWeek}
                  onWeeklyHoursChange={setWeeklyHours}
                  onYearGroupChange={setYearGroup}
                  onDaysPerWeekChange={setDaysPerWeek}
                  onGenerate={handleGenerate}
                />

                <div className="space-y-4">
                  <SelectSubjects
                    subjects={masterSubjects.map(subject => subject.name)}
                    selectedSubjects={selectedSubjects}
                    onChange={setSelectedSubjects}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button 
                    onClick={handleGenerate} 
                    disabled={weeklyHours <= 0 || selectedSubjects.length === 0}
                    className="button-theme"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Timetable
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Quick Generate Button */}
          <Button 
            className="button-theme"
            onClick={handleGenerate}
            disabled={weeklyHours <= 0 || selectedSubjects.length === 0}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate
          </Button>
          
          {/* AI Reflow Button */}
          <Button 
            variant="outline"
            className="border-theme/30 hover:bg-theme/5 text-theme"
            onClick={handleAiReflow}
            disabled={studyEvents.length === 0}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Reflow with AI
          </Button>
        </div>
      </div>

      {/* Full-Page Calendar */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-theme/10 overflow-hidden">
        <FullCalendar
          ref={setCalendarRef}
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, timelinePlugin]}
          initialView={windowWidth < 640 ? "timeGridDay" : "timeGridWeek"}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: windowWidth < 640 
              ? 'timeGridDay' 
              : 'timeGridDay,timeGridWeek,dayGridMonth,timelineWeek'
          }}
          // Apply views with as any to avoid type issues with the views prop
          views={getAvailableViews() as any}
          events={allEvents}
          eventContent={renderEventContent}
          editable={true}
          eventDrop={handleEventDrop}
          allDaySlot={true}
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          height="100%"
          expandRows={true}
          stickyHeaderDates={true}
          weekends={true}
          nowIndicator={true}
          dayHeaderFormat={{ weekday: 'long' }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          viewClassNames="modern-fullcalendar-view"
          slotLaneClassNames="modern-fullcalendar-lane"
          eventClassNames="modern-fullcalendar-event"
          dayHeaderClassNames="modern-fullcalendar-header"
          buttonText={{
            today: 'T' // Capital T for today button
          }}
        />
      </div>
      
      {/* Session Detail Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button id="session-detail-dialog-trigger" className="hidden">Open</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <div id="session-detail-content">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" id="session-detail-title">
                <span className="text-gradient-theme">Study Session</span>
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span id="session-detail-date"></span>
                  <span id="session-detail-time"></span>
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">10%</span>
                  Orientation Phase
                </h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Quick overview of all topics to orient yourself (10 minutes)
                  </p>
                  <ul className="space-y-2 list-disc list-inside mt-2" id="session-detail-all-topics">
                    {/* All topics will be populated here */}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">45%</span>
                  Learning Phase
                </h3>
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="text-sm text-emerald-800 mb-2">
                    Focused study on main topics (45 minutes)
                  </p>
                  <ul className="space-y-2 list-disc list-inside" id="session-detail-topics">
                    {/* Main topics will be populated here */}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="bg-violet-100 text-violet-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">45%</span>
                  Practice Phase
                </h3>
                <div className="bg-violet-50 p-3 rounded-lg">
                  <p className="text-sm text-violet-800 mb-2">
                    Practice questions on SPRANKI, PassMed, or QuesMed (45 minutes)
                  </p>
                  <div className="flex gap-2 mt-2">
                    <a href="https://www.spranki.com/" target="_blank" rel="noopener noreferrer" className="text-xs bg-white px-2 py-1 rounded border border-violet-200 text-violet-800 hover:bg-violet-100 transition-colors">SPRANKI</a>
                    <a href="https://www.passmed.com/" target="_blank" rel="noopener noreferrer" className="text-xs bg-white px-2 py-1 rounded border border-violet-200 text-violet-800 hover:bg-violet-100 transition-colors">PassMed</a>
                    <a href="https://www.quesmed.com/" target="_blank" rel="noopener noreferrer" className="text-xs bg-white px-2 py-1 rounded border border-violet-200 text-violet-800 hover:bg-violet-100 transition-colors">QuesMed</a>
                  </div>
                  <ul className="space-y-2 list-disc list-inside mt-3 text-sm" id="session-detail-connections">
                    <li className="italic text-violet-700">Focus on related concepts:</li>
                    {/* Connection topics will be populated here */}
                  </ul>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="secondary" className="w-full">
                Mark as Completed
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// JavaScript to populate the session detail dialog from data attributes
// This runs when the dialog is opened
const populateSessionDetails = () => {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('DOMContentLoaded', () => {
    const detailsElement = document.getElementById('session-detail-content');
    const dialogTrigger = document.getElementById('session-detail-dialog-trigger');
    
    if (!detailsElement || !dialogTrigger) return;
    
    dialogTrigger.addEventListener('click', () => {
      // Get data from attributes
      const title = detailsElement.getAttribute('data-event-title') || 'Study Session';
      const topicsJson = detailsElement.getAttribute('data-event-topics') || '[]';
      const startTime = detailsElement.getAttribute('data-event-start') || '';
      const endTime = detailsElement.getAttribute('data-event-end') || '';
      
      try {
        // Parse topics
        const topics = JSON.parse(topicsJson);
        
        // Set title
        const titleElement = document.getElementById('session-detail-title');
        if (titleElement) {
          titleElement.textContent = title;
        }
        
        // Format and set date/time
        if (startTime && endTime) {
          const start = parseISO(startTime);
          const end = parseISO(endTime);
          
          const dateElement = document.getElementById('session-detail-date');
          const timeElement = document.getElementById('session-detail-time');
          
          if (dateElement) {
            dateElement.textContent = format(start, 'MMMM d, yyyy');
          }
          
          if (timeElement) {
            timeElement.textContent = `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
          }
        }
        
        // Populate topics
        const allTopicsElement = document.getElementById('session-detail-all-topics');
        const topicsElement = document.getElementById('session-detail-topics');
        const connectionsElement = document.getElementById('session-detail-connections');
        
        if (allTopicsElement && topicsElement && connectionsElement) {
          // Clear previous content
          allTopicsElement.innerHTML = '';
          topicsElement.innerHTML = '';
          connectionsElement.innerHTML = '<li class="italic text-violet-700">Focus on related concepts:</li>';
          
          // Get all topics (main + connections)
          const mainTopics = topics.filter((t: any) => t.type === 'main');
          const connectionTopics = topics.filter((t: any) => t.type === 'connection');
          
          // Add all topics to orientation phase (main + connections)
          const allTopics = new Set<string>();
          
          // Add main topics to the set
          mainTopics.forEach((topic: any) => {
            allTopics.add(topic.name);
          });
          
          // Add connection topics to the set
          connectionTopics.forEach((topic: any) => {
            if (topic.connectionTopics && topic.connectionTopics.length > 0) {
              topic.connectionTopics.forEach((connection: string) => {
                // Extract just the topic name from "Subject: Topic"
                const topicName = connection.split(': ').pop() || connection;
                allTopics.add(topicName);
              });
            }
          });
          
          // Add all topics to orientation phase section
          allTopics.forEach((topicName) => {
            const li = document.createElement('li');
            li.textContent = topicName;
            li.className = 'text-xs'; // Smaller font for quick overview
            allTopicsElement.appendChild(li);
          });
          
          // Add main topics to learning phase section
          mainTopics.forEach((topic: any) => {
            const li = document.createElement('li');
            li.textContent = topic.name;
            topicsElement.appendChild(li);
          });
          
          // Add connection topics to practice phase section
          let connectionsAdded = false;
          connectionTopics.forEach((topic: any) => {
            if (topic.connectionTopics && topic.connectionTopics.length > 0) {
              topic.connectionTopics.forEach((connection: string) => {
                // Extract just the topic name from "Subject: Topic"
                const [subject, topicName] = connection.split(': ');
                
                const li = document.createElement('li');
                li.textContent = topicName + (subject ? ` (${subject})` : '');
                connectionsElement.appendChild(li);
                connectionsAdded = true;
              });
            }
          });
          
          // If no connections were added, add a placeholder
          if (!connectionsAdded) {
            const li = document.createElement('li');
            li.textContent = 'Focus on main topics from learning phase';
            li.className = 'italic';
            connectionsElement.appendChild(li);
          }
        }
      } catch (error) {
        console.error('Error populating session details:', error);
      }
    });
  });
};

// Run the function
populateSessionDetails();

const renderEventContent = (eventInfo: any) => {
  const event = eventInfo.event;
  const topics = event.extendedProps?.topics;
  const isHoliday = event.extendedProps?.isHoliday;
  
  if (isHoliday) {
    return (
      <div className="w-full h-full p-1 flex items-center justify-center text-white">
        <div className="text-sm font-semibold">{event.title}</div>
      </div>
    );
  }
  
  // Reference to the component's state variables
  const handleSessionClick = () => {
    // Use the parent component's state setters
    window.setTimeout(() => {
      // We'll call these methods from the parent scope
      // This is a workaround to avoid context issues in the rendering function
      const clickEvent = new CustomEvent('session:click', { 
        detail: { eventId: event.id, event: event }
      });
      document.dispatchEvent(clickEvent);
    }, 0);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div 
            className="w-full h-full p-1 cursor-pointer transition-opacity hover:opacity-90" 
            onClick={handleSessionClick}
          >
            <div className="text-sm font-semibold">
              {event.title}
            </div>
            {/* Only show the subject title, not the topics */}
          </div>
        </TooltipTrigger>
        {topics && topics.length > 0 && (
          <TooltipContent side="right" align="start" className="z-50 w-80 max-h-80 overflow-auto bg-white/95 backdrop-blur-sm border shadow-lg p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{event.title} - Session Contents:</p>
              </div>
              <div className="max-h-60 overflow-y-auto pr-2">
                <ul className="space-y-1">
                  {topics.map((topic: any, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-1">
                      <span className="mt-1 inline-block w-2 h-2 flex-shrink-0">
                        {topic.type === 'main' ? (
                          <span className="inline-block w-2 h-2 bg-theme rounded-full"></span>
                        ) : (
                          <span className="inline-block w-2 h-2 border border-theme rounded-full"></span>
                        )}
                      </span>
                      <span>{topic.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs italic pt-2 border-t mt-2">Click for detailed session structure</p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}