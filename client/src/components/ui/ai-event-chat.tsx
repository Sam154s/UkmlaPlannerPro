import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, SendIcon, X, Loader2, CalendarPlus, Sparkles, Clock, Calendar, MapPin, Info, Brain } from "lucide-react";
import { format, addDays, parseISO, formatISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
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
  type: 'personal' | 'placement' | 'meal' | 'sleep' | 'study';
  description?: string;
  color?: string;
}

interface AIChatProps {
  onAddEvent: (event: ParsedEvent) => void;
  onReflowSchedule: () => void;
}

// Generate a random ID for messages
const generateId = () => Math.random().toString(36).substr(2, 9);

export function AIEventChat({ onAddEvent, onReflowSchedule }: AIChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Hi! I can help you add events to your schedule or manage your study timetable. You can say things like:',
      timestamp: new Date()
    },
    {
      id: generateId(),
      role: 'assistant',
      content: '• "Add gym session on Wednesday at 7pm for 1 hour"\n• "Schedule placement hours Mon-Fri 8am-12pm"\n• "Create study block for Cardiology on Saturday at 2pm"\n• "Add exam prep session for 2 hours tomorrow morning"',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([]);
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleMessageSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // This is a mock implementation - in a real app, this would call the backend
      const mockParseEvent = (input: string): [ParsedEvent[], string] => {
        // Very simplistic parsing - real implementation would use NLP or AI
        const eventTypes = ['personal', 'placement', 'meal', 'sleep', 'study'] as const;
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        let mockEvent: ParsedEvent | null = null;
        let responseMessage = '';
        
        // Create date for "tomorrow"
        const tomorrow = addDays(new Date(), 1);
        
        if (input.toLowerCase().includes('gym') || input.toLowerCase().includes('workout')) {
          mockEvent = {
            title: 'Gym Session',
            date: formatISO(tomorrow, { representation: 'date' }),
            startTime: '18:00',
            endTime: '19:00',
            type: 'personal',
            color: '#f87171'
          };
          responseMessage = `I've scheduled a gym session for tomorrow from 6:00 PM to 7:00 PM. Would you like to add this to your calendar?`;
        } 
        else if (input.toLowerCase().includes('placement') || input.toLowerCase().includes('hospital')) {
          mockEvent = {
            title: 'Hospital Placement',
            date: formatISO(tomorrow, { representation: 'date' }),
            startTime: '08:00',
            endTime: '12:00',
            type: 'placement',
            recurring: true,
            recurringDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            color: '#60a5fa'
          };
          responseMessage = `I've created a recurring hospital placement for weekdays from 8:00 AM to 12:00 PM. Would you like to add this to your schedule?`;
        }
        else if (input.toLowerCase().includes('study') || input.toLowerCase().includes('revision')) {
          // Extract subject if mentioned
          const subjects = ['Cardiology', 'Neurology', 'Respiratory', 'Gastroenterology', 'Endocrinology'];
          const mentionedSubject = subjects.find(subject => 
            input.toLowerCase().includes(subject.toLowerCase())
          ) || 'General Medicine';
          
          mockEvent = {
            title: `${mentionedSubject} Study`,
            date: formatISO(tomorrow, { representation: 'date' }),
            startTime: '14:00',
            endTime: '16:00',
            type: 'study',
            color: '#a78bfa'
          };
          responseMessage = `I've scheduled a ${mentionedSubject} study session for tomorrow from 2:00 PM to 4:00 PM. Would you like to add this to your calendar?`;
        }
        else if (input.toLowerCase().includes('exam') || input.toLowerCase().includes('test')) {
          mockEvent = {
            title: 'Exam Preparation',
            date: formatISO(tomorrow, { representation: 'date' }),
            startTime: '09:00',
            endTime: '11:00',
            type: 'study',
            color: '#fbbf24'
          };
          responseMessage = `I've scheduled an exam preparation session for tomorrow from 9:00 AM to 11:00 AM. Would you like to add this to your calendar?`;
        }
        else {
          // Generic event if no specific type detected
          mockEvent = {
            title: 'New Event',
            date: formatISO(tomorrow, { representation: 'date' }),
            startTime: '12:00',
            endTime: '13:00',
            type: 'personal',
            color: '#a3e635'
          };
          responseMessage = `I've created a new event for tomorrow from 12:00 PM to 1:00 PM. Would you like to add this to your schedule?`;
        }
        
        return mockEvent ? [[mockEvent], responseMessage] : [[], "I couldn't understand that. Could you try again with a simpler format?"];
      };
      
      try {
        // In a real app, this would be an API call
        const [events, message] = mockParseEvent(inputValue);
        
        // Add AI response message
        const aiMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: message,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // If events were parsed, add them to state
        if (events.length > 0) {
          setParsedEvents(events);
        }
      } catch (error) {
        console.error('Error in AI Chat:', error);
        
        // Add error message
        setMessages(prev => [
          ...prev, 
          {
            id: generateId(),
            role: 'assistant',
            content: "I'm having trouble processing your request. Please try again with a simpler format.",
            timestamp: new Date(),
            status: 'error'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
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
        id: generateId(),
        role: 'system',
        content: `Added "${event.title}" on ${format(parseISO(event.date), 'EEE, MMM d')} at ${event.startTime} to your schedule.`,
        timestamp: new Date()
      }
    ]);
    
    // Show toast
    toast({
      title: "Event Added",
      description: `${event.title} has been added to your calendar.`,
    });
    
    // Trigger reflow of the schedule
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
        id: generateId(),
        role: 'system',
        content: `"${event.title}" was dismissed.`,
        timestamp: new Date()
      }
    ]);
  };
  
  const formatEventTime = (event: ParsedEvent) => {
    try {
      const formattedDate = format(parseISO(event.date), 'EEE, MMM d');
      const startTime = format(new Date(`2000-01-01T${event.startTime}`), 'h:mm a');
      const endTime = format(new Date(`2000-01-01T${event.endTime}`), 'h:mm a');
      const timeRange = `${startTime} - ${endTime}`;
      
      if (event.recurring && event.recurringDays?.length) {
        return `${event.recurringDays.join(', ')} at ${timeRange}, recurring weekly`;
      }
      
      return `${formattedDate} at ${timeRange}`;
    } catch (error) {
      return `${event.date} from ${event.startTime} to ${event.endTime}`;
    }
  };
  
  const getEventIcon = (eventType: ParsedEvent['type']) => {
    switch (eventType) {
      case 'personal':
        return <MapPin className="h-3 w-3" />;
      case 'placement':
        return <Info className="h-3 w-3" />;
      case 'meal':
        return <span className="text-xs">🍽️</span>;
      case 'sleep':
        return <span className="text-xs">😴</span>;
      case 'study':
        return <Brain className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };
  
  const getEventBadgeColor = (eventType: ParsedEvent['type']) => {
    switch (eventType) {
      case 'personal':
        return "bg-red-100 text-red-800 border-red-200";
      case 'placement':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'meal':
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 'sleep':
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case 'study':
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const quickPrompts = [
    { text: "Schedule studying", icon: <Brain className="h-3 w-3" /> },
    { text: "Add placement", icon: <Info className="h-3 w-3" /> },
    { text: "Block personal time", icon: <MapPin className="h-3 w-3" /> },
    { text: "Set exam date", icon: <Calendar className="h-3 w-3" /> }
  ];
  
  return (
    <div className="h-full flex flex-col">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Timetable Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 overflow-y-auto flex-1 min-h-[400px] max-h-[calc(85vh-180px)]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : message.role === 'system'
                      ? 'bg-slate-100 text-slate-700 text-xs italic'
                      : 'bg-slate-200 text-slate-800'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {format(message.timestamp, 'h:mm a')}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          
          {/* Detected Events */}
          {parsedEvents.length > 0 && (
            <div className="my-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Detected Events</p>
              {parsedEvents.map((event, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`px-2 py-0.5 text-xs flex items-center gap-1 ${getEventBadgeColor(event.type)}`}
                        >
                          {getEventIcon(event.type)}
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        {event.recurring && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-900">{event.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatEventTime(event)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        onClick={() => handleDismissEvent(event)}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-3 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        onClick={() => handleAddEvent(event)}
                      >
                        <CalendarPlus className="h-3 w-3 mr-1" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-center py-3">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-full">
                <Loader2 className="h-3 w-3 animate-spin text-slate-500" />
                <span className="text-xs text-slate-600">AI assistant is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-b">
        <p className="text-xs font-medium text-slate-500 mb-2">Quick Prompts</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, i) => (
            <Button 
              key={i}
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-slate-50 hover:bg-slate-100 border-slate-200"
              onClick={() => setInputValue(prompt.text)}
            >
              {prompt.icon}
              <span className="ml-1">{prompt.text}</span>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Input Form */}
      <CardFooter className="p-4 pt-3 mt-auto">
        <form className="flex items-end w-full gap-2" onSubmit={handleMessageSubmit}>
          <Textarea 
            ref={inputRef}
            placeholder="Ask the AI assistant to schedule events..."
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 min-h-[60px] max-h-32 resize-none border-slate-300 focus-visible:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleMessageSubmit();
              }
            }}
          />
          <Button 
            type="submit" 
            className="h-10 px-4"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? 
              <Loader2 className="h-4 w-4 animate-spin mr-1" /> : 
              <SendIcon className="h-4 w-4 mr-1" />
            }
            Send
          </Button>
        </form>
      </CardFooter>
    </div>
  );
}