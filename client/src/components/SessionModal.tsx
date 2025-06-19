import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, BookOpen, Star } from 'lucide-react';
import { usePerformanceMutation } from '@/hooks/use-timetable';
import { getSubjectColor } from '@/constants/colors';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    id: string;
    subject: string;
    topics: string[];
    minutes: number;
    date: string;
    startTime: string;
    endTime: string;
    isReview: boolean;
    type?: string;
  } | null;
}

export default function SessionModal({ isOpen, onClose, session }: SessionModalProps) {
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const performanceMutation = usePerformanceMutation();

  if (!session) return null;

  const handleTopicComplete = (topic: string) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topic)) {
      newCompleted.delete(topic);
    } else {
      newCompleted.add(topic);
    }
    setCompletedTopics(newCompleted);
  };

  const handleMarkAsCompleted = () => {
    const performanceData = {
      sessionId: session.id,
      subject: session.subject,
      topics: Array.from(completedTopics),
      date: session.date,
      minutes: session.minutes,
      completionRate: completedTopics.size / session.topics.length,
    };

    performanceMutation.mutate(performanceData, {
      onSuccess: () => {
        onClose();
        setCompletedTopics(new Set());
      },
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getSubjectColor(session.subject) }}
            />
            {session.subject}
            {session.isReview && (
              <Badge variant="secondary" className="ml-2">
                <Star className="w-3 h-3 mr-1" />
                Review
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time:</span>
                <span className="font-medium">
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="font-medium">{formatDuration(session.minutes)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Topics ({session.topics.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {session.topics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="flex-1">{topic}</span>
                    <Button
                      variant={completedTopics.has(topic) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTopicComplete(topic)}
                      className="ml-3"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {completedTopics.has(topic) ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          {completedTopics.size > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((completedTopics.size / session.topics.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {completedTopics.size} of {session.topics.length} topics completed
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {completedTopics.size > 0 && (
              <Button
                onClick={handleMarkAsCompleted}
                disabled={performanceMutation.isPending}
              >
                {performanceMutation.isPending ? 'Saving...' : 'Save Progress'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}