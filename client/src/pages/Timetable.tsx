import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timelinePlugin from '@fullcalendar/timeline';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SelectSubjects } from '@/components/ui/select-subjects';
import { StudyConfig } from '@/components/ui/study-config';
import AIEventChat from '@/components/ui/ai-event-chat';
import { BreakSettings, DEFAULT_USER_PREFERENCES, UserPreferences as LifestylePreferences } from '@/components/ui/break-settings';
import { ExamCountdown, ExamDate } from '@/components/ui/exam-countdown';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Calendar as CalendarIcon, PlusCircle, Settings, AlarmClock, RefreshCw, Sparkles, Zap, Calendar, Trophy, X, Clock, MapPin, Coffee, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { notificationService } from '@/utils/notificationService';
import masterSubjects from '@/data/masterSubjects';
import { generateSpiralTimetable } from '@/utils/spiralAlgorithm';
import { UserEvent, UserPerformance } from '@/utils/spiralAlgorithm';
import '../styles/calendar.css';

// Types
interface UserPreferences {
  hoursPerWeek: number;
  yearGroup: number;
  studyDays: number[];
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
  hoursPerWeek: 14,
  yearGroup: 3,
  studyDays: [1, 2, 3, 4, 5], // Mon-Fri
  selectedSubjects: [],
};

const STORAGE_KEYS = {
  PREFERENCES: 'study-preferences',
  HOLIDAYS: 'holiday-events',
  USER_EVENTS: 'user-events',
  USER_PERFORMANCE: 'user-performance',
  REVISION_COUNTS: 'revision-counts',
  STUDY_EVENTS: 'study-events',
  USER_LIFESTYLE: 'user-lifestyle',
  EXAM_DATES: 'exam-dates',
};

// Generate a random ID for events
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function Timetable() {
  // Get toast notification function
  const { toast } = useToast();
  
  // State for user preferences
  const [hoursPerWeek, setHoursPerWeek] = useState(14);
  const [yearGroup, setYearGroup] = useState(5);
  const [studyDays, setStudyDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  
  // State for events and calendar
  const [studyEvents, setStudyEvents] = useState<CalendarEvent[]>([]);
  const [holidayEvents, setHolidayEvents] = useState<CalendarEvent[]>([]);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [revisionCount, setRevisionCount] = useState(0);
  const [calendarRef, setCalendarRef] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // State for lifestyle preferences
  const [lifestylePreferences, setLifestylePreferences] = useState<LifestylePreferences>(DEFAULT_USER_PREFERENCES);
  
  // State for exam dates
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  
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
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAiPlanningOpen, setIsAiPlanningOpen] = useState(false);
  const [isLifestyleSettingsOpen, setIsLifestyleSettingsOpen] = useState(false);
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
  
  // Loaded flag to prevent multiple loads
  const preferencesLoaded = useRef(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle session click events
  const handleSessionClick = (info: any) => {
    // Check if it's a holiday event
    if (info.event.extendedProps?.isHoliday) return;
    
    // Get the event details
    const event = info.event;
    const topics = event.extendedProps?.topics || [];
    
    // Set the selected event in state
    setSelectedEvent({
      id: event.id,
      title: event.title,
      topics,
      start: event.start,
      end: event.end
    });
    
    // Increment the study count for this session
    setSessionRevisionCounts(prev => {
      const newCounts = { ...prev };
      newCounts[event.id] = (newCounts[event.id] || 0) + 1;
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.REVISION_COUNTS, JSON.stringify(newCounts));
      
      return newCounts;
    });
    
    // Open the session detail modal
    setIsSessionDetailOpen(true);
  };

  // Save study events when they change
  useEffect(() => {
    if (!preferencesLoaded.current) return;
    localStorage.setItem(STORAGE_KEYS.STUDY_EVENTS, JSON.stringify(studyEvents));
  }, [studyEvents]);

  // Auto-generate timetable when settings change
  useEffect(() => {
    if (!preferencesLoaded.current) return;
    if (selectedSubjects.length === 0) return;
    
    // Automatically generate timetable when key settings change
    const generateTimetable = () => {
      const yearMultiplier = yearGroup <= 5 ? [2.0, 1.6, 1.3, 1.1, 1.0][yearGroup - 1] : 1.0;
      const blocks = generateSpiralTimetable({
        hoursPerWeek,
        weeklyStudyHours: hoursPerWeek, // legacy fallback
        studyDays,
        yearMultiplier,
        favouriteSubjects: selectedSubjects,
        subjectsData: masterSubjects,
        userEvents,
        userPerformance,
        blocksTable: {
          'Acute and emergency': 8,
          'Cardiovascular': 10,
          'Respiratory': 8,
          'Gastrointestinal': 9,
          'Endocrinology': 6,
          'Genitourinary': 7,
          'Musculoskeletal': 8,
          'Neurological': 9,
          'Dermatology': 5,
          'Ophthalmology': 4,
          'ENT': 4,
          'Psychiatry': 7,
          'Obstetrics and gynaecology': 8,
          'Paediatrics': 9,
          'Pharmacology': 6,
          'Pathology': 5,
          'Clinical skills': 4,
          'Ethics and law': 3
        }
      });

      // Create calendar events with unique IDs and force display in all views
      const calendarEvents = blocks.map((block, index) => ({
        id: `event-${index}-${block.date}-${block.startTime}`,
        title: block.subject,
        start: `${block.date}T${block.startTime}`,
        end: `${block.date}T${block.endTime}`,
        backgroundColor: getSubjectColor(block.subject),
        borderColor: getSubjectBorderColor(block.subject),
        textColor: '#374151',
        classNames: ['single-subject-event'],
        display: 'block', // Force display in all views including month
        allDay: false, // Explicitly set as timed event
        extendedProps: {
          topics: block.topics,
          isStudyEvent: true
        }
      }));

      setStudyEvents(calendarEvents);
    };

    generateTimetable();
  }, [hoursPerWeek, yearGroup, studyDays, selectedSubjects, userEvents]);

  // Load saved preferences on first mount
  useEffect(() => {
    if (preferencesLoaded.current) return;
    
    // First load from localStorage for offline functionality
    // Load user preferences with backward compatibility migration
    const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        
        // Migration from old format
        if (parsedPreferences.weeklyHours && !parsedPreferences.hoursPerWeek) {
          parsedPreferences.hoursPerWeek = parsedPreferences.weeklyHours;
          delete parsedPreferences.weeklyHours;
        }
        
        if (parsedPreferences.daysPerWeek && !parsedPreferences.studyDays) {
          // Convert daysPerWeek to studyDays array
          const days = parsedPreferences.daysPerWeek;
          if (days === 5) parsedPreferences.studyDays = [1, 2, 3, 4, 5]; // Mon-Fri
          else if (days === 3) parsedPreferences.studyDays = [1, 3, 5]; // Mon, Wed, Fri
          else if (days === 2) parsedPreferences.studyDays = [2, 4]; // Tue, Thu
          else if (days === 1) parsedPreferences.studyDays = [3]; // Wed only
          else parsedPreferences.studyDays = [1, 2, 3, 4, 5]; // Default Mon-Fri
          delete parsedPreferences.daysPerWeek;
        }
        
        setHoursPerWeek(parsedPreferences.hoursPerWeek || 14);
        setYearGroup(parsedPreferences.yearGroup || 5);
        setStudyDays(parsedPreferences.studyDays || [1, 2, 3, 4, 5]);
        setSelectedSubjects(parsedPreferences.selectedSubjects || []);
        
        // Save migrated preferences
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(parsedPreferences));
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
    
    // Load lifestyle preferences
    const savedLifestyle = localStorage.getItem(STORAGE_KEYS.USER_LIFESTYLE);
    if (savedLifestyle) {
      try {
        setLifestylePreferences(JSON.parse(savedLifestyle));
      } catch (error) {
        console.error('Failed to parse saved lifestyle preferences', error);
      }
    }
    
    // Load exam dates
    const savedExamDates = localStorage.getItem(STORAGE_KEYS.EXAM_DATES);
    if (savedExamDates) {
      try {
        setExamDates(JSON.parse(savedExamDates));
      } catch (error) {
        console.error('Failed to parse saved exam dates', error);
      }
    }


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
      hoursPerWeek,
      yearGroup,
      studyDays,
      selectedSubjects,
    };

    // Save to localStorage for offline functionality
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferencesToSave));
    localStorage.setItem('hours-per-week', hoursPerWeek.toString());
    localStorage.setItem('study-days', JSON.stringify(studyDays));
    localStorage.setItem('selected-subjects', JSON.stringify(selectedSubjects));
  }, [hoursPerWeek, yearGroup, studyDays, selectedSubjects, studyEvents, holidayEvents]);

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
  
  // Save lifestyle preferences when they change
  useEffect(() => {
    if (!preferencesLoaded.current) return;
    localStorage.setItem(STORAGE_KEYS.USER_LIFESTYLE, JSON.stringify(lifestylePreferences));
  }, [lifestylePreferences]);
  
  // Save exam dates when they change
  useEffect(() => {
    if (!preferencesLoaded.current) return;
    localStorage.setItem(STORAGE_KEYS.EXAM_DATES, JSON.stringify(examDates));
  }, [examDates]);
  
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
    const yearMultiplier = yearGroup <= 5 ? [2.0, 1.6, 1.3, 1.1, 1.0][yearGroup - 1] : 1.0;
    // Create blocks with the spiral algorithm
    const blocks = generateSpiralTimetable({
      hoursPerWeek,
      weeklyStudyHours: hoursPerWeek, // legacy fallback
      studyDays,
      yearMultiplier,
      favouriteSubjects: selectedSubjects,
      subjectsData: masterSubjects,
      userEvents, // Pass user events to avoid scheduling conflicts
      userPerformance, // Pass performance data for adaptive scheduling
      blocksTable: {
        'Acute and emergency': 8,
        'Cardiovascular': 10,
        'Respiratory': 8,
        'Gastrointestinal': 9,
        'Endocrinology': 6,
        'Genitourinary': 7,
        'Musculoskeletal': 8,
        'Neurological': 9,
        'Dermatology': 5,
        'Ophthalmology': 4,
        'ENT': 4,
        'Psychiatry': 7,
        'Obstetrics and gynaecology': 8,
        'Paediatrics': 9,
        'Pharmacology': 6,
        'Pathology': 5,
        'Clinical skills': 4,
        'Ethics and law': 3
      }
    });

    // Convert blocks to calendar events with unique IDs and force display in all views
    const calendarEvents = blocks.map((block, index) => ({
      id: `regen-event-${index}-${block.date}-${block.startTime}`,
      title: block.subject,
      start: `${block.date}T${block.startTime}`,
      end: `${block.date}T${block.endTime}`,
      backgroundColor: getSubjectColor(block.subject),
      borderColor: getSubjectBorderColor(block.subject),
      textColor: '#374151',
      classNames: ['single-subject-event'],
      display: 'block', // Force display in all views including month
      allDay: false, // Explicitly set as timed event
      extendedProps: {
        topics: block.topics,
        isStudyEvent: true
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

  // Get all events (study events + holidays + other user events) for the calendar
  const allEvents = [...studyEvents, ...holidayEvents];

  // Get available calendar views based on screen size
  const getAvailableViews = () => {
    if (windowWidth < 640) {
      return {
        timeGridDay: { type: 'timeGrid', duration: { days: 1 } }
      };
    }
    
    return {
      timeGridDay: { type: 'timeGrid', duration: { days: 1 } },
      timeGridWeek: { type: 'timeGrid', duration: { days: 7 } },
      dayGridMonth: { type: 'dayGrid', duration: { months: 1 } },
      timelineWeek: { type: 'timeline', duration: { days: 7 } }
    };
  };

  // Soft pastel color palette for subjects
  const SUBJECT_COLORS: {[key: string]: string} = {
    "Acute and emergency": '#fce7f3',
    "Cancer": '#f3e8ff', 
    "Cardiovascular": '#dbeafe',
    "Child health": '#d1fae5',
    "Dermatology": '#fef3c7',
    "Digital health": '#e0e7ff',
    "Ear, nose and throat": '#fce7f3',
    "Endocrinology": '#cffafe',
    "Ethics and law": '#dcfce7',
    "Evidence-based practice": '#fefce8',
    "Gastroenterology": '#fed7aa',
    "Genetics and genomics": '#ecfccb',
    "Global and population health": '#cffafe',
    "Haematology": '#fee2e2',
    "Health promotion and illness prevention": '#ecfccb',
    "Immunology": '#fef3c7',
    "Infectious disease": '#fee2e2',
    "Insights from humanities": '#e0e7ff',
    "Mental health": '#fce7f3',
    "Metabolic health": '#fef3c7',
    "Musculoskeletal": '#fce7f3',
    "Neurology": '#e0e7ff',
    "Obstetrics and gynaecology": '#fce7f3',
    "Ophthalmology": '#cffafe',
    "Palliative and end of life care": '#f3e8ff',
    "Pharmacology and therapeutics": '#e0e7ff',
    "Prescribing": '#e0e7ff',
    "Professional knowledge": '#dbeafe',
    "Public health": '#dcfce7',
    "Renal and urological": '#cffafe',
    "Respiratory": '#dbeafe',
    "Surgery": '#fee2e2',
    "Values and behaviours": '#d1fae5'
  };

  // Get consistent color for a subject with darker border
  const getSubjectColor = (subject: string) => {
    return SUBJECT_COLORS[subject] || '#a1a1aa'; // Default light gray for unknown subjects
  };

  // Get subtle border color for subject
  const getSubjectBorderColor = (subject: string) => {
    const borderColors: {[key: string]: string} = {
      "Acute and emergency": '#f9a8d4',
      "Cancer": '#d8b4fe', 
      "Cardiovascular": '#93c5fd',
      "Child health": '#86efac',
      "Dermatology": '#fde68a',
      "Digital health": '#a5b4fc',
      "Ear, nose and throat": '#f9a8d4',
      "Endocrinology": '#67e8f9',
      "Ethics and law": '#bbf7d0',
      "Evidence-based practice": '#fef08a',
      "Gastroenterology": '#fdba74',
      "Genetics and genomics": '#d9f99d',
      "Global and population health": '#67e8f9',
      "Haematology": '#fca5a5',
      "Health promotion and illness prevention": '#d9f99d',
      "Immunology": '#fde68a',
      "Infectious disease": '#fca5a5',
      "Insights from humanities": '#a5b4fc',
      "Mental health": '#f9a8d4',
      "Metabolic health": '#fde68a',
      "Musculoskeletal": '#f9a8d4',
      "Neurology": '#a5b4fc',
      "Obstetrics and gynaecology": '#f9a8d4',
      "Ophthalmology": '#67e8f9',
      "Palliative and end of life care": '#d8b4fe',
      "Pharmacology and therapeutics": '#a5b4fc',
      "Prescribing": '#a5b4fc',
      "Professional knowledge": '#93c5fd',
      "Public health": '#bbf7d0',
      "Renal and urological": '#67e8f9',
      "Respiratory": '#93c5fd',
      "Surgery": '#fca5a5',
      "Values and behaviours": '#86efac'
    };
    
    return borderColors[subject] || '#d1d5db';
  };

  // Handle AI-powered schedule reflow
  const handleAiReflow = () => {
    // For now, just regenerate the timetable
    handleGenerate();
    
    toast({
      title: "Schedule reflowed",
      description: "Your timetable has been reorganized with AI assistance",
    });
  };
  
  // Render event content function for FullCalendar
  const renderEventContent = (eventInfo: any) => {
    const event = eventInfo.event;
    const isHoliday = event.extendedProps?.isHoliday;
    
    if (isHoliday) {
      return (
        <div className="w-full h-full p-1 flex items-center justify-center text-white">
          <div className="text-sm font-semibold">{event.title}</div>
        </div>
      );
    }
    
    return (
      <div className="w-full h-full p-1 cursor-pointer transition-opacity hover:opacity-90">
        <div className="text-sm font-semibold">
          {event.title}
        </div>
      </div>
    );
  };
  
  // Handle adding AI-suggested event
  const handleAddAiEvent = (event: any) => {
    // Convert AI event to calendar event
    const newEvent: CalendarEvent = {
      id: generateId(),
      title: event.title,
      start: `${event.date}T${event.startTime}`,
      end: `${event.date}T${event.endTime}`,
      backgroundColor: event.type === 'personal' ? '#3b82f6' : 
                      event.type === 'placement' ? '#10b981' :
                      event.type === 'meal' ? '#f97316' :
                      event.type === 'sleep' ? '#9333ea' : '#64748b',
      borderColor: event.type === 'personal' ? '#2563eb' : 
                  event.type === 'placement' ? '#059669' :
                  event.type === 'meal' ? '#ea580c' :
                  event.type === 'sleep' ? '#7e22ce' : '#475569',
      extendedProps: {
        isHoliday: false
      }
    };
    
    // Add to user events
    const userEvent: UserEvent = {
      name: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      recurringWeekly: event.recurring || false,
      type: event.type
    };
    
    setUserEvents(prev => [...prev, userEvent]);
    
    // If it's recurring, create events for each day
    if (event.recurring && event.recurringDays?.length) {
      // Handle recurring events (implementation depends on your needs)
      // This is a placeholder
      toast({
        title: "Recurring event added",
        description: `${event.title} has been added to your schedule on ${event.recurringDays.join(', ')}`,
      });
    } else {
      // Add to calendar
      setHolidayEvents(prev => [...prev, newEvent]);
      
      toast({
        title: "Event added",
        description: `${event.title} has been added to your schedule`,
      });
    }
    
    // Reflow the schedule if needed
    if (studyEvents.length > 0) {
      handleGenerate();
    }
  };

  // Handle lifestyle settings
  const handleLifestyleSettings = () => {
    setIsLifestyleSettingsOpen(true);
  };

  // Handle exam mode - redirect to settings
  const handleExamMode = () => {
    window.location.href = '/settings';
  };
  
  // UI for the application
  return (
    <div className={`container mx-auto p-4 space-y-4 max-w-full overflow-y-auto transition-all duration-300 ${
      isExamMode ? 'exam-mode dark:bg-slate-900' : ''
    }`}>
      {/* Exam Countdown Box - Only shows if there's an upcoming exam */}
      {examDates.length > 0 && examDates.some(exam => new Date(exam.date) > new Date()) && (
        <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-200 mb-3">
          {(() => {
            const closestExam = examDates
              .filter(exam => new Date(exam.date) > new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
            
            if (!closestExam) return null;
            
            const daysUntil = differenceInDays(new Date(closestExam.date), new Date());
            const weekColor = daysUntil <= 7 ? 'bg-red-50 text-red-700 border-red-200' : 
                             daysUntil <= 14 ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                             'bg-blue-50 text-blue-700 border-blue-200';
            
            return (
              <div className="flex flex-wrap gap-4">
                <div className="flex-shrink-0 w-24 flex flex-col items-center justify-center">
                  <div className={`p-2 rounded-full ${weekColor} flex flex-col items-center justify-center w-16 h-16`}>
                    <span className="text-lg font-bold">{daysUntil}</span>
                    <span className="text-[10px]">days left</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-slate-500">Upcoming Exam</h3>
                  <h4 className="text-lg font-bold text-slate-800">{closestExam.name}</h4>
                  <p className="text-xs text-slate-500">{format(new Date(closestExam.date), 'MMMM do, yyyy')}</p>
                  
                  {closestExam.subjects.length > 0 && (
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-1">
                        {closestExam.subjects.slice(0, 3).map(subject => (
                          <Badge key={subject} variant="outline" className="text-xs bg-slate-50 border-slate-200">
                            {subject}
                          </Badge>
                        ))}
                        {closestExam.subjects.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{closestExam.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
      


      {/* Action Buttons Row */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {/* AI Planning Button */}
            <Button 
              variant="outline"
              className="border-theme/30 hover:bg-theme/5 text-theme"
              onClick={() => setIsAiPlanningOpen(true)}
            >
              <Zap className="mr-2 h-4 w-4" />
              AI Planning
            </Button>
            
            {/* Configuration Settings Button */}
            <Button 
              variant="outline"
              className="border-theme/30 hover:bg-theme/5 text-theme"
              onClick={() => setIsConfigOpen(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configuration Settings
            </Button>
            
            {/* Lifestyle Settings Button */}
            <Button 
              variant="outline"
              className="border-theme/30 hover:bg-theme/5 text-theme"
              onClick={handleLifestyleSettings}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Lifestyle Settings
            </Button>
            
            {/* Exam Mode Button */}
            <Button 
              variant={isExamMode ? "default" : "outline"}
              className={isExamMode ? "bg-theme text-white hover:bg-theme/90" : "border-theme/30 hover:bg-theme/5 text-theme"}
              onClick={handleExamMode}
            >
              <Trophy className="mr-2 h-4 w-4" />
              {isExamMode ? "Exam Mode Active" : "Exam Mode Settings"}
            </Button>
          </div>
          
          {/* Next Exam Box */}
          <div className="bg-white rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {(() => {
              const nextExam = examDates
                .filter(exam => new Date(exam.date) > new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
              
              if (nextExam) {
                const daysUntil = Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <span className="text-slate-600">
                    <span className="font-medium text-slate-800">{daysUntil}</span> days to next exam
                  </span>
                );
              } else {
                return <span className="text-slate-500">No exam scheduled</span>;
              }
            })()}
          </div>
        </div>
      </div>

      {/* Full-Page Calendar */}
      <div className="bg-white rounded-xl shadow-lg border border-theme/10 overflow-hidden" style={{ height: 'calc(100vh - 180px)', minHeight: '600px' }}>
        <FullCalendar
              ref={setCalendarRef}
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, timelinePlugin]}
              initialView="timeGridDay"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
              }}
              views={{
                timeGridDay: {
                  buttonText: 'Day'
                },
                timeGridWeek: {
                  buttonText: 'Week'
                },
                dayGridMonth: {
                  buttonText: 'Month',
                  dayMaxEvents: false,
                  dayMaxEventRows: false,
                  displayEventTime: false,
                  displayEventEnd: false,
                  eventDisplay: 'block'
                }
              }}
              events={allEvents}
              eventContent={renderEventContent}
              editable={true}
              eventDrop={handleEventDrop}
              eventClick={handleSessionClick}
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
              eventOverlap={false}
              slotEventOverlap={false}
              selectOverlap={false}
              eventMaxStack={1}
              dayMaxEvents={false}
              dayMaxEventRows={false}
              eventConstraint={{
                start: '06:00',
                end: '23:00'
              }}
              eventClassNames="single-subject-event"
              displayEventTime={true}
              displayEventEnd={false}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                hour12: true
              }}
            />
          </div>
          
          {/* Session Detail Dialog */}
          <Dialog open={isSessionDetailOpen} onOpenChange={setIsSessionDetailOpen}>
            <DialogContent className="sm:max-w-[550px]">
              {selectedEvent && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      <span className="text-primary">{selectedEvent.title}</span>
                    </DialogTitle>
                    <DialogDescription>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{selectedEvent.start ? format(selectedEvent.start, 'PPPP') : ''}</span>
                        <span>
                          {selectedEvent.start && selectedEvent.end ? 
                            `${format(selectedEvent.start, 'h:mm a')} - ${format(selectedEvent.end, 'h:mm a')}` : 
                            ''}
                        </span>
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
                        <ul className="space-y-2 list-disc list-inside mt-2">
                          {selectedEvent.topics?.map((topic: any, index: number) => (
                            <li key={index} className="text-xs">{topic.name}</li>
                          ))}
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
                        <ul className="space-y-2 list-disc list-inside">
                          {selectedEvent.topics?.filter((t: any) => t.type === 'main').map((topic: any, index: number) => (
                            <li key={index}>{topic.name}</li>
                          ))}
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
                        <ul className="space-y-2 list-disc list-inside mt-3 text-sm">
                          <li className="italic text-violet-700">Focus on related concepts:</li>
                          {selectedEvent.topics?.filter((t: any) => t.type === 'connection').map((topic: any, index: number) => (
                            <li key={index}>
                              {topic.connectionTopics?.map((connection: string) => {
                                const [subject, topicName] = connection.split(': ');
                                return <span key={connection}>{topicName} ({subject})</span>;
                              })}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button variant="secondary" className="w-full">
                      Mark as Completed
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

        {/* Configuration Settings Dialog */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configuration Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <StudyConfig
                  hoursPerWeek={hoursPerWeek}
                  onHoursPerWeekChange={setHoursPerWeek}
                  yearGroup={yearGroup}
                  onYearGroupChange={setYearGroup}
                  studyDays={studyDays}
                  onStudyDaysChange={setStudyDays}
                  onGenerate={handleGenerate}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Subject Selection</h3>
                <SelectSubjects
                  allSubjects={masterSubjects.map(subject => subject.name)}
                  selectedSubjects={selectedSubjects}
                  onSelectedSubjectsChange={setSelectedSubjects}
                />
                
                {/* Show selected subjects as bubbles */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSubjects.length > 0 ? (
                    selectedSubjects.map(subject => (
                      <div 
                        key={subject}
                        className="px-3 py-1 rounded-full text-sm bg-slate-100 border border-slate-200 flex items-center gap-1"
                        style={{ backgroundColor: getSubjectColor(subject) + '33', borderColor: getSubjectColor(subject) + '66' }}
                      >
                        <span className="font-medium" style={{ color: getSubjectColor(subject) }}>
                          {subject}
                        </span>
                        <button
                          onClick={() => setSelectedSubjects(prev => prev.filter(s => s !== subject))}
                          className="ml-1 text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No subjects selected</span>
                  )}
                </div>
              </div>
              

            </div>
          </DialogContent>
        </Dialog>

        {/* AI Planning Dialog */}
        <Dialog open={isAiPlanningOpen} onOpenChange={setIsAiPlanningOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-white" style={{ backgroundColor: 'white' }}>
            <DialogHeader>
              <DialogTitle>AI Timetable Assistant</DialogTitle>
            </DialogHeader>
            <div className="bg-white" style={{ backgroundColor: 'white' }}>
              <AIEventChat 
                onAddEvent={handleAddAiEvent}
                onReflowSchedule={handleAiReflow}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Lifestyle Settings Dialog */}
        <Dialog open={isLifestyleSettingsOpen} onOpenChange={setIsLifestyleSettingsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lifestyle & Break Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <BreakSettings
                preferences={lifestylePreferences}
                onChange={setLifestylePreferences}
              />
              
              <DialogFooter>
                <Button onClick={() => {
                  localStorage.setItem('user-preferences', JSON.stringify(lifestylePreferences));
                  toast({
                    title: "Settings saved",
                    description: "Your lifestyle preferences have been updated",
                  });
                  setIsLifestyleSettingsOpen(false);
                }}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }