import React, { useState } from 'react';

function TaskAllocate({ requests, allocateRequest }) {
  const [selectedTeams, setSelectedTeams] = useState([]);

  const handleTeamChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTeams([...selectedTeams, value]);
    } else {
      setSelectedTeams(selectedTeams.filter((team) => team !== value));
    }
  };

  const handleAllocate = (index) => {
    allocateRequest(index, selectedTeams);
    setSelectedTeams([]); // Clear selection after allocation
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
                <p><strong>Assigned Team:</strong> {Array.isArray(request.team) ? request.team.join(', ') : request.team || 'Not Assigned'}</p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Select Teams:</label>
                  <div className="mt-2">
                    {['Photography', 'Music', 'Graphic Design', 'Decorations', 'Network Support'].map((team) => (
                      <div key={team}>
                        <input
                          type="checkbox"
                          value={team}
                          checked={selectedTeams.includes(team)}
                          onChange={handleTeamChange}
                          className="mr-2"
                        />
                        <label>{team}</label>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAllocate(index)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Allocate to Selected Teams
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
