// src/context/RequestsContext.js
import React, { createContext, useState, useEffect } from "react";

export const RequestsContext = createContext();

export const RequestsProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);

  // 初始化：从 localStorage 加载数据
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(storedRequests);
  }, []);

  // 每当 requests 更新时保存到 localStorage
  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  // 监听 localStorage 中 requests 的变化
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "requests") {
        const updatedRequests = JSON.parse(event.newValue);
        setRequests(updatedRequests); // 更新本地状态
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 清理监听器
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 添加新请求
  const addRequest = (newRequest) => {
    const updatedRequests = [
      ...requests,
      { ...newRequest, comment: "", status: "Pending", team: "" },
    ];
    setRequests(updatedRequests); // 更新状态并触发渲染
    localStorage.setItem("requests", JSON.stringify(updatedRequests)); // 更新 localStorage
  };

  // 更新请求状态
  const updateRequestStatus = (index, status) => {
    const updatedRequests = [...requests];
    updatedRequests[index].status = status;
    setRequests(updatedRequests); // 更新状态并触发渲染
    localStorage.setItem("requests", JSON.stringify(updatedRequests)); // 更新 localStorage
  };

  return (
    <RequestsContext.Provider
      value={{ requests, addRequest, updateRequestStatus }}
    >
      {children}
    </RequestsContext.Provider>
  );
};
