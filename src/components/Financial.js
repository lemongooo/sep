// src/components/Financial.js
import React, { useState } from "react";

function Financial({
  requests,
  addComment,
  budgetRequests,
  updateBudgetRequestStatus,
}) {
  const [comments, setComments] = useState([]);

  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value;
    setComments(updatedComments);
  };

  const handleSubmitComment = (index) => {
    const comment = comments[index] || "";
    addComment(index, comment, "Commented by FM"); // 将请求状态更新为“Commented by FM”
    alert(`Comment for request ${index + 1} has been submitted!`);
    setComments((prev) => prev.map((_, i) => (i === index ? "" : prev[i]))); // 清空对应评论框
  };

  const handleBudgetRequestStatusChange = (index, status) => {
    updateBudgetRequestStatus(index, status);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">Financial - Review Requests</h3>
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
                <div className="mt-4">
                  <label
                    htmlFor={`comment-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Add Comment:
                  </label>
                  <textarea
                    id={`comment-${index}`}
                    value={comments[index] || ""}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => handleSubmitComment(index)}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Submit Comment
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-4">Budget Requests</h3>
        {budgetRequests.length === 0 ? (
          <p className="text-gray-500">
            No budget requests available for review.
          </p>
        ) : (
          <ul className="space-y-4">
            {budgetRequests.map((budgetRequest, index) => (
              <li key={index} className="p-4 border border-gray-300 rounded-md">
                <p>
                  <strong>Request ID:</strong> {budgetRequest.requestId}
                </p>
                <p>
                  <strong>Budget Amount:</strong> {budgetRequest.amount}
                </p>
                <p>
                  <strong>Reason:</strong> {budgetRequest.reason}
                </p>
                <p>
                  <strong>Status:</strong> {budgetRequest.status}
                </p>
                <button
                  onClick={() =>
                    handleBudgetRequestStatusChange(index, "Approved")
                  }
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleBudgetRequestStatusChange(index, "Rejected")
                  }
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ml-2"
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Financial;
