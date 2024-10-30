// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('');

    const login = (username, password) => {
        const users = {
            CS: { password: '123', role: 'Customer Service' },
            SCS: { password: '123', role: 'Senior Customer Service' },
            AM: { password: '123', role: 'Administration Manager' },
            HR: { password: '123', role: 'HR Manager' },
            FM: { password: '123', role: 'Financial Manager' },
            PM: { password: '123', role: 'Production Manager' },
            ST: { password: '123', role: 'Subteam' },
        };
        if (users[username] && users[username].password === password) {
            setIsAuthenticated(true);
            setRole(users[username].role);
        } else {
            alert("Incorrect username or password");
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole('');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
