import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

export interface TimetableData {
  id?: number;
  userId: number;
  config: any;
  blocks: any[];
  createdAt?: string;
  updatedAt?: string;
}

export function useTimetableQuery() {
  return useQuery({
    queryKey: ['timetables'],
    queryFn: async () => {
      const response = await apiClient.get('/timetables');
      return response.data;
    },
  });
}

export function useSaveTimetableMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<TimetableData>) => {
      const response = await apiClient.put('/timetables', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      toast({
        title: 'Timetable saved',
        description: 'Your timetable has been saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error saving timetable',
        description: error.response?.data?.message || 'Failed to save timetable',
        variant: 'destructive',
      });
    },
  });
}

export function useUserEventsQuery() {
  return useQuery({
    queryKey: ['user-events'],
    queryFn: async () => {
      const response = await apiClient.get('/user-events');
      return response.data;
    },
  });
}

export function useSaveEventsMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (events: any[]) => {
      const response = await apiClient.put('/user-events', { events });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-events'] });
      toast({
        title: 'Events saved',
        description: 'Your events have been saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error saving events',
        description: error.response?.data?.message || 'Failed to save events',
        variant: 'destructive',
      });
    },
  });
}

export function usePerformanceMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (performanceData: any) => {
      const response = await apiClient.post('/performance', performanceData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance'] });
      toast({
        title: 'Progress updated',
        description: 'Your study progress has been recorded.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating progress',
        description: error.response?.data?.message || 'Failed to update progress',
        variant: 'destructive',
      });
    },
  });
}