import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import masterSubjects, { SubjectCondition } from '@/data/masterSubjects';

export default function SubjectsRatings() {
  const [ratings, setRatings] = useState(() => {
    const stored = localStorage.getItem('subjectRatings');
    return stored ? JSON.parse(stored) : {};
  });

  const handleRatingChange = (
    subject: string,
    condition: string,
    field: keyof SubjectCondition,
    value: number
  ) => {
    const newRatings = {
      ...ratings,
      [subject]: {
        ...ratings[subject],
        [condition]: {
          ...ratings[subject]?.[condition],
          [field]: value
        }
      }
    };
    setRatings(newRatings);
    localStorage.setItem('subjectRatings', JSON.stringify(newRatings));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Subjects & Ratings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(masterSubjects).map(([subject, conditions]) => (
          <Card key={subject}>
            <CardHeader>
              <CardTitle>{subject}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {conditions.map((condition) => (
                <div key={condition.conditionName} className="space-y-4">
                  <h3 className="font-medium">{condition.conditionName}</h3>
                  
                  <div className="space-y-4">
                    {['difficulty', 'clinicalImportance', 'examRelevance'].map((field) => (
                      <div key={field} className="space-y-2">
                        <Label className="capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={[
                            ratings[subject]?.[condition.conditionName]?.[field as keyof SubjectCondition] ??
                            condition[field as keyof SubjectCondition]
                          ]}
                          onValueChange={([value]) =>
                            handleRatingChange(subject, condition.conditionName, field as keyof SubjectCondition, value)
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
