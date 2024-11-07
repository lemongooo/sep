// src/test/CustomerService.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerService from '../components/CustomerService';
import { AuthProvider } from '../context/AuthContext';

// Mock the addRequest function
const mockAddRequest = jest.fn();

beforeEach(() => {
    mockAddRequest.mockClear();
});

// Test 1: Basic render check
test('renders CustomerService component', () => {
    render(
        <AuthProvider>
            <CustomerService addRequest={mockAddRequest} requests={[]} />
        </AuthProvider>
    );

    expect(screen.getByText(/Customer Service - Create Request/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Request/i)).toBeInTheDocument();
});

// Test 2: Form submission calls addRequest
test('submits form with complete data and clears inputs', () => {
    render(
        <AuthProvider>
            <CustomerService addRequest={mockAddRequest} requests={[]} />
        </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Client Name:/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Event Type:/i), { target: { value: 'Conference' } });
    fireEvent.change(screen.getByLabelText(/Date:/i), { target: { value: '2023-12-01' } });
    fireEvent.change(screen.getByLabelText(/Budget:/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/Details:/i), { target: { value: 'Conference details including guest speakers and itinerary.' } });    

    // Submit form
    fireEvent.click(screen.getByText(/Submit Request/i));

    // Verify that addRequest was called with complete form data
    expect(mockAddRequest).toHaveBeenCalledWith({
        clientName: 'Jane Doe',
        eventType: 'Conference',
        date: '2023-12-01',
        budget: '5000',
        details: 'Conference details including guest speakers and itinerary.',
    });

});

// Test 3: Displays submitted requests
test('displays submitted requests', () => {
    const requests = [
        { clientName: 'Alice', eventType: 'Seminar', date: '2023-09-10', budget: '3000', details: 'Seminar about industry trends.', status: 'Pending' }
    ];

    render(
        <AuthProvider>
            <CustomerService addRequest={mockAddRequest} requests={requests} />
        </AuthProvider>
    );

    // Check if the request details are displayed
    expect(screen.getByText(/^Alice$/)).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' && 
               element.textContent.includes('Event Type:') && 
               element.textContent.includes('Seminar');
    })).toBeInTheDocument();
    expect(screen.getByText(/2023-09-10/)).toBeInTheDocument();
    expect(screen.getByText(/3000/)).toBeInTheDocument();
    expect(screen.getByText(/Seminar about industry trends./)).toBeInTheDocument();
    expect(screen.getByText(/Pending/)).toBeInTheDocument();
});
