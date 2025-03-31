import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import masterSubjects, { Topic } from '@/data/masterSubjects';

export default function SubjectsRatings() {
  const [ratings, setRatings] = useState(() => {
    const stored = localStorage.getItem('subjectRatings');
    return stored ? JSON.parse(stored) : {};
  });

  const [examModeSettings, setExamModeSettings] = useState(() => {
    const stored = localStorage.getItem('examModeSettings');
    return stored ? JSON.parse(stored) : {};
  });
  
  // Load data from backend on component mount
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const apiModule = await import('../lib/api');
        const { api } = apiModule;
        
        // Load subject ratings
        api.subjects.get()
          .then(data => {
            if (data?.ratings) {
              setRatings(data.ratings);
              localStorage.setItem('subjectRatings', JSON.stringify(data.ratings));
            }
          })
          .catch(err => console.error('Error loading subject ratings:', err));
        
        // Load exam mode settings
        api.exams.get()
          .then(data => {
            if (data?.examModeSettings) {
              setExamModeSettings(data.examModeSettings);
              localStorage.setItem('examModeSettings', JSON.stringify(data.examModeSettings));
            }
          })
          .catch(err => console.error('Error loading exam settings:', err));
      } catch (error) {
        console.error('Error importing API module:', error);
      }
    };
    
    loadBackendData();
  }, []);

  const handleRatingChange = (
    subject: string,
    topicName: string,
    field: keyof Topic['ratings'],
    value: number
  ) => {
    const newRatings = {
      ...ratings,
      [subject]: {
        ...ratings[subject],
        [topicName]: {
          ...ratings[subject]?.[topicName],
          [field]: value
        }
      }
    };
    setRatings(newRatings);
    localStorage.setItem('subjectRatings', JSON.stringify(newRatings));
    
    // Save to backend API
    try {
      import('../lib/api').then(({ api }) => {
        api.subjects.save({ ratings: newRatings })
          .catch(err => console.error('Error saving subject ratings to API:', err));
      });
    } catch (error) {
      console.error('Error importing API module:', error);
    }
  };

  const handleExamModeToggle = (
    subject: string,
    topicName: string,
    isHighYield: boolean
  ) => {
    const newSettings = {
      ...examModeSettings,
      [subject]: {
        ...examModeSettings[subject],
        [topicName]: {
          ...examModeSettings[subject]?.[topicName],
          isHighYield,
          includeInExamRevision: isHighYield
        }
      }
    };
    setExamModeSettings(newSettings);
    localStorage.setItem('examModeSettings', JSON.stringify(newSettings));
    
    // Save to backend API
    try {
      import('../lib/api').then(({ api }) => {
        api.exams.save({ examModeSettings: newSettings })
          .catch(err => console.error('Error saving exam mode settings to API:', err));
      });
    } catch (error) {
      console.error('Error importing API module:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient-theme">
          Subjects & Ratings
        </h1>
        <p className="text-sm text-muted-foreground">
          Adjust difficulty ratings and exam mode settings for your subjects
        </p>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {masterSubjects.map((subject) => (
          <AccordionItem 
            key={subject.name} 
            value={subject.name}
            className="border rounded-lg overflow-hidden bg-white"
          >
            <AccordionTrigger 
              className="px-4 py-3 hover:no-underline transition-colors duration-200 bg-[rgb(var(--gradient-from)_/_0.08)] hover:bg-[rgb(var(--gradient-from)_/_0.16)]"
            >
              <h2 className="text-lg font-semibold">{subject.name}</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 space-y-6">
                {subject.topics.map((topic) => (
                  <div key={topic.name} className="space-y-4 border-b pb-4 last:border-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{topic.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`exam-mode-${subject.name}-${topic.name}`} className="text-sm">
                          Exam Mode
                        </Label>
                        <Switch
                          id={`exam-mode-${subject.name}-${topic.name}`}
                          checked={examModeSettings[subject.name]?.[topic.name]?.isHighYield ?? false}
                          onCheckedChange={(checked) => handleExamModeToggle(subject.name, topic.name, checked)}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {['difficulty', 'clinicalImportance', 'examRelevance'].map((field) => (
                        <div key={field} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="capitalize text-sm">
                              {field.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              value={
                                ratings[subject.name]?.[topic.name]?.[field as keyof Topic['ratings']] ??
                                topic.ratings[field as keyof Topic['ratings']]
                              }
                              onChange={(e) =>
                                handleRatingChange(subject.name, topic.name, field as keyof Topic['ratings'], Number(e.target.value))
                              }
                              className="w-16 h-8 text-center"
                            />
                          </div>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[
                              ratings[subject.name]?.[topic.name]?.[field as keyof Topic['ratings']] ??
                              topic.ratings[field as keyof Topic['ratings']]
                            ]}
                            onValueChange={([value]) =>
                              handleRatingChange(subject.name, topic.name, field as keyof Topic['ratings'], value)
                            }
                            className="[&_[role=slider]]:bg-theme"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}