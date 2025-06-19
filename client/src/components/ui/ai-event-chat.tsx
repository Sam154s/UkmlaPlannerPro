import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, Bot } from 'lucide-react';
import { api } from '@/lib/apiClient';

interface AIEventChatProps {
  onEventsCreated: (events: any[]) => void;
}

export default function AIEventChat({ onEventsCreated }: AIEventChatProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      if (import.meta.env.VITE_OPENAI_ENABLED === 'true') {
        const result = await api.post('/api/ai/chat', {
          message,
          context: 'schedule_management'
        });
        
        setResponse(result.data.message);
        if (result.data.events && result.data.events.length > 0) {
          onEventsCreated(result.data.events);
        }
      } else {
        setResponse('AI chat is disabled. Please enable OpenAI in your environment variables.');
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
          <Bot className="h-5 w-5" />
          AI Event Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {import.meta.env.VITE_OPENAI_ENABLED !== 'true' && (
          <Alert>
            <AlertDescription>
              Enable OpenAI in .env to use AI features
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add lunch every Tuesday at 12:30..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !message.trim()}>
            {isLoading ? '...' : <Send className="h-4 w-4" />}
          </Button>
        </form>

        {response && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}