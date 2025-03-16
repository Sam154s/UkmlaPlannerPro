import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
            <CardContent className="space-y-6 pt-6">
              {subject.topics.map((topic) => (
                <div key={topic.name} className="space-y-4">
                  <h3 className="font-medium text-primary">{topic.name}</h3>

                  <div className="space-y-4">
                    {['difficulty', 'clinicalImportance', 'examRelevance'].map((field) => (
                      <div key={field} className="space-y-2">
                        <Label className="capitalize text-sm text-muted-foreground">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
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
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}