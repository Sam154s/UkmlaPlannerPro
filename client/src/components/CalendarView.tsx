import { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { getSubjectColor, getEventColor } from '@/constants/colors';
import { StudySession } from '@/services/spiral';

interface CalendarViewProps {
  events: StudySession[];
  userEvents: any[];
  onEventClick: (eventClickInfo: EventClickArg) => void;
  onDateSelect: (selectInfo: DateSelectArg) => void;
  onEventDrop: (eventDropInfo: EventDropArg) => void;
}

export default function CalendarView({
  events,
  userEvents,
  onEventClick,
  onDateSelect,
  onEventDrop,
}: CalendarViewProps) {
  const calendarRef = useRef<FullCalendar>(null);

  // Convert SessionBlock[] to FullCalendar EventInput[]
  const calendarEvents: EventInput[] = [
    // Study session events
    ...events.map(session => ({
      id: `study-${session.subject}-${session.date}-${session.startTime}`,
      title: `${session.subject}${session.topics.length > 1 ? ` (${session.topics.length} topics)` : `: ${session.topics[0]}`}`,
      start: `${session.date}T${session.startTime}`,
      end: `${session.date}T${session.endTime}`,
      backgroundColor: session.isReview ? getEventColor('review') : getSubjectColor(session.subject),
      borderColor: session.isReview ? getEventColor('review') : getSubjectColor(session.subject),
      textColor: '#ffffff',
      extendedProps: {
        type: session.isReview ? 'review' : 'study',
        subject: session.subject,
        topics: session.topics,
        minutes: session.minutes,
        isReview: session.isReview,
      },
    })),
    // User events
    ...userEvents.map(event => ({
      id: `user-${event.id}`,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: getEventColor('user'),
      borderColor: getEventColor('user'),
      textColor: '#ffffff',
      extendedProps: {
        type: 'user',
        description: event.description,
      },
    })),
  ];

  useEffect(() => {
    // Auto-refresh calendar when events change
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  }, [events, userEvents]);

  return (
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={calendarEvents}
        eventClick={onEventClick}
        select={onDateSelect}
        eventDrop={onEventDrop}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        slotDuration="00:30:00"
        height="auto"
        eventDisplay="block"
        displayEventTime={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        nowIndicator={true}
        scrollTime="08:00:00"
        eventClassNames={(arg) => {
          const { type, isReview } = arg.event.extendedProps;
          return [
            'calendar-event',
            `event-${type}`,
            isReview ? 'event-review' : '',
          ].filter(Boolean);
        }}
      />
    </div>
  );
}