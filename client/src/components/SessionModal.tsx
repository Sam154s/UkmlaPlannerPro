import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, BookOpen, Calendar } from 'lucide-react';

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
    type?: string;
  } | null;
}

export default function SessionModal({ isOpen, onClose, session }: SessionModalProps) {
  if (!session) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Session
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{session.subject}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {session.type || 'Study'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(session.date).toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {session.startTime} - {session.endTime} ({formatDuration(session.minutes)})
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h4 className="font-medium mb-2">Topics Covered</h4>
            <div className="space-y-1">
              {session.topics.map((topic, index) => (
                <div key={index} className="text-sm p-2 bg-muted rounded">
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}