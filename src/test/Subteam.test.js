// src/test/Subteam.test.js
import { render, screen } from '@testing-library/react';
import Subteam from '../components/Subteam';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock tasks and events data
const tasks = [
    { id: 'TASK001', eventId: 'EVENT001', eventName: 'Conference', status: 'Pending' },
    { id: 'TASK002', eventId: 'EVENT002', eventName: 'Workshop', status: 'In Progress' },
];

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders Subteam component and displays assigned tasks', () => {
    render(
        <AuthProvider>
            <BrowserRouter>
                <Subteam tasks={tasks} />
            </BrowserRouter>
        </AuthProvider>
    );

    // Check if the component renders correctly
    expect(screen.getByText(/Subteam Tasks/i)).toBeInTheDocument();
    
    // Verify tasks are displayed
    expect(screen.getByText(/Conference/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/Workshop/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
});

test('displays message when no tasks are assigned', () => {
    render(
        <AuthProvider>
            <BrowserRouter>
                <Subteam tasks={[]} />
            </BrowserRouter>
        </AuthProvider>
    );

    // Verify message for no tasks
    expect(screen.getByText(/No tasks assigned to you/i)).toBeInTheDocument();
});
