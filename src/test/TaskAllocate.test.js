import { render, screen, fireEvent } from '@testing-library/react';
import TaskAllocate from '../components/TaskAllocate';
import { AuthProvider } from '../context/AuthContext';

// Mock function to allocate requests
const mockAllocateRequest = jest.fn();

beforeEach(() => {
    mockAllocateRequest.mockClear();
});

test('renders TaskAllocate component and displays requests', () => {
    const requests = [
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference', status: 'Pending', team: [] },
        { clientName: 'Client B', eventType: 'Workshop', date: '2023-12-10', budget: '3000', details: 'Details of Workshop', status: 'Pending', team: [] }
    ];

    render(
        <AuthProvider>
            <TaskAllocate requests={requests} allocateRequest={mockAllocateRequest} />
        </AuthProvider>
    );

    expect(screen.getByText(/Task Allocate - Assign Requests to Sub-teams/i)).toBeInTheDocument();
    expect(screen.getByText(/Client A/i)).toBeInTheDocument();
    expect(screen.getByText(/Conference/i)).toBeInTheDocument();
    expect(screen.getByText(/Client B/i)).toBeInTheDocument();
    expect(screen.getByText(/Workshop/i)).toBeInTheDocument();
});

test('allows multiple team selection and allocates request to selected teams', () => {
    const requests = [
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference', status: 'Pending', team: [] }
    ];

    render(
        <AuthProvider>
            <TaskAllocate requests={requests} allocateRequest={mockAllocateRequest} />
        </AuthProvider>
    );

    // Select multiple teams
    fireEvent.click(screen.getByLabelText(/Photography/i));
    fireEvent.click(screen.getByLabelText(/Music/i));

    // Ensure checkboxes are selected
    expect(screen.getByLabelText(/Photography/i).checked).toBe(true);
    expect(screen.getByLabelText(/Music/i).checked).toBe(true);

    // Click allocate button and check if mockAllocateRequest is called with correct arguments
    fireEvent.click(screen.getByText(/Allocate to Selected Teams/i));
    expect(mockAllocateRequest).toHaveBeenCalledWith(0, ['Photography', 'Music']);
});
