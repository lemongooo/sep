// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import CustomerService from './components/CustomerService';
import Financial from './components/Financial';
import SeniorCustomerService from './components/SeniorCustomerService';
import TaskAllocate from './components/TaskAllocate';
import ProductionManager from './components/ProductionManager';
import HR from './components/HR';
import Login from './components/Login';
import Subteam from './components/Subteam';

function AppContent() {
  const { isAuthenticated, role, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [hrRequests, setHRRequests] = useState([]);
  const [budgetRequests, setBudgetRequests] = useState([]);

  // Load request data from LocalStorage
  useEffect(() => {
    const storedRequests = localStorage.getItem('requests');
    if (storedRequests) setRequests(JSON.parse(storedRequests));

    const storedHRRequests = localStorage.getItem('hrRequests');
    if (storedHRRequests) setHRRequests(JSON.parse(storedHRRequests));

    const storedBudgetRequests = localStorage.getItem('budgetRequests');
    if (storedBudgetRequests) setBudgetRequests(JSON.parse(storedBudgetRequests));
  }, []);

  // Save data to LocalStorage
  useEffect(() => {
    if (requests.length > 0) localStorage.setItem('requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    if (hrRequests.length > 0) localStorage.setItem('hrRequests', JSON.stringify(hrRequests));
  }, [hrRequests]);

  useEffect(() => {
    if (budgetRequests.length > 0) localStorage.setItem('budgetRequests', JSON.stringify(budgetRequests));
  }, [budgetRequests]);

  // Update and add request functions
  const addRequest = (newRequest) => setRequests([...requests, { ...newRequest, comment: '', status: 'Pending', team: '' }]);
  const addHRRequest = (newHRRequest) => setHRRequests([...hrRequests, { ...newHRRequest, status: 'Submitted' }]);
  const addBudgetRequest = (newBudgetRequest) => setBudgetRequests([...budgetRequests, newBudgetRequest]);

  const updateHRRequestStatus = (index, status) => {
    const updatedHRRequests = [...hrRequests];
    updatedHRRequests[index].status = status;
    setHRRequests(updatedHRRequests);
    localStorage.setItem('hrRequests', JSON.stringify(updatedHRRequests));
  };

  const updateBudgetRequestStatus = (index, status) => {
    const updatedBudgetRequests = [...budgetRequests];
    updatedBudgetRequests[index].status = status;
    setBudgetRequests(updatedBudgetRequests);
    localStorage.setItem('budgetRequests', JSON.stringify(updatedBudgetRequests));
  };

  const allocateRequest = (index, team) => {
    const updatedRequests = [...requests];
    updatedRequests[index] = { ...updatedRequests[index], team };
    setRequests(updatedRequests);
    localStorage.setItem('requests', JSON.stringify(updatedRequests));
  };

  // Render pages based on user role
  const renderRoleBasedRoutes = () => {
    switch (role) {
      case 'Customer Service':
        return <Route path="/" element={<CustomerService requests={requests} addRequest={addRequest} />} />;
      case 'Senior Customer Service':
        return <Route path="/" element={<SeniorCustomerService requests={requests} />} />;
      case 'Production Manager':
        return (
          <>
            <Route
              path="/"
              element={
                <ProductionManager
                  requests={requests || []}
                  hrRequests={hrRequests || []}
                  budgetRequests={budgetRequests || []}
                  addHRRequest={addHRRequest}
                  addBudgetRequest={addBudgetRequest}
                  updateHRRequestStatus={updateHRRequestStatus}
                  updateBudgetRequestStatus={updateBudgetRequestStatus}
                />
              }
            />
            <Route path="/task-allocate" element={<TaskAllocate requests={requests} allocateRequest={allocateRequest} />} />
          </>
        );
      case 'Financial Manager':
        return (
          <Route
            path="/"
            element={
              <Financial
                requests={requests.filter((request) => request.status === 'Approved')}
                budgetRequests={budgetRequests || []}
                updateBudgetRequestStatus={updateBudgetRequestStatus}
              />
            }
          />
        );
      case 'HR Manager':
        return <Route path="/" element={<HR hrRequests={hrRequests || []} updateHRRequestStatus={updateHRRequestStatus} />} />;
      case 'Subteam':
        return <Route path="/" element={<Subteam requests={requests || []} />} />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <li className="text-white">{role}</li>
                <li>
                  <button onClick={logout} className="text-white hover:text-gray-300">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            {isAuthenticated ? renderRoleBasedRoutes() : <Route path="*" element={<Navigate to="/login" />} />}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
