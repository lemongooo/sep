import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';

function ProductionManager() {
  const { 
    requests, 
    hrRequests, 
    budgetRequests, 
    addHRRequest, 
    addBudgetRequest 
  } = useRequests();
  
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [staffCount, setStaffCount] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetReason, setBudgetReason] = useState('');

  // 筛选已被 AM 批准的请求
  const approvedRequests = requests.filter(req => req.status === 'Approved by Administration');

  const handleHRSubmit = (e) => {
    e.preventDefault();
    const newHRRequest = {
      requestId: selectedRequestId,
      staffCount,
      responsibilities, 
      timeFrame,
      status: 'Submitted',
    };
    addHRRequest(newHRRequest);
    setSelectedRequestId('');
    setStaffCount('');
    setResponsibilities('');
    setTimeFrame('');
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const selectedRequest = requests.find(req => req.id === selectedRequestId)
    const newBudgetRequest = {
      requestId: selectedRequestId,
      clientName: selectedRequest.clientName,
      eventType: selectedRequest.eventType,
      amount: budgetAmount,
      reason: budgetReason,
      status: 'Pending',
    };
    addBudgetRequest(newBudgetRequest);
    setSelectedRequestId('');
    setBudgetAmount('');
    setBudgetReason('');
  };

  return (
    <div className="p-4">
      <div className="flex space-x-8 mb-8">
        {/* HR Request Module */}
        <div className="w-1/2 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Staff Recruitment Request</h2>
          <form onSubmit={handleHRSubmit} className="space-y-4">
            <div>
              <label className="block">Select Event:</label>
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select a Request</option>
                {approvedRequests.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.id} - {req.clientName} - {req.eventType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block">Number of Staff Required:</label>
              <input
                type="number"
                value={staffCount}
                onChange={(e) => setStaffCount(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block">Responsibilities:</label>
              <textarea
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block">Time Frame:</label>
              <input
                type="text"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-4 w-full">
              Submit HR Request
            </button>
          </form>
        </div>

        {/* Budget Request Module */}
        <div className="w-1/2 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Budget Request</h2>
          <form onSubmit={handleBudgetSubmit} className="space-y-4">
            <div>
              <label className="block">Select Request:</label>
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select a Request</option>
                {approvedRequests.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.id} - {req.clientName} - {req.eventType}
                  </option>
                ))}
              </select>
            </div>
            {selectedRequestId && (
              <div className="p-3 bg-gray-50 rounded-md mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Current Budget:</span>{' '}
                  {approvedRequests.find(req => req.id === selectedRequestId)?.budget || 'N/A'}
                </p>
              </div>
            )}
            <div>
              <label className="block">Budget Amount:</label>
              <input
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block">Reason for Budget:</label>
              <textarea
                value={budgetReason}
                onChange={(e) => setBudgetReason(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-4 w-full">
              Submit Budget Request
            </button>
          </form>
        </div>
      </div>

      {/* Task Allocate Navigation */}
      <div className="mb-8">
        <Link to="/task-allocate">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Go to Task Allocate
          </button>
        </Link>
      </div>

      {/* Display HR Requests */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Submitted HR Requests</h3>
        {hrRequests.length === 0 ? (
          <p>No HR requests submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {hrRequests.map((hrRequest, index) => (
              <li key={index} className="p-4 border rounded-md bg-gray-50">
                <p><strong>Request ID:</strong> {hrRequest.requestId}</p>
                <p><strong>Staff Count:</strong> {hrRequest.staffCount}</p>
                <p><strong>Responsibilities:</strong> {hrRequest.responsibilities}</p>
                <p><strong>Time Frame:</strong> {hrRequest.timeFrame}</p>
                <p><strong>Status:</strong> {hrRequest.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Display Budget Requests */}
      <div>
        <h3 className="text-xl font-bold mb-4">Submitted Budget Requests</h3>
        {budgetRequests.length === 0 ? (
          <p>No budget requests submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {budgetRequests.map((budgetRequest, index) => (
              <li key={index} className="p-4 border rounded-md bg-gray-50">
                <p><strong>Client:</strong> {budgetRequest.clientName}</p>
                <p><strong>Event Type:</strong> {budgetRequest.eventType}</p>
                <p><strong>Budget Amount:</strong> {budgetRequest.amount}</p>
                <p><strong>Reason:</strong> {budgetRequest.reason}</p>
                <p><strong>Status:</strong> {budgetRequest.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductionManager;