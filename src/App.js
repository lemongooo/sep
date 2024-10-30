// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import CustomerService from './components/CustomerService';
import Financial from './components/Financial';
import SeniorCustomerService from './components/SeniorCustomerService';
import TaskAllocate from './components/TaskAllocate';
import ProductionManager from './components/ProductionManager';
import HR from './components/HR';
import Login from './components/Login';

// 模拟的用户数据
const users = {
  CS: { password: '123', role: 'Customer Service' },
  SCS: { password: '123', role: 'Senior Customer Service' },
  AM: { password: '123', role: 'Administration Manager' },
  HR: { password: '123', role: 'HR Manager' },
  FM: { password: '123', role: 'Financial Manager' },
  PM: { password: '123', role: 'Production Manager' },
};

function App() {
  const [requests, setRequests] = useState([]);
  const [hrRequests, setHRRequests] = useState([]);
  const [budgetRequests, setBudgetRequests] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  // 从 LocalStorage 加载请求数据
  useEffect(() => {
    const storedRequests = localStorage.getItem('requests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }

    const storedHRRequests = localStorage.getItem('hrRequests');
    if (storedHRRequests) {
      setHRRequests(JSON.parse(storedHRRequests));
    }

    const storedBudgetRequests = localStorage.getItem('budgetRequests');
    if (storedBudgetRequests) {
      setBudgetRequests(JSON.parse(storedBudgetRequests));
    }
  }, []);

  // 保存数据到 LocalStorage
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('requests', JSON.stringify(requests));
    }
  }, [requests]);

  useEffect(() => {
    if (hrRequests.length > 0) {
      localStorage.setItem('hrRequests', JSON.stringify(hrRequests));
    }
  }, [hrRequests]);

  useEffect(() => {
    if (budgetRequests.length > 0) {
      localStorage.setItem('budgetRequests', JSON.stringify(budgetRequests));
    }
  }, [budgetRequests]);

  // 监听 LocalStorage 事件以同步数据
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'requests') {
        const newRequests = JSON.parse(event.newValue);
        if (newRequests) {
          setRequests(newRequests);
        }
      } else if (event.key === 'hrRequests') {
        const newHRRequests = JSON.parse(event.newValue);
        if (newHRRequests) {
          setHRRequests(newHRRequests);
        }
      } else if (event.key === 'budgetRequests') {
        const newBudgetRequests = JSON.parse(event.newValue);
        if (newBudgetRequests) {
          setBudgetRequests(newBudgetRequests);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 登录函数
  const handleLogin = (username, password) => {
    if (users[username] && users[username].password === password) {
      setIsAuthenticated(true);
      setRole(users[username].role);
    } else {
      alert("Incorrect username or password");
    }
  };

  // 登出函数
  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('');
  };

  // 添加请求操作函数
  const addRequest = (newRequest) => {
    const updatedRequests = [...requests, { ...newRequest, comment: '', status: 'Pending', team: '' }];
    setRequests(updatedRequests);
  };

  const addHRRequest = (newHRRequest) => {
    const updatedHRRequests = [...hrRequests, { ...newHRRequest, status: 'Submitted' }];
    setHRRequests(updatedHRRequests);
  };

  const addBudgetRequest = (newBudgetRequest) => {
    const updatedBudgetRequests = [...budgetRequests, newBudgetRequest];
    setBudgetRequests(updatedBudgetRequests);
  };

  // 更新 HR 请求状态
  const updateHRRequestStatus = (index, status) => {
    const updatedHRRequests = [...hrRequests];
    updatedHRRequests[index].status = status;
    setHRRequests(updatedHRRequests);
    localStorage.setItem('hrRequests', JSON.stringify(updatedHRRequests));
  };

  // 更新 Budget 请求状态
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

  // 根据用户角色显示相应的页面
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
            <Route
              path="/task-allocate"
              element={<TaskAllocate requests={requests} allocateRequest={allocateRequest} />}
            />
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
        return (
          <Route
            path="/"
            element={
              <HR
                hrRequests={hrRequests || []}
                updateHRRequestStatus={updateHRRequestStatus}
              />
            }
          />
        );
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
                  <button onClick={handleLogout} className="text-white hover:text-gray-300">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="p-4">
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />

            {/* Role-Based Protected Route */}
            {isAuthenticated ? (
              renderRoleBasedRoutes()
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
