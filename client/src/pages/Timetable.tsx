import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button } from '@/components/ui/button';
import { SelectSubjects } from '@/components/ui/select-subjects';
import { StudyConfig } from '@/components/ui/study-config';
import masterSubjects from '@/data/masterSubjects';
import { generateSpiralTimetable } from '@/utils/spiralAlgorithm';

export default function Timetable() {
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [yearMultiplier, setYearMultiplier] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const handleGenerate = () => {
    const blocks = generateSpiralTimetable({
      weeklyStudyHours: weeklyHours,
      yearMultiplier,
      favouriteSubjects: selectedSubjects,
      subjectsData: masterSubjects
    });

    const calendarEvents = blocks.map(block => ({
      title: `${block.subject} (${block.hours}hrs)`,
      start: `${block.date}T${block.startTime}`,
      end: `${block.date}T${block.endTime}`,
      backgroundColor: getSubjectColor(block.subject)
    }));

    setEvents(calendarEvents);
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      Cardiology: '#ff6b6b',
      Respiratory: '#4ecdc4',
      Neurology: '#45b7d1',
      Endocrinology: '#96ceb4',
      Gastroenterology: '#ffeead'
    };
    return colors[subject as keyof typeof colors] || '#666';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Study Planner</h2>

        <div className="space-y-4">
          <StudyConfig
            weeklyHours={weeklyHours}
            yearMultiplier={yearMultiplier}
            onWeeklyHoursChange={setWeeklyHours}
            onYearMultiplierChange={setYearMultiplier}
          />

          <SelectSubjects
            subjects={Object.keys(masterSubjects)}
            selectedSubjects={selectedSubjects}
            onChange={setSelectedSubjects}
          />

          <Button 
            className="w-full"
            onClick={handleGenerate}
            disabled={weeklyHours <= 0}
          >
            Generate Timetable
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow">
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'timeGridWeek'
            }}
            events={events}
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