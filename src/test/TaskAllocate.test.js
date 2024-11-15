import { render, screen, fireEvent } from '@testing-library/react';
import TaskAllocate from '../components/TaskAllocate';
import { AuthProvider } from "../context/AuthContext";
import { RequestsContext } from "../context/RequestContext";

// 创建一个包装器组件来提供 mock 的 context 值
const renderWithProviders = (mockContextValue = {}) => {
    const defaultContextValue = {
        requests: [],
        allocateRequest: jest.fn(),
        ...mockContextValue
    };

    return {
        ...render(
            <AuthProvider>
                <RequestsContext.Provider value={defaultContextValue}>
                    <TaskAllocate />
                </RequestsContext.Provider>
            </AuthProvider>
        ),
        mockContextValue: defaultContextValue
    };
};

describe('TaskAllocate Component', () => {
    // Test 1: 基础渲染测试 - 无请求
    test('renders empty state', () => {
        renderWithProviders();
        expect(screen.getByText(/No requests available for allocation/i)).toBeInTheDocument();
    });

    // Test 2: 显示请求并测试团队分配
    test('handles team allocation', () => {
        const mockRequests = [
            {
                clientName: 'Client A',
                eventType: 'Conference',
                date: '2023-12-01',
                budget: 5000,
                details: 'Details of Conference',
                status: 'Pending'
            }
        ];

        const { mockContextValue } = renderWithProviders({ requests: mockRequests });

        // 检查页面标题和基本信息
        expect(screen.getByText(/Task Allocate - Assign Requests to Sub-teams/i)).toBeInTheDocument();
        
        // 验证请求详细信息
        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Client Name:') && 
                   element.textContent.includes('Client A');
        })).toBeInTheDocument();

        expect(screen.getByTestId('event-type-0')).toHaveTextContent(/Conference/i);
        
        // 测试团队选择功能
        const photographyCheckbox = screen.getByTestId('team-checkbox-Photography-0');
        const musicCheckbox = screen.getByTestId('team-checkbox-Music-0');
        
        fireEvent.click(photographyCheckbox);
        fireEvent.click(musicCheckbox);

        // 验证复选框状态
        expect(photographyCheckbox).toBeChecked();
        expect(musicCheckbox).toBeChecked();

        // 测试分配功能
        const allocateButton = screen.getByText(/Allocate to Selected Teams/i);
        fireEvent.click(allocateButton);

        // 验证分配函数调用
        expect(mockContextValue.allocateRequest).toHaveBeenCalledWith(
            0, 
            ['Photography', 'Music']
        );
    });
});