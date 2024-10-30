// src/test/TaskAllocate.test.js
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
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference', status: 'Pending' },
        { clientName: 'Client B', eventType: 'Workshop', date: '2023-12-10', budget: '3000', details: 'Details of Workshop', status: 'Pending' }
    ];

    render(
        <AuthProvider>
            <TaskAllocate requests={requests} allocateRequest={mockAllocateRequest} />
        </AuthProvider>
    );

    // Check if the component renders and requests are displayed
    expect(screen.getByText(/Task Allocate - Assign Requests to Sub-teams/i)).toBeInTheDocument();
    expect(screen.getByText(/Client A/i)).toBeInTheDocument();
    expect(screen.getByText(/Conference/i)).toBeInTheDocument();
    expect(screen.getByText(/Client B/i)).toBeInTheDocument();
    expect(screen.getByText(/Workshop/i)).toBeInTheDocument();
});

test('allows team selection and allocates request to the selected team', () => {
    const requests = [
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference', status: 'Pending' }
    ];

    render(
        <AuthProvider>
            <TaskAllocate requests={requests} allocateRequest={mockAllocateRequest} />
        </AuthProvider>
    );

    // Select a team from the dropdown
    fireEvent.change(screen.getByLabelText(/Select Team:/i), { target: { value: 'Team A' } });
    expect(screen.getByLabelText(/Select Team:/i).value).toBe('Team A');

    // Click allocate button and check if mockAllocateRequest is called with correct arguments
    fireEvent.click(screen.getByText(/Allocate to Team/i));
    expect(mockAllocateRequest).toHaveBeenCalledWith(0, 'Team A');
});
