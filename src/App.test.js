// src/test/App.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { RequestsProvider } from './context/RequestContext';

// Mock the AuthContext
jest.mock('./context/AuthContext', () => {
  const mockUseAuth = jest.fn(() => ({
    isAuthenticated: false,
    role: '',
    login: jest.fn(),
    logout: jest.fn(),
  }));
  return {
    useAuth: mockUseAuth,
    AuthProvider: ({ children }) => children,
  };
});

// Mock RequestContext with minimal setup
jest.mock('./context/RequestContext', () => ({
  useRequests: () => ({
    requests: [],
  }),
  RequestsProvider: ({ children }) => children,
}));

const { useAuth } = require('./context/AuthContext');

// Helper function to render App with all required providers
const renderApp = () => {
  return render(
    <AuthProvider>
      <RequestsProvider>
        <App />
      </RequestsProvider>
    </AuthProvider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('App Basic Tests', () => {
  test('renders Login page when not authenticated', () => {
    useAuth.mockImplementation(() => ({
      isAuthenticated: false,
      role: '',
      login: jest.fn(),
      logout: jest.fn(),
    }));

    renderApp();
    // 使用 getAllByText 来避免多个匹配元素的问题
    expect(screen.getAllByText(/Login/i)[0]).toBeInTheDocument();
  });

  test('renders Customer Service view when authenticated as Customer Service', () => {
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      role: 'Customer Service',
      login: jest.fn(),
      logout: jest.fn(),
    }));

    renderApp();
    expect(screen.getByText(/Customer Service/i)).toBeInTheDocument();
  });

  test('renders HR view when authenticated as HR Manager', () => {
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      role: 'HR Manager',
      login: jest.fn(),
      logout: jest.fn(),
    }));

    renderApp();
    expect(screen.getByText(/HR Manager/i)).toBeInTheDocument();
  });

  test('renders AM view', () => {
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      role: 'Administration Manager',
      login: jest.fn(),
      logout: jest.fn(),
    }));

    renderApp();
    expect(screen.getByText(/Administration Manager/i)).toBeInTheDocument();
  });

  test('calls logout function when Logout button is clicked', () => {
    const mockLogout = jest.fn();
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      role: 'Customer Service',
      login: jest.fn(),
      logout: mockLogout,
    }));

    renderApp();
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});