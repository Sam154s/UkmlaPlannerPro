import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, Settings, Calendar } from 'lucide-react';
import CalendarView from '@/components/CalendarView';
import SessionModal from '@/components/SessionModal';
import { StudyConfig } from '@/components/ui/study-config';
import { useTimetable, useUserEvents } from '@/hooks/useTimetable';
import { generateSpiralTimetable, mapToEvents, StudySession, type SpiralConfig } from '@/services/spiral';
import masterSubjects from '@/data/masterSubjects';
import { BASE_BLOCK_COUNTS, YEAR_MULTIPLIERS } from '@/data/studyBlockCounts';
import { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';

export default function TimetablePage() {
  // React Query hooks
  const { timetable, isLoading, generateTimetable } = useTimetable();
  const { userEvents } = useUserEvents();
  
  // State management
  const [studyBlocks, setStudyBlocks] = useState<StudySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState({
    hoursPerWeek: 20,
    studyDays: [1, 2, 3, 4, 5], // Monday to Friday
    yearGroup: 5, // 5th year default
    favouriteSubjects: [] as string[],
    selectedSubjects: masterSubjects.map((s: any) => s.name),
  });

  // React Query hooks
  const { data: timetableData, isLoading: timetableLoading, error: timetableError } = useTimetableQuery();
  const { data: userEvents = [], isLoading: eventsLoading } = useUserEventsQuery();
  const saveTimetableMutation = useSaveTimetableMutation();
  const saveEventsMutation = useSaveEventsMutation();

  // Load saved timetable data
  useEffect(() => {
    if (timetableData?.blocks) {
      setStudyBlocks(timetableData.blocks);
    }
    if (timetableData?.config) {
      setConfig(prev => ({ ...prev, ...timetableData.config }));
    }
  }, [timetableData]);

  // Generate new timetable
  const handleGenerateTimetable = async () => {
    setIsGenerating(true);
    try {
      const selectedSubjectsData = masterSubjects.filter(subject => 
        config.selectedSubjects.includes(subject.name)
      );

      const blocksTable = Object.fromEntries(
        selectedSubjectsData.map(subject => [
          subject.name,
          BASE_BLOCK_COUNTS[subject.name] || 4
        ])
      );

      const yearMultiplier = YEAR_MULTIPLIERS[config.yearGroup - 1] || 1.0;

      const generatedBlocks = generateSpiral({
        hoursPerWeek: config.hoursPerWeek,
        studyDays: config.studyDays,
        yearMultiplier,
        subjects: selectedSubjectsData,
        blocksTable,
        favouriteSubjects: config.favouriteSubjects,
      });

      setStudyBlocks(generatedBlocks);

      // Save to backend
      saveTimetableMutation.mutate({
        config,
        blocks: generatedBlocks,
      });

    } catch (error) {
      console.error('Error generating timetable:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Calendar event handlers
  const handleEventClick = (eventClickInfo: EventClickArg) => {
    const { event } = eventClickInfo;
    const { extendedProps } = event;

    if (extendedProps.type === 'study' || extendedProps.type === 'review') {
      setSelectedSession({
        id: event.id,
        subject: extendedProps.subject,
        topics: extendedProps.topics,
        minutes: extendedProps.minutes,
        date: event.startStr.split('T')[0],
        startTime: event.start?.toTimeString().slice(0, 5) || '',
        endTime: event.end?.toTimeString().slice(0, 5) || '',
        isReview: extendedProps.isReview,
        type: extendedProps.type,
      });
      setShowSessionModal(true);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt('Enter event title:');
    if (title) {
      const newEvent = {
        id: `user-${Date.now()}`,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        description: '',
      };

      const updatedEvents = [...userEvents, newEvent];
      saveEventsMutation.mutate(updatedEvents);
    }
    selectInfo.view.calendar.unselect();
  };

  const handleEventDrop = (eventDropInfo: EventDropArg) => {
    // Handle event rescheduling
    console.log('Event dropped:', eventDropInfo);
  };

  const handleConfigSave = (newConfig: any) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    setShowConfig(false);
  };

  if (timetableLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (timetableError) {
    return (
      <Alert className="m-6">
        <AlertDescription>
          Error loading timetable data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Timetable</h1>
          <p className="text-muted-foreground">
            Manage your UKMLA revision schedule
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowConfig(true)}
            disabled={isGenerating}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button
            onClick={handleGenerateTimetable}
            disabled={isGenerating || saveTimetableMutation.isPending}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Generate Timetable
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {Math.round(studyBlocks.reduce((sum, block) => sum + block.minutes, 0) / 60)}h
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(studyBlocks.map(block => block.subject)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{config.hoursPerWeek}h</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Study Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView
            events={studyBlocks}
            userEvents={userEvents}
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
            onEventDrop={handleEventDrop}
          />
        </CardContent>
      </Card>

      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <StudyConfig
              hoursPerWeek={config.hoursPerWeek}
              yearGroup={config.yearGroup}
              studyDays={config.studyDays}
              onHoursPerWeekChange={(hours) => setConfig(prev => ({ ...prev, hoursPerWeek: hours }))}
              onYearGroupChange={(group) => setConfig(prev => ({ ...prev, yearGroup: group }))}
              onStudyDaysChange={(days) => setConfig(prev => ({ ...prev, studyDays: days }))}
              onGenerate={() => {
                setShowConfig(false);
                handleGenerateTimetable();
              }}
            />
            <div className="p-4 border-t">
              <Button variant="outline" onClick={() => setShowConfig(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Session Modal */}
      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        session={selectedSession}
      />
    </div>
  );
}