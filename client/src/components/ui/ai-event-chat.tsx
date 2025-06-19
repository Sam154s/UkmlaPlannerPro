import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { api } from '@/lib/apiClient';

interface AIEventChatProps {
  onEventsCreated: (events: any[]) => void;
}

export default function AIEventChat({ onEventsCreated }: AIEventChatProps) {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      if (import.meta.env.VITE_OPENAI_ENABLED === 'true') {
        const result = await api.post('/ai/suggest', {
          message,
          context: 'schedule_management'
        });
        
        setResponse(result.data.message);
        if (result.data.events && result.data.events.length > 0) {
          onEventsCreated(result.data.events);
        }
      } else {
        setResponse('Enable OpenAI in .env to use AI features');
      }
    } catch (error) {
      setResponse('Sorry, I cannot process your request right now. Please try again later.');
    }

    setIsLoading(false);
    setMessage('');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Study Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your study schedule..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !message.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        {response && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            {response}
          </div>
        )}
      </CardContent>
    </Card>
  );
}