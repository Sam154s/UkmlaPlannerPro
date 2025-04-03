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
import { RefreshCw, Calendar as CalendarIcon, PlusCircle, Sparkles } from "lucide-react";
import masterSubjects from '@/data/masterSubjects';
import { generateSpiralTimetable } from '@/utils/spiralAlgorithm';
import { UserEvent, UserPerformance } from '@/utils/spiralAlgorithm';
import { cn } from '@/lib/utils';
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
};

// Generate a random ID for events
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function Timetable() {
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

  // Loaded flag to prevent multiple loads
  const preferencesLoaded = useRef(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const handleAiReflow = () => {
    // This would integrate with OpenAI or other AI service
    // For now, just re-run the generation algorithm
    handleGenerate();
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

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-full h-[calc(100vh-80px)] flex flex-col">
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
            
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Main Topics</h3>
                <ul className="space-y-2 list-disc list-inside" id="session-detail-topics">
                  {/* Topics will be populated from data attributes */}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Connections</h3>
                <ul className="space-y-2 text-sm text-muted-foreground" id="session-detail-connections">
                  {/* Connections will be populated from data attributes */}
                </ul>
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
        const topicsElement = document.getElementById('session-detail-topics');
        const connectionsElement = document.getElementById('session-detail-connections');
        
        if (topicsElement && connectionsElement) {
          // Clear previous content
          topicsElement.innerHTML = '';
          connectionsElement.innerHTML = '';
          
          // Add main topics
          const mainTopics = topics.filter((t: any) => t.type === 'main');
          mainTopics.forEach((topic: any) => {
            const li = document.createElement('li');
            li.textContent = topic.name;
            topicsElement.appendChild(li);
          });
          
          // Add connection topics
          const connectionTopics = topics.filter((t: any) => t.type === 'connection');
          connectionTopics.forEach((topic: any) => {
            if (topic.connectionTopics && topic.connectionTopics.length > 0) {
              topic.connectionTopics.forEach((connection: string) => {
                const li = document.createElement('li');
                li.textContent = connection;
                connectionsElement.appendChild(li);
              });
            }
          });
        }
      } catch (error) {
        console.error('Error populating session details:', error);
      }
    });
  });
};

// Run the function
populateSessionDetails();

function renderEventContent(eventInfo: any) {
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

  // Handle click to show detailed session view
  const handleSessionClick = () => {
    // We'll use Radix UI Dialog for a better UX
    const dialogElement = document.getElementById('session-detail-dialog-trigger');
    if (dialogElement) {
      (dialogElement as HTMLButtonElement).click();
      
      // Store the selected event info in the data attributes
      const detailsElement = document.getElementById('session-detail-content');
      if (detailsElement) {
        detailsElement.setAttribute('data-event-title', event.title);
        detailsElement.setAttribute('data-event-topics', JSON.stringify(topics || []));
        detailsElement.setAttribute('data-event-start', event.start?.toISOString() || '');
        detailsElement.setAttribute('data-event-end', event.end?.toISOString() || '');
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="w-full h-full p-1 cursor-pointer transition-opacity hover:opacity-90" 
            onClick={handleSessionClick}
          >
            <div className="text-sm font-semibold">{event.title}</div>
            {/* Only show the subject title, not the topics */}
          </div>
        </TooltipTrigger>
        {topics && topics.length > 0 && (
          <TooltipContent className="w-64 bg-white/95 backdrop-blur-sm border shadow-lg">
            <div className="space-y-2">
              <p className="font-semibold text-sm">Session Overview:</p>
              <ul className="space-y-2">
                {topics.filter((t: any) => t.type === 'main').map((topic: any, index: number) => (
                  <li key={index} className="text-sm">
                    {topic.name}
                  </li>
                ))}
              </ul>
              <p className="text-xs italic">Click for full session details</p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}