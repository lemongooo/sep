// src/components/SeniorCustomerService.js
import React, { useContext } from "react";
import { RequestsContext } from "../context/RequestContext";

function SeniorCustomerService() {
  const { requests, updateRequestStatus } = useContext(RequestsContext);
  const handleApprove = (index) => {
    updateRequestStatus(index, "Approved by SCS");
  };

  const handleReject = (index) => {
    updateRequestStatus(index, "Rejected by SCS");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-4">
          Senior Customer Service - Review Requests
        </h3>
        {requests.length === 0 ? (
          <p className="text-gray-500">No requests available for review.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request, index) => (
              <li key={index} className="p-4 border border-gray-300 rounded-md">
                <p>
                  <strong>Client Name:</strong> {request.clientName}
                </p>
                <p>
                  <strong>Event Type:</strong> {request.eventType}
                </p>
                <p>
                  <strong>Date:</strong> {request.date}
                </p>
                <p>
                  <strong>Budget:</strong> {request.budget}
                </p>
                <p>
                  <strong>Details:</strong> {request.details}
                </p>
                <p>
                  <strong>Comment:</strong> {request.comment || "No comment"}
                </p>
                <p>
                  <strong>Status:</strong> {request.status || "Pending"}
                </p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleApprove(index)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    disabled={
                      request.status === "Approved" ||
                      request.status === "Rejected"
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(index)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    disabled={
                      request.status === "Approved" ||
                      request.status === "Rejected"
                    }
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SeniorCustomerService;
