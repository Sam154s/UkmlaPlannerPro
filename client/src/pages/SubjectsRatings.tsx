import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
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
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Subjects & Ratings
        </h1>
        <p className="text-sm text-muted-foreground">
          Adjust difficulty ratings for your subjects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {masterSubjects.map((subject) => (
          <Card key={subject.name} className="border-purple-100 hover:border-purple-200 transition-colors duration-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
              <CardTitle className="text-primary">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="space-y-2">
                {subject.topics.map((topic) => (
                  <AccordionItem key={topic.name} value={topic.name}>
                    <AccordionTrigger className="text-sm font-medium text-primary hover:text-primary/80">
                      {topic.name}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {['difficulty', 'clinicalImportance', 'examRelevance'].map((field) => (
                        <div key={field} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="capitalize text-sm text-muted-foreground">
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
                            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-purple-600 [&_[role=slider]]:to-blue-500"
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
                          />
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}