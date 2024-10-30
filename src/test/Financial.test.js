// src/test/Financial.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Financial from '../components/Financial';
import { AuthProvider } from '../context/AuthContext';

// Mock functions
const mockAddComment = jest.fn();
const mockUpdateBudgetRequestStatus = jest.fn();

beforeEach(() => {
    mockAddComment.mockClear();
    mockUpdateBudgetRequestStatus.mockClear();
});

test('renders Financial component with requests and budget requests', () => {
    const requests = [
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference' },
    ];

    const budgetRequests = [
        { requestId: 'BUD001', amount: '3000', reason: 'Project funding', status: 'Pending' },
    ];

    render(
        <AuthProvider>
            <Financial 
                requests={requests} 
                addComment={mockAddComment} 
                budgetRequests={budgetRequests} 
                updateBudgetRequestStatus={mockUpdateBudgetRequestStatus} 
            />
        </AuthProvider>
    );

    // Check if the component renders correctly
    expect(screen.getByText(/Financial - Review Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Client A/i)).toBeInTheDocument();
    expect(screen.getByText(/Conference/i)).toBeInTheDocument();

    // Check budget requests section
    expect(screen.getByText(/Budget Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/BUD001/i)).toBeInTheDocument();
    expect(screen.getByText(/3000/i)).toBeInTheDocument();
    expect(screen.getByText(/Project funding/i)).toBeInTheDocument();
});

test('adds a comment and calls addComment with correct parameters', () => {
    const requests = [
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference' },
    ];

    const budgetRequests = [];

    render(
        <AuthProvider>
            <Financial 
                requests={requests} 
                addComment={mockAddComment} 
                budgetRequests={budgetRequests} 
                updateBudgetRequestStatus={mockUpdateBudgetRequestStatus} 
            />
        </AuthProvider>
    );

    // Add a comment
    const commentInput = screen.getByLabelText(/Add Comment:/i);
    fireEvent.change(commentInput, { target: { value: 'This is a comment.' } });
    fireEvent.click(screen.getByText(/Submit Comment/i));

    // Verify that addComment was called with the correct parameters
    expect(mockAddComment).toHaveBeenCalledWith(0, 'This is a comment.');
});

test('approves and rejects budget requests, calling updateBudgetRequestStatus with correct parameters', () => {
    const requests = [];
    const budgetRequests = [
        { requestId: 'BUD001', amount: '3000', reason: 'Project funding', status: 'Pending' },
    ];

    render(
        <AuthProvider>
            <Financial 
                requests={requests} 
                addComment={mockAddComment} 
                budgetRequests={budgetRequests} 
                updateBudgetRequestStatus={mockUpdateBudgetRequestStatus} 
            />
        </AuthProvider>
    );

    // Approve the budget request
    fireEvent.click(screen.getByText(/Approve/i));
    expect(mockUpdateBudgetRequestStatus).toHaveBeenCalledWith(0, 'Approved');

    // Reject the budget request
    fireEvent.click(screen.getByText(/Reject/i));
    expect(mockUpdateBudgetRequestStatus).toHaveBeenCalledWith(0, 'Rejected');
});
