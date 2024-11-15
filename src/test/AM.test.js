// src/test/AdministrationManager.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import AdministrationManager from '../components/AM';
import { AuthProvider } from '../context/AuthContext';
import { RequestsContext } from '../context/RequestContext';

// 创建一个包装器组件来提供 mock 的 context 值
const renderWithProviders = (mockContextValue = {}) => {
  const defaultContextValue = {
    requests: [],
    updateRequestStatus: jest.fn(),
    ...mockContextValue
  };

  return {
    ...render(
      <AuthProvider>
        <RequestsContext.Provider value={defaultContextValue}>
          <AdministrationManager />
        </RequestsContext.Provider>
      </AuthProvider>
    ),
    mockContextValue: defaultContextValue
  };
};

describe('AdministrationManager Component', () => {
  const mockRequest = {
    id: 'REQ001',
    clientName: 'Client A',
    eventType: 'Conference',
    status: 'Commented by FM',
    comment: 'Approved with conditions',
  };

  // Test 1: 基础渲染测试
  test('renders AdministrationManager component', () => {
    renderWithProviders({
      requests: [mockRequest]
    });

    // 检查标题和请求信息
    expect(screen.getByRole('heading', { name: /Administration Manager - Review Requests/i })).toBeInTheDocument();
    expect(screen.getByText(/Client A/i)).toBeInTheDocument();
    expect(screen.getByText(/Conference/i)).toBeInTheDocument();
    expect(screen.getByText(/Commented by FM/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved with conditions/i)).toBeInTheDocument();
    
    // 检查操作按钮
    expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
  });

  // Test 2: 请求状态更新测试
  test('updates request status', () => {
    const mockUpdateStatus = jest.fn();
    renderWithProviders({
      requests: [mockRequest],
      updateRequestStatus: mockUpdateStatus
    });

    // 测试批准操作
    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    expect(mockUpdateStatus).toHaveBeenCalledWith(mockRequest.id, 'Approved by Administration');

    // 测试拒绝操作
    fireEvent.click(screen.getByRole('button', { name: /Reject/i }));
    expect(mockUpdateStatus).toHaveBeenCalledWith(mockRequest.id, 'Rejected by Administration');
  });
});