// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RequestsProvider, useRequests } from "./context/RequestContext";
import CustomerService from "./components/CustomerService";
import Financial from "./components/Financial";
import SeniorCustomerService from "./components/SeniorCustomerService";
import TaskAllocate from "./components/TaskAllocate";
import ProductionManager from "./components/ProductionManager";
import AdministrationManager from "./components/AM";
import HR from "./components/HR";
import Login from "./components/Login";
import Subteam from "./components/Subteam";

function AppContent() {
  const { isAuthenticated, role, logout } = useAuth();
  const { requests } = useRequests();

  // Render pages based on user role
  const renderRoleBasedRoutes = () => {
    switch (role) {
      case "Customer Service":
        return <Route path="/" element={<CustomerService />} />;
      case "Senior Customer Service":
        return <Route path="/" element={<SeniorCustomerService />} />;
      case "Production Manager":
        return (
          <>
            <Route path="/" element={<ProductionManager />} />
            <Route path="/task-allocate" element={<TaskAllocate />} />
          </>
        );
      case "Financial Manager":
        return (
          <Route
            path="/"
            element={
              <Financial 
                requests={requests.filter(request => request.status === "Approved by SCS")}
              />
            }
          />
        );
      case "Administration Manager":
        return (
          <Route
            path="/"
            element={
              <AdministrationManager 
                requests={requests.filter(request => request.status === "Commented by FM")}
              />
            }
          />
        );
      case "HR Manager":
        return(
<>
<Route path="/" element={<HR />} />
      <Route path="/HR" element={<HR />} />
</>
        ) 
      case "Subteam":
        return (
          <>
            <Route path="/" element={<Subteam />} />
            <Route path="/ST" element={<Subteam />} />
          </>
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

function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <AppContent />
      </RequestsProvider>
    </AuthProvider>
  );
}

export default App;