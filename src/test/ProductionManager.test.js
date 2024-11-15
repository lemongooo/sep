// src/test/ProductionManager.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import ProductionManager from '../components/ProductionManager';
import { AuthProvider } from '../context/AuthContext';
import { RequestsContext } from '../context/RequestContext';
import { BrowserRouter } from 'react-router-dom';

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
  const approvedRequest = {
    id: 'req_1',
    clientName: 'Client A',
    eventType: 'Conference',
    status: 'Approved by Administration'
  };

  const pendingRequest = {
    id: 'req_2',
    clientName: 'Client B',
    eventType: 'Workshop',
    status: 'Pending'
  };

  // Test 1: 基础渲染测试
  test('renders ProductionManager component', () => {
    renderWithProviders({
      requests: [approvedRequest, pendingRequest]
    });
    
    // 检查主要标题
    expect(screen.getByRole('heading', { name: /Staff Recruitment Request/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit HR Request/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Budget Request/i })).toBeInTheDocument();
  });

  // Test 2: 筛选功能测试
  test('only shows approved requests in select options', () => {
    renderWithProviders({
      requests: [approvedRequest, pendingRequest]
    });

    // 检查下拉选项
    const selects = screen.getAllByRole('combobox');
    selects.forEach(select => {
      expect(select).toHaveTextContent('Client A');
      expect(select).not.toHaveTextContent('Client B');
    });
  });

  // Test 3: HR 请求表单提交测试
  test('submits HR request form', () => {
    const mockAddHRRequest = jest.fn();
    renderWithProviders({
      requests: [approvedRequest],
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

  // Test 4: Budget 请求表单提交测试
  test('submits Budget request form', () => {
    const mockAddBudgetRequest = jest.fn();
    renderWithProviders({
      requests: [approvedRequest],
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
});