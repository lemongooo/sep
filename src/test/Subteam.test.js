import { render, screen } from '@testing-library/react';
import Subteam from '../components/Subteam';
import { AuthProvider } from '../context/AuthContext';
import { RequestsContext } from '../context/RequestContext';

// 创建一个包装器组件来提供 mock 的 context 值
const renderWithProviders = (mockContextValue = {}) => {
    const defaultContextValue = {
        requests: [],
        ...mockContextValue
    };

    return {
        ...render(
            <AuthProvider>
                <RequestsContext.Provider value={defaultContextValue}>
                
                        <Subteam />
                    
                </RequestsContext.Provider>
            </AuthProvider>
        ),
        mockContextValue: defaultContextValue
    };
};

describe('Subteam Component', () => {
    // Test 1: 基础渲染测试
    test('renders empty state', () => {
        renderWithProviders();
        expect(screen.getByText(/No tasks assigned to you/i)).toBeInTheDocument();
    });

    // Test 2: 显示分配的任务
    test('displays assigned tasks', () => {
        const mockRequests = [
            {
                clientName: "Client A",
                eventType: "Conference",
                date: "2023-12-01",
                budget: 5000,
                details: "Details of Conference",
                status: "Pending",
                team: ["Photography", "Music"],
                comment: "Urgent request"
            }
        ];

        renderWithProviders({ requests: mockRequests });

        // 检查页面标题
        expect(screen.getByText(/Subteam Tasks/i)).toBeInTheDocument();
        
        // 验证任务详细信息
        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Client Name:') && 
                   element.textContent.includes('Client A');
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Event Type:') && 
                   element.textContent.includes('Conference');
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Team Assignment:') && 
                   element.textContent.includes('Photography, Music');
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Status:') && 
                   element.textContent.includes('Pending');
        })).toBeInTheDocument();

        expect(screen.getByText((content, element) => {
            return element.tagName.toLowerCase() === 'p' && 
                   element.textContent.includes('Comments:') && 
                   element.textContent.includes('Urgent request');
        })).toBeInTheDocument();
    });
});