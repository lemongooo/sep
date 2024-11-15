import React, { useContext, useState } from "react";
import { RequestsContext } from "../context/RequestContext";

function Financial() {
  const { requests, addComment, budgetRequests, updateBudgetRequestStatus } =
    useContext(RequestsContext);
  const [comments, setComments] = useState([]);

  // 过滤出 SCS 批准的请求
  const approvedRequests = requests.filter(
    (request) => request.status === "Approved by SCS"
  );

  const handleCommentChange = (index, value) => {
    const updatedComments = [...comments];
    updatedComments[index] = value;
    setComments(updatedComments);
  };

  const handleSubmitComment = (index) => {
    // 找到在原始 requests 数组中的实际索引
    const actualIndex = requests.findIndex(
      (r) => r === approvedRequests[index]
    );
    const comment = comments[index] || "";
    if (actualIndex !== -1) {
      addComment(actualIndex, comment, "Commented by FM");
      alert(`Comment for request ${index + 1} has been submitted!`);
      setComments((prev) => prev.map((_, i) => (i === index ? "" : prev[i])));
    }
  };

  const handleBudgetRequestStatusChange = (index, status) => {
    updateBudgetRequestStatus(index, status);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">Financial - Review Requests</h3>
        {approvedRequests.length === 0 ? (
          <p className="text-gray-500">No approved requests available for review.</p>
        ) : (
          <ul className="space-y-4">
            {approvedRequests.map((request, index) => (
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
                  <strong>Status:</strong> {request.status}
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
                    disabled={request.status === "Commented by FM"}
                  />
                  <button
                    onClick={() => handleSubmitComment(index)}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    disabled={request.status === "Commented by FM"}
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
