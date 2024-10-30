// src/test/App.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        role: '',
        login: jest.fn(),
        logout: jest.fn(),
    }),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders Login page when not authenticated', () => {
    render(
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    );

    // Check that the Login component is rendered
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('navigates to the main page after login', () => {
    const mockLogin = jest.fn();
    const { useAuth } = require('../context/AuthContext');
    
    // Override the default implementation of useAuth
    useAuth.mockReturnValue({
        isAuthenticated: true,
        role: 'Customer Service',
        login: mockLogin,
        logout: jest.fn(),
    });

    render(
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    );

    // Check that the Customer Service route renders
    expect(screen.getByText(/Customer Service - Create Request/i)).toBeInTheDocument();
});

test('calls logout function when Logout button is clicked', () => {
    const mockLogout = jest.fn();
    const { useAuth } = require('../context/AuthContext');
    
    // Override the default implementation of useAuth
    useAuth.mockReturnValue({
        isAuthenticated: true,
        role: 'Customer Service',
        login: jest.fn(),
        logout: mockLogout,
    });

    render(
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    );

    // Click the logout button
    fireEvent.click(screen.getByText(/Logout/i));

    // Verify that logout function was called
    expect(mockLogout).toHaveBeenCalled();
});
