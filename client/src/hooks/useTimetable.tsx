import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';
import { generateSpiralTimetable, mapToEvents, type SpiralConfig, type StudySession } from '@/services/spiral';
import { useToast } from '@/hooks/use-toast';

export function useTimetable() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const generateTimetable = useMutation({
    mutationFn: async (payload: SpiralConfig) => {
      try {
        const response = await api.post('/timetables/generate', payload);
        return response.data;
      } catch (error) {
        // Fallback to local algorithm
        return generateSpiralTimetable(payload);
      }
    },
    onSuccess: (data: StudySession[]) => {
      // Store in React Query cache
      queryClient.setQueryData(['timetables'], data);
      
      toast({
        title: "Timetable Generated",
        description: `Created ${data.length} study sessions`,
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

  const timetableQuery = useQuery({
    queryKey: ['timetables'],
    queryFn: async () => {
      try {
        const response = await api.get('/timetables');
        return response.data;
      } catch (error) {
        return [];
      }
    },
    enabled: false,
  });

  return {
    timetable: timetableQuery.data,
    isLoading: timetableQuery.isLoading || generateTimetable.isPending,
    generateTimetable: generateTimetable.mutate,
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