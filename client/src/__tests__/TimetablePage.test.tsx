import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import TimetablePage from '@/pages/TimetablePage';

// Mock the hooks
vi.mock('@/hooks/use-timetable', () => ({
  useTimetableQuery: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
  useSaveTimetableMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUserEventsQuery: () => ({
    data: [],
    isLoading: false,
  }),
  useSaveEventsMutation: () => ({
    mutate: vi.fn(),
  }),
}));

// Mock the spiral service
vi.mock('@/services/spiral', () => ({
  generate: vi.fn(() => []),
}));

// Mock FullCalendar
vi.mock('@fullcalendar/react', () => ({
  default: () => <div data-testid="calendar">Mock Calendar</div>,
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('TimetablePage', () => {
  it('renders the timetable page', () => {
    renderWithProviders(<TimetablePage />);
    
    expect(screen.getByText('Study Timetable')).toBeInTheDocument();
    expect(screen.getByText('Manage your UKMLA revision schedule')).toBeInTheDocument();
  });

  it('displays statistics cards', () => {
    renderWithProviders(<TimetablePage />);
    
    expect(screen.getByText('Total Sessions')).toBeInTheDocument();
    expect(screen.getByText('Study Hours')).toBeInTheDocument();
    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('Weekly Hours')).toBeInTheDocument();
  });

  it('has configure and generate buttons', () => {
    renderWithProviders(<TimetablePage />);
    
    expect(screen.getByText('Configure')).toBeInTheDocument();
    expect(screen.getByText('Generate Timetable')).toBeInTheDocument();
  });

  it('renders the calendar component', () => {
    renderWithProviders(<TimetablePage />);
    
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('opens configuration modal when configure button is clicked', async () => {
    renderWithProviders(<TimetablePage />);
    
    const configureButton = screen.getByText('Configure');
    fireEvent.click(configureButton);

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });
});