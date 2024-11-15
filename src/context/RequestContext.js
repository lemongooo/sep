// src/context/RequestContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

export const RequestsContext = createContext();

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
};

export const RequestsProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [hrRequests, setHRRequests] = useState([]);
  const [budgetRequests, setBudgetRequests] = useState([]);

  // 初始化加载数据
  useEffect(() => {
    const loadStoredData = () => {
      const storedRequests = localStorage.getItem("requests");
      if (storedRequests) setRequests(JSON.parse(storedRequests));

      const storedHRRequests = localStorage.getItem("hrRequests");
      if (storedHRRequests) setHRRequests(JSON.parse(storedHRRequests));

      const storedBudgetRequests = localStorage.getItem("budgetRequests");
      if (storedBudgetRequests) setBudgetRequests(JSON.parse(storedBudgetRequests));
    };

    loadStoredData();

    const handleStorageChange = (event) => {
      if (event.key === "requests") {
        setRequests(JSON.parse(event.newValue));
      } else if (event.key === "hrRequests") {
        setHRRequests(JSON.parse(event.newValue));
      } else if (event.key === "budgetRequests") {
        setBudgetRequests(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 保存到localStorage
  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem("requests", JSON.stringify(requests));
    }
  }, [requests]);

  useEffect(() => {
    if (hrRequests.length > 0) {
      localStorage.setItem("hrRequests", JSON.stringify(hrRequests));
    }
  }, [hrRequests]);

  useEffect(() => {
    if (budgetRequests.length > 0) {
      localStorage.setItem("budgetRequests", JSON.stringify(budgetRequests));
    }
  }, [budgetRequests]);

  const addRequest = (newRequest) => {
    const id = `req_${Date.now()}`; 
    setRequests(prev => [...prev, { 
      ...newRequest,
      id, comment: "", status: "Pending", team: "" }]);
  };

  // {requests.map((req, index) => (
  //   <option key={index} value={req.id}>
  //     {req.id} - {req.clientName} - {req.eventType}
  //   </option>
  // ))}

  // const updateRequestStatus = (index, status) => {
  //   setRequests(prev => {
  //     const updated = [...prev];
  //     updated[index] = { ...updated[index], status };
  //     return updated;
  //   });
  // };

  const updateRequestStatus = (requestId, status) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status } 
        : request
    ));
  };

  const addComment = (index, comment) => {
    setRequests(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], comment, status: "Commented by FM" };
      return updated;
    });
  };

  const addHRRequest = (newHRRequest) => {
    setHRRequests(prev => [...prev, { ...newHRRequest, status: "Submitted" }]);
  };

  const addBudgetRequest = (newBudgetRequest) => {
    setBudgetRequests(prev => [...prev, newBudgetRequest]);
  };

  const updateBudgetRequestStatus = (index, status) => {
    setBudgetRequests(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status };
      // 如果预算请求被批准，更新对应的request
      if (status === 'Approved') {
        const budgetRequest = updated[index];
        setRequests(prevRequests => {
          return prevRequests.map(request => {
            if (request.id === budgetRequest.requestId) {
              console.log("updated budget request");
              return {
                ...request,
                extraBudget: {
                  amount: budgetRequest.amount,
                  reason: budgetRequest.reason
                }
                
              };
              
            }
            
            return request;
          });
        });
      }
      
      return updated;
    });
  };

  const updateHRRequestStatus = (index, status) => {
    setHRRequests(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status };
      return updated;
    });
  };

  const allocateRequest = (index, team) => {
    setRequests(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], team };
      return updated;
    });
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        hrRequests,
        budgetRequests,
        addRequest,
        addHRRequest,
        addBudgetRequest,
        updateRequestStatus,
        updateHRRequestStatus,
        updateBudgetRequestStatus,
        allocateRequest,
        addComment,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};