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
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

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
  
  // Get condition color based only on times revised (using the theme accent color)
  const getConditionRevisionColor = (times: number): string => {
    if (times === 0) {
      return 'rgba(229, 231, 235, 0.8)'; // Light gray for no data
    }
    
    // Get the theme accent color
    const getThemeColor = () => {
      // Extract theme color from CSS variables (default to a blue if not found)
      const root = document.documentElement;
      const fromVar = getComputedStyle(root).getPropertyValue('--gradient-from').trim();
      
      if (fromVar) {
        const rgb = fromVar.split(' ');
        if (rgb.length === 3) {
          return { r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2]) };
        }
      }
      
      // Fallback to a default blue
      return { r: 37, g: 99, b: 235 };
    };
    
    const themeColor = getThemeColor();
    
    // Alpha: More opaque for higher times revised
    const alpha = Math.min(1, 0.2 + (times / maxTimesRevised) * 0.8);
    
    return `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${alpha})`;
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
  
  // Toggle expansion state for a subject
  const toggleSubjectExpansion = (subjectName: string) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectName]: !prev[subjectName]
    }));
  };
  
  // Calculate average times revised for a subject
  const getSubjectAverageRevisions = (subject: Subject): number => {
    const topics = Object.values(userPerformance[subject.name] || {});
    if (topics.length === 0) return 0;
    
    const totalRevisions = topics.reduce((sum, entry) => sum + (entry.timesRevised || 0), 0);
    return totalRevisions / topics.length;
  };
  
  // Calculate average confidence rating for a subject
  const getSubjectAverageRating = (subject: Subject): number => {
    const topics = Object.values(userPerformance[subject.name] || {});
    if (topics.length === 0) return 0;
    
    const totalRating = topics.reduce((sum, entry) => sum + (entry.rating || 0), 0);
    return totalRating / topics.length;
  };
  
  // Get color for subject overview based on average revisions and ratings
  const getSubjectOverviewColor = (subject: Subject): string => {
    const avgRevisions = getSubjectAverageRevisions(subject);
    const avgRating = getSubjectAverageRating(subject);
    
    return getHeatmapColor(avgRevisions, avgRating);
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
      
      {/* Subject Overview Heatmap */}
      <Card className="overflow-hidden mb-6">
        <CardHeader className="bg-muted/50 py-3">
          <CardTitle className="text-lg">Subject Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {getSortedSubjects().map((subject) => {
              const avgRevisions = getSubjectAverageRevisions(subject);
              const avgRating = getSubjectAverageRating(subject);
              const bgColor = getSubjectOverviewColor(subject);
              
              return (
                <div 
                  key={subject.name}
                  className="p-3 rounded-lg border flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
                  style={{ backgroundColor: bgColor }}
                  onClick={() => toggleSubjectExpansion(subject.name)}
                >
                  <h3 className="font-semibold mb-1 text-sm line-clamp-2 h-10">
                    {subject.name}
                  </h3>
                  <div className="text-xs">
                    <div>Avg. Times: {avgRevisions.toFixed(1)}</div>
                    <div>Avg. Rating: {avgRating.toFixed(1)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Subject Breakdowns */}
      <div className="space-y-4">
        {getSortedSubjects().map((subject) => {
          const isExpanded = !!expandedSubjects[subject.name];
          const subjectColor = getSubjectOverviewColor(subject);
          
          return (
            <Card key={subject.name} className="overflow-hidden">
              <div 
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-muted/10 transition-colors"
                style={{ backgroundColor: subjectColor }}
                onClick={() => toggleSubjectExpansion(subject.name)}
              >
                <h3 className="font-semibold">{subject.name}</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg 
                    width="15" 
                    height="15" 
                    viewBox="0 0 15 15" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                  >
                    <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </div>
              
              {isExpanded && (
                <CardContent className="p-0">
                  <div className="overflow-auto max-h-[400px]">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-background z-10">
                        <tr>
                          <th className="min-w-[200px] p-3 text-left font-semibold border-b">Condition Group</th>
                          <th className="min-w-[300px] p-3 text-left font-semibold border-b">Condition</th>
                          <th className="min-w-[120px] p-3 text-center font-semibold border-b">Times Revised</th>
                          <th className="min-w-[120px] p-3 text-center font-semibold border-b">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getConditionGroups(subject).map((groupName) => {
                          const topicsInGroup = getTopicsInConditionGroup(subject, groupName);
                          
                          return topicsInGroup.map((topic, topicIndex) => {
                            const performance = userPerformance[subject.name]?.[topic.name] || { 
                              timesRevised: 0, 
                              rating: 0 
                            };
                            
                            // Use theme-based color for cells that focuses only on revision count
                            const cellColor = getConditionRevisionColor(performance.timesRevised);
                            
                            return (
                              <tr 
                                key={`${subject.name}-${groupName}-${topic.name}`}
                                className="hover:bg-muted/40 transition-colors"
                              >
                                {/* Show group name only for first row of each group */}
                                {topicIndex === 0 ? (
                                  <td 
                                    className="p-3 border-b font-medium"
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
                                  className="p-3 border-b text-center"
                                  style={{ backgroundColor: cellColor }}
                                >
                                  {performance.rating > 0 ? 
                                    `${(performance.rating).toFixed(1)}/10` : 
                                    '-'
                                  }
                                </td>
                              </tr>
                            );
                          });
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
      
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold mb-2">Revision Intensity Legend</h3>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: getConditionRevisionColor(0) }}></div>
            <span className="text-sm">Not Studied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: getConditionRevisionColor(1) }}></div>
            <span className="text-sm">Studied Once</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: getConditionRevisionColor(3) }}></div>
            <span className="text-sm">Studied 3 Times</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: getConditionRevisionColor(5) }}></div>
            <span className="text-sm">Studied 5+ Times</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Color intensity increases with more revisions. Colors match your selected theme. Hover over cells for detailed information.
        </p>
      </div>
    </div>
  );
}