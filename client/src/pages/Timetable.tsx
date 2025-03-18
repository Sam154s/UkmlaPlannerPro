import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
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
import '../styles/calendar.css';

export default function Timetable() {
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [yearGroup, setYearGroup] = useState(1);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [revisionCount, setRevisionCount] = useState(0);
  const [calendarRef, setCalendarRef] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleGenerate = () => {
    const blocks = generateSpiralTimetable({
      weeklyStudyHours: weeklyHours,
      yearGroup,
      daysPerWeek,
      favouriteSubjects: selectedSubjects,
      subjectsData: masterSubjects,
      revisionCount: revisionCount
    });

    const calendarEvents = blocks.map(block => ({
      title: block.subject,
      start: `${block.date}T${block.startTime}`,
      end: `${block.date}T${block.endTime}`,
      backgroundColor: getSubjectColor(block.subject),
      extendedProps: {
        topics: block.topics
      }
    }));

    setEvents(calendarEvents);
    setRevisionCount(prev => prev + 1);

    if (calendarRef) {
      const calendarApi = calendarRef.getApi();
      calendarApi.today();
    }
  };

  const handleEventDrop = (eventDropInfo: any) => {
    const { event } = eventDropInfo;
    setEvents(prev => prev.map((ev: any) => {
      if (ev.start === event.oldStart && ev.end === event.oldEnd) {
        return {
          ...ev,
          start: event.start,
          end: event.end
        };
      }
      return ev;
    }));
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      "Acute and emergency": '#8b5cf6',
      "Cancer": '#6366f1',
      "Cardiovascular": '#3b82f6',
      "Child health": '#06b6d4',
      "Neuroscience": '#0ea5e9'
    };
    return colors[subject as keyof typeof colors] || '#666';
  };

  const getAvailableViews = () => {
    if (windowWidth < 640) {
      return {
        timeGridDay: { buttonText: 'Day' }
      };
    }
    return {
      timeGridDay: { buttonText: 'Day' },
      timeGridWeek: { buttonText: 'Week' },
      dayGridMonth: { buttonText: 'Month' }
    };
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient-theme">
          Study Planner
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure your study schedule
        </p>
        {revisionCount > 0 && (
          <p className="text-sm">
            Revision cycle: {revisionCount}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <Button
            className="w-full button-theme"
            onClick={handleGenerate}
            disabled={weeklyHours <= 0}
          >
            Generate Timetable
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-theme/10">
        <FullCalendar
          ref={setCalendarRef}
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView={windowWidth < 640 ? "timeGridDay" : "timeGridWeek"}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: windowWidth < 640 ? 'timeGridDay' : 'timeGridDay,timeGridWeek,dayGridMonth'
          }}
          views={getAvailableViews()}
          events={events}
          eventContent={renderEventContent}
          editable={true}
          eventDrop={handleEventDrop}
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="23:00:00"
          height="auto"
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
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  const topics = eventInfo.event.extendedProps.topics;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full h-full p-1">
            <div className="text-sm font-semibold">{eventInfo.event.title}</div>
            {topics.length > 0 && (
              <div className="text-xs mt-1 opacity-90">
                {topics[0].name}...
              </div>
            )}
          </div>
        </TooltipTrigger>
        {topics.length > 0 && (
          <TooltipContent className="w-64 bg-white/95 backdrop-blur-sm border shadow-lg">
            <div className="space-y-2">
              <p className="font-semibold text-sm">Topics:</p>
              <ul className="space-y-2">
                {topics.map((topic: any, index: number) => (
                  <li key={index} className="text-sm">
                    {topic.type === 'main' ? (
                      <span>{topic.name}</span>
                    ) : (
                      <div className="mt-1 pl-4 border-l-2 border-theme/20">
                        <p className="font-medium text-xs">Connections:</p>
                        <ul className="list-disc list-inside">
                          {topic.connectionTopics?.map((relatedTopic: string, idx: number) => (
                            <li key={idx} className="text-xs">{relatedTopic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}