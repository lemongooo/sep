// src/components/CustomerService.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerService from './CustomerService';

describe('CustomerService Component', () => {
  let addRequestMock, updateRequestMock;

  beforeEach(() => {
    addRequestMock = jest.fn();
    updateRequestMock = jest.fn();
  });

  test('renders create request form', () => {
    render(<CustomerService addRequest={addRequestMock} requests={[]} updateRequest={updateRequestMock} />);
    expect(screen.getByText(/customer service - create request/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event type:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/details:/i)).toBeInTheDocument();
  });

  test('allows creating a new request', () => {
    render(<CustomerService addRequest={addRequestMock} requests={[]} updateRequest={updateRequestMock} />);
    
    fireEvent.change(screen.getByLabelText(/client name:/i), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByLabelText(/event type:/i), { target: { value: 'Conference' } });
    fireEvent.change(screen.getByLabelText(/date:/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/budget:/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/details:/i), { target: { value: 'Details for conference' } });
    
    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));

    expect(addRequestMock).toHaveBeenCalledWith({
      clientName: 'Test Client',
      eventType: 'Conference',
      date: '2023-01-01',
      budget: '1000',
      details: 'Details for conference',
    });
  });

  test('allows editing an existing request', () => {
    const initialRequests = [
      {
        clientName: 'Initial Client',
        eventType: 'Workshop',
        date: '2023-01-02',
        budget: '500',
        details: 'Initial details',
        status: 'Pending',
        comment: 'None',
      },
    ];
    render(
      <CustomerService
        addRequest={addRequestMock}
        requests={initialRequests}
        updateRequest={updateRequestMock}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByText(/edit request/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/client name:/i), { target: { value: 'Updated Client' } });
    fireEvent.change(screen.getByLabelText(/budget:/i), { target: { value: '1500' } });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(updateRequestMock).toHaveBeenCalledWith(0, {
      clientName: 'Updated Client',
      eventType: 'Workshop',
      date: '2023-01-02',
      budget: '1500',
      details: 'Initial details',
    });
  });

  test('validates required fields before submitting', () => {
    render(<CustomerService addRequest={addRequestMock} requests={[]} updateRequest={updateRequestMock} />);

    fireEvent.submit(screen.getByRole('form'));
    expect(addRequestMock).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/client name:/i), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByLabelText(/event type:/i), { target: { value: 'Conference' } });
    fireEvent.change(screen.getByLabelText(/date:/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/budget:/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/details:/i), { target: { value: 'Details for conference' } });
    
    fireEvent.submit(screen.getByRole('form'));
    expect(addRequestMock).toHaveBeenCalledTimes(1);
  });
});
