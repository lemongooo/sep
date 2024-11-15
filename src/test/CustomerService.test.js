// src/test/CustomerService.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerService from '../components/CustomerService';
import { AuthProvider } from '../context/AuthContext';
import { RequestsContext } from '../context/RequestContext';

// 创建一个包装器组件来提供 mock 的 context 值
const renderWithProviders = (mockContextValue = {}) => {
  const defaultContextValue = {
    requests: [],
    addRequest: jest.fn(),
    ...mockContextValue
  };

  return {
    ...render(
      <AuthProvider>
        <RequestsContext.Provider value={defaultContextValue}>
          <CustomerService />
        </RequestsContext.Provider>
      </AuthProvider>
    ),
    mockContextValue: defaultContextValue
  };
};

describe('CustomerService Component', () => {
  // Test 1: 基础渲染测试
  test('renders CustomerService component', () => {
    renderWithProviders();
    
    // 检查标题和提交按钮
    expect(screen.getByText(/Customer Service - Create Request/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Request/i)).toBeInTheDocument();
    
    // 检查基本表单字段
    expect(screen.getByLabelText(/Client Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Type:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Details:/i)).toBeInTheDocument();
  });

  // Test 2: 表单提交测试
  test('submits form with complete data and clears inputs', () => {
    const mockAddRequest = jest.fn();
    renderWithProviders({ addRequest: mockAddRequest });

    // 填写表单
    fireEvent.change(screen.getByLabelText(/Client Name:/i), 
      { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Event Type:/i), 
      { target: { value: 'Conference' } });
    fireEvent.change(screen.getByLabelText(/Date:/i), 
      { target: { value: '2023-12-01' } });
    fireEvent.change(screen.getByLabelText(/Budget:/i), 
      { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText(/Details:/i), 
      { target: { value: 'Conference details including guest speakers and itinerary.' } });

    // 提交表单
    fireEvent.click(screen.getByText(/Submit Request/i));

    // 验证 addRequest 被调用并且传入了正确的参数
    expect(mockAddRequest).toHaveBeenCalledWith({
      clientName: 'Jane Doe',
      eventType: 'Conference',
      date: '2023-12-01',
      budget: '5000',
      details: 'Conference details including guest speakers and itinerary.',
    });

    // 验证表单被清空
    expect(screen.getByLabelText(/Client Name:/i)).toHaveValue('');
    expect(screen.getByLabelText(/Event Type:/i)).toHaveValue('');
  });

  // Test 3: 显示请求列表测试
  test('displays submitted requests', () => {
    const mockRequests = [
      {
        clientName: 'Alice',
        eventType: 'Seminar',
        date: '2023-09-10',
        budget: '3000',
        extraBudget: { amount: 0 },
        details: 'Seminar about industry trends.',
        status: 'Pending'
      }
    ];

    renderWithProviders({ requests: mockRequests });

    // 更精确地检查每个字段
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && 
             element.textContent.includes('Client Name:') && 
             element.textContent.includes('Alice');
    })).toBeInTheDocument();

    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && 
             element.textContent.includes('Event Type:') && 
             element.textContent.includes('Seminar');
    })).toBeInTheDocument();

    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && 
             element.textContent.includes('Date:') && 
             element.textContent.includes('2023-09-10');
    })).toBeInTheDocument();

    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && 
             element.textContent.includes('Budget:') && 
             element.textContent.includes('3000');
    })).toBeInTheDocument();

    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && 
             element.textContent.includes('Status:') && 
             element.textContent.includes('Pending');
    })).toBeInTheDocument();
  });
});