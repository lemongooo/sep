import { render, screen, fireEvent } from "@testing-library/react";
import HR from "../components/HR";
import { AuthProvider } from "../context/AuthContext";
import { RequestsContext } from "../context/RequestContext";

// 创建一个包装器组件来提供 mock 的 context 值
const renderWithProviders = (mockContextValue = {}) => {
    const defaultContextValue = {
        hrRequests: [],
        updateHRRequestStatus: jest.fn(),
        ...mockContextValue
    };

    return {
        ...render(
            <AuthProvider>
                <RequestsContext.Provider value={defaultContextValue}>
                    <HR />
                </RequestsContext.Provider>
            </AuthProvider>
        ),
        mockContextValue: defaultContextValue
    };
};

describe('HR Component', () => {
    // Test 1: 基础渲染测试 - 无请求
    test('renders empty state', () => {
        renderWithProviders();
        expect(screen.getByText(/No HR requests available/i)).toBeInTheDocument();
    });

    // Test 2: 显示 HR 请求并测试状态更新
    test('displays HR request and allows status update', () => {
        const mockHrRequests = [
            {
                requestId: "REQ001",
                staffCount: 5,
                responsibilities: "Manage team operations",
                timeFrame: "Q4 2023",
                status: "Submitted",
            }
        ];

        const { mockContextValue } = renderWithProviders({ hrRequests: mockHrRequests });

        // 检查页面标题
        expect(screen.getByText(/HR Requests/i)).toBeInTheDocument();
        
        // 验证 HR 请求详细信息
        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Request ID:') && 
                   element.textContent.includes('REQ001');
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Responsibilities:') && 
                   element.textContent.includes('Manage team operations');
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Time Frame:') && 
                   element.textContent.includes('Q4 2023');
        })).toBeInTheDocument();

        // 测试状态更新功能
        const statusDropdown = screen.getByDisplayValue(/Submitted/i);
        expect(statusDropdown).toBeInTheDocument();

        fireEvent.change(statusDropdown, { target: { value: "Approved" } });
        expect(mockContextValue.updateHRRequestStatus).toHaveBeenCalledWith(0, "Approved");
    });
});