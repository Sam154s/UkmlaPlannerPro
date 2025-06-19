import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { generateTimetableAPI, mapToEvents, type SpiralConfig, type StudySession } from '@/services/spiral';
import { useToast } from '@/hooks/use-toast';

export function useTimetable() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const timetableQuery = useQuery({
    queryKey: ['/api/timetables'],
    queryFn: async () => {
      const response = await api.get('/api/timetables');
      return response.data;
    },
    enabled: false, // Only fetch when explicitly called
  });

  const generateTimetable = useMutation({
    mutationFn: async (config: SpiralConfig) => {
      // Try API first, fallback to local algorithm
      try {
        const response = await api.post('/api/timetables/generate', config);
        return response.data;
      } catch (error) {
        console.log('API unavailable, using local algorithm');
        return generateTimetableAPI(config);
      }
    },
    onSuccess: (sessions: StudySession[]) => {
      // Update local cache
      queryClient.setQueryData(['/api/timetables'], { sessions });
      
      toast({
        title: "Timetable Generated",
        description: `Created ${sessions.length} study sessions`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate timetable",
        variant: "destructive",
      });
    },
  });

  const saveTimetable = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put('/api/timetables', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timetables'] });
      toast({
        title: "Timetable Saved",
        description: "Your study schedule has been saved",
      });
    },
  });

  return {
    timetable: timetableQuery.data,
    isLoading: timetableQuery.isLoading || generateTimetable.isPending,
    generateTimetable: generateTimetable.mutate,
    saveTimetable: saveTimetable.mutate,
    refetch: timetableQuery.refetch,
  };
}

export function useUserEvents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const userEventsQuery = useQuery({
    queryKey: ['/api/user-events'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/user-events');
        return response.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  const saveUserEvents = useMutation({
    mutationFn: async (events: any[]) => {
      const response = await api.put('/api/user-events', { events });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-events'] });
      toast({
        title: "Events Saved",
        description: "Your personal events have been updated",
      });
    },
  });

  return {
    userEvents: userEventsQuery.data || [],
    isLoading: userEventsQuery.isLoading,
    saveUserEvents: saveUserEvents.mutate,
    refetch: userEventsQuery.refetch,
  };
}

export function useSubjects() {
  const { toast } = useToast();

  const subjectRatingsQuery = useQuery({
    queryKey: ['/api/subjects/ratings'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/subjects/ratings');
        return response.data || {};
      } catch (error) {
        return {};
      }
    },
  });

  const saveSubjectRatings = useMutation({
    mutationFn: async (ratings: any) => {
      const response = await api.post('/api/subjects/ratings', ratings);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Preferences Saved",
        description: "Your subject preferences have been updated",
      });
    },
  });

  return {
    subjectRatings: subjectRatingsQuery.data || {},
    isLoading: subjectRatingsQuery.isLoading,
    saveSubjectRatings: saveSubjectRatings.mutate,
  };
}