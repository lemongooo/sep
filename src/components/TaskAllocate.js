// src/components/TaskAllocate.js
import React, { useState } from 'react';
function TaskAllocate({ requests, allocateRequest }) {
    const [selectedTeam, setSelectedTeam] = useState('');
  
    const handleTeamChange = (e) => {
      setSelectedTeam(e.target.value);
    };
  
    const handleAllocate = (index) => {
      allocateRequest(index, selectedTeam);
    };
  
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
          <h3 className="text-xl font-bold mb-4">Task Allocate - Assign Requests to Sub-teams</h3>
          {requests.length === 0 ? (
            <p className="text-gray-500">No requests available for allocation.</p>
          ) : (
            <ul className="space-y-4">
              {requests.map((request, index) => (
                <li key={index} className="p-4 border border-gray-300 rounded-md">
                  <p><strong>Client Name:</strong> {request.clientName}</p>
                  <p><strong>Event Type:</strong> {request.eventType}</p>
                  <p><strong>Date:</strong> {request.date}</p>
                  <p><strong>Budget:</strong> {request.budget}</p>
                  <p><strong>Details:</strong> {request.details}</p>
                  <p><strong>Status:</strong> {request.status || 'Pending'}</p>
                  <p><strong>Assigned Team:</strong> {typeof request.team === 'object' ? JSON.stringify(request.team) : request.team || 'Not Assigned'}</p>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Select Team:</label>
                    <select
                      value={selectedTeam}
                      onChange={handleTeamChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    >
                      <option value="">Select a team</option>
                      <option value="Team A">Team A</option>
                      <option value="Team B">Team B</option>
                      <option value="Team C">Team C</option>
                    </select>
                    <button
                      onClick={() => handleAllocate(index)}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Allocate to Team
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
  
  export default TaskAllocate;
  
