import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import masterSubjects from '@/data/masterSubjects';
import { Subject, Topic } from '@/data/masterSubjects';
import { UserPerformance } from '@/utils/spiralAlgorithm';

interface PerformanceEntry {
  timesRevised: number;
  rating: number;
}

type PerformanceData = {
  [subject: string]: {
    [condition: string]: PerformanceEntry;
  };
};

export default function Heatmap() {
  const [userPerformance, setUserPerformance] = useState<PerformanceData>({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'subject' | 'timesRevised'>('subject');
  const [maxTimesRevised, setMaxTimesRevised] = useState(1);

  useEffect(() => {
    // Load user performance from localStorage
    const savedPerformance = localStorage.getItem('user_performance');
    
    if (savedPerformance) {
      try {
        const parsedPerformance = JSON.parse(savedPerformance) as UserPerformance;
        
        // Transform the data into our PerformanceData format
        const transformedData: PerformanceData = {};
        
        // Initialize data structure
        masterSubjects.forEach(subject => {
          transformedData[subject.name] = {};
          
          subject.topics.forEach(topic => {
            const topicKey = `${subject.name}:${topic.name}`;
            const topicRating = parsedPerformance.topics?.[topicKey] || 0.5; // Default to middle rating
            
            transformedData[subject.name][topic.name] = {
              timesRevised: 0, // Will be populated from the usage data
              rating: topicRating * 10 // Scale from 0-1 to 0-10
            };
          });
        });
        
        // If we have actual performance data, merge it in
        if (parsedPerformance.topics) {
          Object.entries(parsedPerformance.topics).forEach(([key, value]) => {
            const [subject, topic] = key.split(':');
            if (transformedData[subject] && typeof value === 'number') {
              if (!transformedData[subject][topic]) {
                transformedData[subject][topic] = {
                  timesRevised: 0,
                  rating: value * 10 // Scale from 0-1 to 0-10
                };
              } else {
                transformedData[subject][topic].rating = value * 10;
              }
            }
          });
        }
        
        // Try to load revision counts
        const savedCounts = localStorage.getItem('revision-counts');
        if (savedCounts) {
          const counts = JSON.parse(savedCounts);
          let maxCount = 1;
          
          // Map counts to topics
          Object.entries(counts).forEach(([eventId, count]) => {
            // For simplicity, we'll update each topic in each session with the count
            // We could have a more sophisticated mapping, but this is a starting point
            const savedEvents = localStorage.getItem('study-events');
            if (savedEvents) {
              const events = JSON.parse(savedEvents);
              const event = events.find((e: any) => e.id === eventId);
              
              if (event && event.extendedProps?.topics) {
                const subject = event.title;
                event.extendedProps.topics.forEach((t: any) => {
                  const topicName = t.name;
                  
                  if (transformedData[subject] && transformedData[subject][topicName]) {
                    transformedData[subject][topicName].timesRevised = 
                      Math.max(transformedData[subject][topicName].timesRevised, count as number);
                      
                    // Update max count for color scaling
                    maxCount = Math.max(maxCount, count as number);
                  }
                });
              }
            }
          });
          
          setMaxTimesRevised(maxCount);
        }
        
        setUserPerformance(transformedData);
      } catch (error) {
        console.error('Failed to parse saved performance data:', error);
      }
    }
    
    // Also try to load from API
    const loadApiData = async () => {
      try {
        const apiModule = await import('@/lib/api');
        const { api } = apiModule;
        
        const performanceData = await api.performance.get();
        if (performanceData) {
          // Transform API data similar to localStorage data
          // (this is a placeholder - actual implementation would depend on API response format)
          setUserPerformance(prev => ({ ...prev, ...transformanceApiToPerformanceData(performanceData) }));
        }
      } catch (error) {
        console.error('Error loading performance data from API:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadApiData();
  }, []);
  
  // Transforms API data format to our PerformanceData format
  const transformanceApiToPerformanceData = (apiData: any): PerformanceData => {
    // This would need to be implemented based on the actual API response structure
    // For now, returning an empty object as a placeholder
    return {};
  };
  
  // Calculate color based on times revised and rating
  const getHeatmapColor = (times: number, rating: number): string => {
    if (times === 0 || isNaN(rating)) {
      return 'rgba(229, 231, 235, 0.8)'; // Light gray for no data
    }
    
    // Hue: 0 (red) for low ratings, 120 (green) for high ratings
    const hue = Math.min(120, Math.max(0, Math.round(rating * 12))); // Scale rating 0-10 to hue 0-120
    
    // Saturation: More saturation for higher times revised
    const saturation = Math.min(100, 40 + (times / maxTimesRevised) * 60);
    
    // Lightness: Darker for higher times revised
    const lightness = Math.max(40, 80 - (times / maxTimesRevised) * 40);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  
  // Sort subjects for display
  const getSortedSubjects = (): Subject[] => {
    if (sortBy === 'subject') {
      return [...masterSubjects].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Sort by times revised (most to least)
      return [...masterSubjects].sort((a, b) => {
        const aTimesRevised = Object.values(userPerformance[a.name] || {})
          .reduce((sum, entry) => sum + (entry.timesRevised || 0), 0);
        const bTimesRevised = Object.values(userPerformance[b.name] || {})
          .reduce((sum, entry) => sum + (entry.timesRevised || 0), 0);
        return bTimesRevised - aTimesRevised;
      });
    }
  };
  
  // Get all unique topic names across subjects
  const getAllTopicNames = (): string[] => {
    const topicSet = new Set<string>();
    
    masterSubjects.forEach(subject => {
      subject.topics.forEach(topic => {
        topicSet.add(topic.name);
      });
    });
    
    return Array.from(topicSet).sort();
  };
  
  // Find topics that belong to a condition group
  const getTopicsInConditionGroup = (subject: Subject, groupName: string): Topic[] => {
    const group = subject.conditionGroups.find(g => g.name === groupName);
    if (!group) return [];
    
    return group.conditions
      .map(conditionName => subject.topics.find(t => t.name === conditionName))
      .filter(topic => topic !== undefined) as Topic[];
  };
  
  // Get condition groups for a subject
  const getConditionGroups = (subject: Subject): string[] => {
    return subject.conditionGroups.map(group => group.name);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-theme rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading heatmap data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-theme">Revision Heatmap</h1>
          <p className="text-sm text-muted-foreground">
            Track your revision progress across all subjects and conditions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'subject' ? 'default' : 'outline'}
            onClick={() => setSortBy('subject')}
          >
            Sort by Subject
          </Button>
          <Button
            variant={sortBy === 'timesRevised' ? 'default' : 'outline'}
            onClick={() => setSortBy('timesRevised')}
          >
            Sort by Revision Count
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 py-3">
          <CardTitle className="text-lg">Revision Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-background z-10">
                <tr>
                  <th className="min-w-[200px] p-3 text-left font-semibold border-b">Subject</th>
                  <th className="min-w-[100px] p-3 text-left font-semibold border-b">Condition Group</th>
                  <th className="min-w-[150px] p-3 text-left font-semibold border-b">Condition</th>
                  <th className="min-w-[120px] p-3 text-left font-semibold border-b">Times Revised</th>
                  <th className="min-w-[120px] p-3 text-left font-semibold border-b">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {getSortedSubjects().map((subject) => (
                  // For each condition group in the subject
                  getConditionGroups(subject).map((groupName, groupIndex) => {
                    const topicsInGroup = getTopicsInConditionGroup(subject, groupName);
                    
                    return (
                      // For each topic in the condition group
                      topicsInGroup.map((topic, topicIndex) => {
                        const performance = userPerformance[subject.name]?.[topic.name] || { 
                          timesRevised: 0, 
                          rating: 0 
                        };
                        
                        const cellColor = getHeatmapColor(
                          performance.timesRevised,
                          performance.rating
                        );
                        
                        return (
                          <tr 
                            key={`${subject.name}-${groupName}-${topic.name}`}
                            className="hover:bg-muted/40 transition-colors"
                          >
                            {/* Show subject name only for first row of each subject */}
                            {topicIndex === 0 && groupIndex === 0 ? (
                              <td 
                                className="p-3 border-b"
                                rowSpan={subject.topics.length}
                              >
                                {subject.name}
                              </td>
                            ) : null}
                            
                            {/* Show group name only for first row of each group */}
                            {topicIndex === 0 ? (
                              <td 
                                className="p-3 border-b"
                                rowSpan={topicsInGroup.length}
                              >
                                {groupName}
                              </td>
                            ) : null}
                            
                            <td className="p-3 border-b">
                              {topic.name}
                            </td>
                            <td 
                              className="p-3 border-b text-center relative group"
                              style={{ backgroundColor: cellColor }}
                            >
                              {performance.timesRevised > 0 ? performance.timesRevised : '-'}
                              
                              {/* Tooltip */}
                              <div className="absolute hidden group-hover:block bg-background border rounded-md shadow-lg p-2 z-20 w-64 -translate-y-full left-1/2 -translate-x-1/2 mb-2">
                                <div className="font-semibold mb-1">{topic.name}</div>
                                <div className="text-sm">
                                  <div className="flex justify-between mb-1">
                                    <span>Times Revised:</span>
                                    <span>{performance.timesRevised || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Confidence Rating:</span>
                                    <span>{performance.rating.toFixed(1)}/10</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td 
                              className="p-3 border-b"
                              style={{ backgroundColor: cellColor }}
                            >
                              {performance.rating > 0 ? 
                                `${(performance.rating).toFixed(1)}/10` : 
                                '-'
                              }
                            </td>
                          </tr>
                        );
                      })
                    );
                  })
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold mb-2">Color Scale Legend</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: 'hsl(0, 80%, 60%)' }}></div>
            <span className="text-sm">Low Confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: 'hsl(60, 80%, 60%)' }}></div>
            <span className="text-sm">Medium Confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: 'hsl(120, 80%, 60%)' }}></div>
            <span className="text-sm">High Confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: 'rgba(229, 231, 235, 0.8)' }}></div>
            <span className="text-sm">Not Studied</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Color intensity increases with more revisions. Hover over cells for detailed information.
        </p>
      </div>
    </div>
  );
}