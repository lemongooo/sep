// src/test/Financial.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Financial from '../components/Financial';
import { AuthProvider } from '../context/AuthContext';
import { RequestsContext } from '../context/RequestContext';

// 创建一个包装器组件来提供 mock 的 context 值
const renderWithProviders = (mockContextValue = {}) => {
  const defaultContextValue = {
    requests: [],
    budgetRequests: [],
    addComment: jest.fn(),
    updateBudgetRequestStatus: jest.fn(),
    ...mockContextValue
  };

  return {
    ...render(
      <AuthProvider>
        <RequestsContext.Provider value={defaultContextValue}>
          <Financial />
        </RequestsContext.Provider>
      </AuthProvider>
    ),
    mockContextValue: defaultContextValue
  };
};

describe('Financial Component', () => {
  const mockRequest = {
    id: 'req_1',
    clientName: 'Client A',
    eventType: 'Conference',
    date: '2023-12-01',
    budget: '5000',
    details: 'Details of Conference',
    status: 'Approved by SCS'
  };

  const mockBudgetRequest = {
    requestId: 'req_1',
    clientName: 'Client A',
    eventType: 'Conference',
    amount: '3000',
    reason: 'Project funding',
    status: 'Pending'
  };

  // Test 1: 基础渲染测试
  test('renders Financial component', () => {
    renderWithProviders({
      requests: [mockRequest],
      budgetRequests: [mockBudgetRequest]
    });

    // 检查标题
    expect(screen.getByRole('heading', { name: /Financial - Review Requests/i })).toBeInTheDocument();
    
    // 检查请求内容
    expect(screen.getByText(/Client A/)).toBeInTheDocument();
    expect(screen.getByText(/Project funding/)).toBeInTheDocument();
    expect(screen.getByText(/3000/)).toBeInTheDocument();

    // 检查按钮
    expect(screen.getByRole('button', { name: /Submit Comment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
  });

  // Test 2: 评论提交测试
  test('submits comment for request', () => {
    const mockAddComment = jest.fn();
    renderWithProviders({
      requests: [mockRequest],
      addComment: mockAddComment
    });

    // 填写并提交评论
    const commentInput = screen.getByLabelText(/Add Comment:/i);
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Comment/i }));

    // 验证评论提交
    expect(mockAddComment).toHaveBeenCalledWith(0, 'Test comment', 'Commented by FM');
  });

  // Test 3: 预算请求状态更新测试
  test('updates budget request status', () => {
    const mockUpdateStatus = jest.fn();
    renderWithProviders({
      budgetRequests: [mockBudgetRequest],
      updateBudgetRequestStatus: mockUpdateStatus
    });

    // 测试批准操作
    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    expect(mockUpdateStatus).toHaveBeenCalledWith(0, 'Approved');

    // 测试拒绝操作
    fireEvent.click(screen.getByRole('button', { name: /Reject/i }));
    expect(mockUpdateStatus).toHaveBeenCalledWith(0, 'Rejected');
  });

  // Test 4: 空状态显示测试
  test('displays empty state messages', () => {
    renderWithProviders();
    
    expect(screen.getByText(/No approved requests available for review/i)).toBeInTheDocument();
    expect(screen.getByText(/No budget requests available for review/i)).toBeInTheDocument();
  });
});