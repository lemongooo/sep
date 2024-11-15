// src/test/ProductionManager.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import ProductionManager from '../components/ProductionManager';
import { AuthProvider } from '../context/AuthContext';
import { RequestsContext } from '../context/RequestContext';
import { BrowserRouter } from 'react-router-dom';

// 创建一个包装器组件来提供 mock 的 context 值
const renderWithProviders = (mockContextValue = {}) => {
  const defaultContextValue = {
    requests: [],
    hrRequests: [],
    budgetRequests: [],
    addHRRequest: jest.fn(),
    addBudgetRequest: jest.fn(),
    ...mockContextValue
  };

  return {
    ...render(
      <AuthProvider>
        <RequestsContext.Provider value={defaultContextValue}>
          <BrowserRouter>
            <ProductionManager />
          </BrowserRouter>
        </RequestsContext.Provider>
      </AuthProvider>
    ),
    mockContextValue: defaultContextValue
  };
};

describe('ProductionManager Component', () => {
  const mockRequest = {
    id: 'req_1',
    clientName: 'Client A',
    eventType: 'Conference'
  };

  // Test 1: 基础渲染测试
  test('renders ProductionManager component', () => {
    renderWithProviders({
      requests: [mockRequest]
    });
    
    // 检查主要标题和按钮
    expect(screen.getByRole('heading', { name: /Staff Recruitment Request/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit HR Request/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Budget Request/i })).toBeInTheDocument();
  });

  // Test 2: HR 请求表单提交测试
  test('submits HR request form', () => {
    const mockAddHRRequest = jest.fn();
    renderWithProviders({
      requests: [mockRequest],
      addHRRequest: mockAddHRRequest
    });

    // 填写并提交表单
    const selects = screen.getAllByRole('combobox');
    const inputs = screen.getAllByRole('spinbutton');
    const textareas = screen.getAllByRole('textbox');

    fireEvent.change(selects[0], { target: { value: 'req_1' } });
    fireEvent.change(inputs[0], { target: { value: '5' } });
    fireEvent.change(textareas[0], { target: { value: 'Manage team operations' } });
    fireEvent.change(textareas[1], { target: { value: 'Q4 2023' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit HR Request/i }));

    // 验证提交
    expect(mockAddHRRequest).toHaveBeenCalledWith({
      requestId: 'req_1',
      staffCount: '5',
      responsibilities: 'Manage team operations',
      timeFrame: 'Q4 2023',
      status: 'Submitted'
    });
  });

  // Test 3: Budget 请求表单提交测试
  test('submits Budget request form', () => {
    const mockAddBudgetRequest = jest.fn();
    renderWithProviders({
      requests: [mockRequest],
      addBudgetRequest: mockAddBudgetRequest
    });

    // 填写并提交表单
    const selects = screen.getAllByRole('combobox');
    const inputs = screen.getAllByRole('spinbutton');
    const textareas = screen.getAllByRole('textbox');

    fireEvent.change(selects[1], { target: { value: 'req_1' } });
    fireEvent.change(inputs[1], { target: { value: '8000' } });
    fireEvent.change(textareas[2], { target: { value: 'Event coordination' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit Budget Request/i }));

    // 验证提交
    expect(mockAddBudgetRequest).toHaveBeenCalledWith({
      requestId: 'req_1',
      clientName: 'Client A',
      eventType: 'Conference',
      amount: '8000',
      reason: 'Event coordination',
      status: 'Pending'
    });
  });

  // Test 4: 显示列表测试
  test('displays requests lists', () => {
    const mockHRRequest = {
      requestId: 'req_1',
      staffCount: '3',
      responsibilities: 'Event setup',
      timeFrame: 'Q3 2023',
      status: 'Submitted'
    };

    const mockBudgetRequest = {
      requestId: 'req_1',
      clientName: 'Client A',
      eventType: 'Conference',
      amount: '5000',
      reason: 'Equipment',
      status: 'Pending'
    };

    renderWithProviders({
      requests: [mockRequest],
      hrRequests: [mockHRRequest],
      budgetRequests: [mockBudgetRequest]
    });

    // 验证内容显示
    expect(screen.getByText('Event setup')).toBeInTheDocument();
    expect(screen.getByText('Equipment')).toBeInTheDocument();
  });
});