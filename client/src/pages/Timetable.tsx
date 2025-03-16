import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button } from '@/components/ui/button';
import { SelectSubjects } from '@/components/ui/select-subjects';
import { StudyConfig } from '@/components/ui/study-config';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import masterSubjects from '@/data/masterSubjects';
import { generateSpiralTimetable } from '@/utils/spiralAlgorithm';

export default function Timetable() {
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [yearGroup, setYearGroup] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const handleGenerate = () => {
    const blocks = generateSpiralTimetable({
      weeklyStudyHours: weeklyHours,
      yearMultiplier: yearGroup,
      favouriteSubjects: selectedSubjects,
      subjectsData: masterSubjects
    });

    const calendarEvents = blocks.map(block => ({
      title: `${block.subject}: ${block.topic}`,
      start: `${block.date}T${block.startTime}`,
      end: `${block.date}T${block.endTime}`,
      backgroundColor: getSubjectColor(block.subject),
      extendedProps: {
        type: block.type,
        connectionTopics: block.connectionTopics
      }
    }));

    setEvents(calendarEvents);
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      "Acute and Emergency": '#8b5cf6',
      "Cancer": '#6366f1',
      "Cardiovascular": '#3b82f6',
      "Child health": '#06b6d4',
      "Neuroscience": '#0ea5e9'
    };
    return colors[subject as keyof typeof colors] || '#666';
  };

  const renderEventContent = (eventInfo: any) => {
    const isConnectionSession = eventInfo.event.extendedProps.type === 'connection';
    const connectionTopics = eventInfo.event.extendedProps.connectionTopics;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full h-full p-1">
              <div className="text-sm font-medium">{eventInfo.event.title}</div>
              {isConnectionSession && (
                <div className="text-xs mt-1 opacity-75">Connection Session</div>
              )}
            </div>
          </TooltipTrigger>
          {isConnectionSession && connectionTopics && (
            <TooltipContent>
              <div className="space-y-2">
                <p className="font-medium">Related Topics:</p>
                <ul className="list-disc list-inside">
                  {connectionTopics.map((topic: string, index: number) => (
                    <li key={index} className="text-sm">{topic}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
      {/* Sidebar */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Study Planner
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your study schedule
          </p>
        </div>

        <div className="space-y-4">
          <StudyConfig
            weeklyHours={weeklyHours}
            yearGroup={yearGroup}
            onWeeklyHoursChange={setWeeklyHours}
            onYearGroupChange={setYearGroup}
          />

          <SelectSubjects
            subjects={masterSubjects.map(subject => subject.name)}
            selectedSubjects={selectedSubjects}
            onChange={setSelectedSubjects}
          />

          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-200"
            onClick={handleGenerate}
            disabled={weeklyHours <= 0}
          >
            Generate Timetable
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-lg border border-purple-100">
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'timeGridWeek'
            }}
            events={events}
            eventContent={renderEventContent}
            allDaySlot={false}
            slotMinTime="09:00:00"
            slotMaxTime="18:00:00"
            height="auto"
            expandRows={true}
            stickyHeaderDates={true}
            weekends={false}
          />
        </div>
      </div>
    </div>
  );
}