// src/test/SeniorCustomerService.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import SeniorCustomerService from '../components/SeniorCustomerService';
import { AuthProvider } from '../context/AuthContext';
import { RequestsContext } from '../context/RequestContext';

const renderWithProviders = (mockRequests = []) => {
  const mockUpdateRequestStatus = jest.fn();
  
  render(
    <AuthProvider>
      <RequestsContext.Provider value={{
        requests: mockRequests,
        updateRequestStatus: mockUpdateRequestStatus
      }}>
        <SeniorCustomerService />
      </RequestsContext.Provider>
    </AuthProvider>
  );

  return { mockUpdateRequestStatus };
};

describe('SeniorCustomerService Component', () => {
  // 测试1：基本渲染
  test('renders component with a request', () => {
    const requests = [
      { 
        clientName: 'Client A', 
        eventType: 'Conference', 
        date: '2023-12-01', 
        budget: '5000', 
        details: 'Details', 
        status: 'Pending' 
      }
    ];

    renderWithProviders(requests);

    expect(screen.getByText(/Senior Customer Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Client A/)).toBeInTheDocument();
    expect(screen.getByText(/Approve/)).toBeInTheDocument();
    expect(screen.getByText(/Reject/)).toBeInTheDocument();
  });

  // 测试2：批准请求
  test('approves request', () => {
    const requests = [
      { 
        clientName: 'Client A', 
        eventType: 'Conference', 
        status: 'Pending' 
      }
    ];

    const { mockUpdateRequestStatus } = renderWithProviders(requests);
    
    fireEvent.click(screen.getByText(/Approve/));
    expect(mockUpdateRequestStatus).toHaveBeenCalledWith(0, 'Approved by SCS');
  });

  // 测试3：拒绝请求
  test('rejects request', () => {
    const requests = [
      { 
        clientName: 'Client A', 
        eventType: 'Conference', 
        status: 'Pending' 
      }
    ];

    const { mockUpdateRequestStatus } = renderWithProviders(requests);
    
    fireEvent.click(screen.getByText(/Reject/));
    expect(mockUpdateRequestStatus).toHaveBeenCalledWith(0, 'Rejected by SCS');
  });
});