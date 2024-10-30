// src/test/SeniorCustomerService.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import SeniorCustomerService from '../components/SeniorCustomerService';
import { AuthProvider } from '../context/AuthContext';

// Mock function for updating request status
const mockUpdateRequestStatus = jest.fn();

beforeEach(() => {
    mockUpdateRequestStatus.mockClear();
});

test('renders SeniorCustomerService component with a request', () => {
    const requests = [
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference', status: 'Pending' }
    ];

    render(
        <AuthProvider>
            <SeniorCustomerService requests={requests} updateRequestStatus={mockUpdateRequestStatus} />
        </AuthProvider>
    );

    // Check if the component renders correctly
    expect(screen.getByText(/Senior Customer Service - Review Requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Client A/i)).toBeInTheDocument();
    expect(screen.getByText(/Conference/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
});

test('approves the request and calls updateRequestStatus with correct parameters', () => {
    const requests = [
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference', status: 'Pending' }
    ];

    render(
        <AuthProvider>
            <SeniorCustomerService requests={requests} updateRequestStatus={mockUpdateRequestStatus} />
        </AuthProvider>
    );

    // Approve the request
    fireEvent.click(screen.getByText(/Approve/i));

    // Verify that updateRequestStatus was called with correct parameters
    expect(mockUpdateRequestStatus).toHaveBeenCalledWith(0, 'Approved');
});

test('rejects the request and calls updateRequestStatus with correct parameters', () => {
    const requests = [
        { clientName: 'Client A', eventType: 'Conference', date: '2023-12-01', budget: '5000', details: 'Details of Conference', status: 'Pending' }
    ];

    render(
        <AuthProvider>
            <SeniorCustomerService requests={requests} updateRequestStatus={mockUpdateRequestStatus} />
        </AuthProvider>
    );

    // Reject the request
    fireEvent.click(screen.getByText(/Reject/i));

    // Verify that updateRequestStatus was called with correct parameters
    expect(mockUpdateRequestStatus).toHaveBeenCalledWith(0, 'Rejected');
});
