// src/components/CustomerService.js
import React, { useState } from 'react';

function CustomerService({ addRequest, requests }) {
  const [formData, setFormData] = useState({
    clientName: '',
    eventType: '',
    date: '',
    budget: '',
    details: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRequest(formData);
    setFormData({
      clientName: '',
      eventType: '',
      date: '',
      budget: '',
      details: '',
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Service - Create Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name:</label>
            <input
              id="clientName"
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type:</label>
            <input
              id="eventType"
              type="text"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget:</label>
            <input
              id="budget"
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details:</label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Submit Request
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-4">Submitted Requests</h3>
        {requests.length === 0 ? (
          <p className="text-gray-500">No requests submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request, index) => (
              <li key={index} className="p-4 border border-gray-300 rounded-md">
                <p><strong>Client Name:</strong> {request.clientName}</p>
                <p><strong>Event Type:</strong> {request.eventType}</p>
                <p><strong>Date:</strong> {request.date}</p>
                <p><strong>Budget:</strong> {request.budget}</p>
                <p><strong>Details:</strong> {request.details}</p>
                <p><strong>Comment:</strong> {request.comment || 'None'}</p>
                <p><strong>Status:</strong> {request.status || 'Pending'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CustomerService;
