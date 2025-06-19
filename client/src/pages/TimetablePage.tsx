import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTimetable, useUserEvents } from '@/hooks/useTimetable';
import { generateSpiralTimetable, mapToEvents, type StudySession, type SpiralConfig } from '@/services/spiral';
import SessionModal from '@/components/SessionModal';
import SettingsDialog, { type StudySettings } from '@/components/SettingsDialog';
import masterSubjects from '@/data/masterSubjects';
import { BASE_BLOCK_COUNTS, YEAR_MULTIPLIERS } from '@/data/studyBlockCounts';
import { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { Settings, RefreshCw } from 'lucide-react';

export default function TimetablePage() {
  // React Query hooks
  const { timetable, isLoading, generateTimetable } = useTimetable();
  const { userEvents } = useUserEvents();
  
  // State management
  const [studyBlocks, setStudyBlocks] = useState<StudySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  
  // Settings management
  const [settings, setSettings] = useState<StudySettings>({
    hoursPerWeek: 20,
    studyDays: [1, 2, 3, 4, 5], // Mon-Fri
    startDate: new Date().toISOString().split('T')[0],
    yearGroup: 5,
    favouriteSubjects: []
  });

  // Load timetable data when available
  useEffect(() => {
    if (timetable && Array.isArray(timetable)) {
      setStudyBlocks(timetable);
    }
  }, [timetable]);

  // Generate new timetable
  const handleGenerateTimetable = async () => {
    const selectedSubjectsData = masterSubjects.filter(subject => 
      settings.favouriteSubjects.includes(subject.name) || settings.favouriteSubjects.length === 0
    );

    const blocksTable = Object.fromEntries(
      selectedSubjectsData.map(subject => [
        subject.name,
        BASE_BLOCK_COUNTS[subject.name] || 4
      ])
    );

    const yearMultiplier = YEAR_MULTIPLIERS[settings.yearGroup - 1] || 1.0;

    const config: SpiralConfig = {
      hoursPerWeek: settings.hoursPerWeek,
      studyDays: settings.studyDays,
      yearMultiplier,
      subjects: selectedSubjectsData,
      blocksTable,
      favouriteSubjects: settings.favouriteSubjects,
    };

    generateTimetable(config);
  };

  const handleEventClick = (eventClickInfo: EventClickArg) => {
    const session = eventClickInfo.event.extendedProps.session;
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Handle date selection for new events
    console.log('Date selected:', selectInfo);
  };

  const handleEventDrop = (eventDropInfo: EventDropArg) => {
    // Handle event dragging
    console.log('Event dropped:', eventDropInfo);
  };

  const handleSettingsChange = (newSettings: StudySettings) => {
    setSettings(newSettings);
  };

  // Convert sessions to calendar events
  const calendarEvents = [
    ...mapToEvents(studyBlocks),
    ...(userEvents || []).map((event: any) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: '#6B7280',
    }))
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Timetable</h1>
            <p className="text-muted-foreground">
              Your personalized UKMLA revision schedule
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSettingsDialog(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            
            <Button
              onClick={handleGenerateTimetable}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Generating...' : 'Generate Timetable'}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyBlocks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(studyBlocks.reduce((total, session) => total + session.minutes, 0) / 60)}h
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Subjects Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(studyBlocks.map(session => session.subject)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              select={handleDateSelect}
              eventDrop={handleEventDrop}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              slotMinTime="17:00:00"
              slotMaxTime="23:00:00"
              height="600px"
              eventDisplay="block"
              displayEventTime={true}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        <SessionModal
          isOpen={showSessionModal}
          onClose={() => setShowSessionModal(false)}
          session={selectedSession}
        />
        
        <SettingsDialog
          isOpen={showSettingsDialog}
          onClose={() => setShowSettingsDialog(false)}
          onSettingsChange={handleSettingsChange}
          currentSettings={settings}
        />
      </div>
    </div>
  );
}