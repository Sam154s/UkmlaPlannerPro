import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, SendIcon, X, Loader2, CalendarPlus } from "lucide-react";
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface ParsedEvent {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  recurring?: boolean;
  recurringDays?: string[];
  type: 'personal' | 'placement' | 'meal' | 'sleep';
}

interface AIChatProps {
  onAddEvent: (event: ParsedEvent) => void;
  onReflowSchedule: () => void;
}

export function AIEventChat({ onAddEvent, onReflowSchedule }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I can help you add events to your schedule. Try saying something like "I have a gym session on Wednesday at 7pm for 1 hour" or "Add placement hours Monday to Friday 8am-12pm".',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleMessageSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Call the backend AI chat endpoint
      const response = await fetch('/api/chat-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      
      // Add AI response message
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message || "I'm having trouble understanding that. Could you try again with a simpler format like 'Add [event] on [day] at [time] for [duration]'?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // If events were parsed, add them to state
      if (data.events && Array.isArray(data.events) && data.events.length > 0) {
        setParsedEvents(data.events);
      }
    } catch (error) {
      console.error('Error in AI Chat:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: "I'm having trouble processing your request. Please try again or use the manual event form instead.",
          timestamp: new Date(),
          status: 'error'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddEvent = (event: ParsedEvent) => {
    onAddEvent(event);
    // Remove from parsed events
    setParsedEvents(prev => prev.filter(e => 
      !(e.date === event.date && e.startTime === event.startTime && e.title === event.title)
    ));
    
    // Add confirmation message
    setMessages(prev => [
      ...prev,
      {
        role: 'system',
        content: `Event "${event.title}" on ${format(new Date(event.date), 'EEE, MMM d')} at ${event.startTime} was added to your schedule.`,
        timestamp: new Date()
      }
    ]);
    
    // Trigger reflow if we have events
    onReflowSchedule();
  };
  
  const handleDismissEvent = (event: ParsedEvent) => {
    // Remove from parsed events
    setParsedEvents(prev => prev.filter(e => 
      !(e.date === event.date && e.startTime === event.startTime && e.title === event.title)
    ));
    
    // Add dismissal message
    setMessages(prev => [
      ...prev,
      {
        role: 'system',
        content: `"${event.title}" was dismissed.`,
        timestamp: new Date()
      }
    ]);
  };
  
  const formatEventTime = (event: ParsedEvent) => {
    const formattedDate = format(new Date(event.date), 'EEE, MMM d');
    const timeRange = `${event.startTime} - ${event.endTime}`;
    
    if (event.recurring) {
      return `${event.recurringDays?.join(', ')} at ${timeRange}, recurring weekly`;
    }
    
    return `${formattedDate} at ${timeRange}`;
  };
  
  return (
    <>
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-40"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="fixed bottom-4 right-4 w-80 sm:w-96 shadow-lg z-40 flex flex-col max-h-[70vh]">
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-md">Add Events with AI</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-3 overflow-y-auto flex-1">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div 
                  key={i} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : message.role === 'system'
                          ? 'bg-muted text-muted-foreground text-xs italic'
                          : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {format(message.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              
              {/* Parsed Events */}
              {parsedEvents.length > 0 && (
                <div className="my-2 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Detected events:</p>
                  {parsedEvents.map((event, i) => (
                    <div key={i} className="border rounded-md p-2 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{formatEventTime(event)}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleDismissEvent(event)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleAddEvent(event)}
                        >
                          <CalendarPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-0">
            <form className="flex items-center w-full gap-2" onSubmit={handleMessageSubmit}>
              <Textarea 
                placeholder="Type your event details..."
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 min-h-10 h-10 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleMessageSubmit();
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}