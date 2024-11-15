import React, { useState, useContext } from 'react';
import { RequestsContext } from '../context/RequestContext';

function TaskAllocate() {
  const { requests, allocateRequest } = useContext(RequestsContext);
  const [selectedTeams, setSelectedTeams] = useState({});

  // 过滤出需要分配的请求（状态为 Pending 的请求）
  const requestsToAllocate = requests?.filter(
    request => request.status === "Pending"
  ) || [];

  const handleTeamChange = (index, team) => {
    setSelectedTeams(prev => {
      const currentTeams = prev[index] || [];
      const newTeams = currentTeams.includes(team)
        ? currentTeams.filter(t => t !== team)
        : [...currentTeams, team];
      
      return {
        ...prev,
        [index]: newTeams
      };
    });
  };

  const handleAllocate = (requestIndex) => {
    const teams = selectedTeams[requestIndex] || [];
    if (teams.length === 0) {
      alert("Please select at least one team");
      return;
    }

    // 找到在原始 requests 数组中的实际索引
    const actualIndex = requests.findIndex(r => r === requestsToAllocate[requestIndex]);
    
    if (actualIndex !== -1) {
      allocateRequest(actualIndex, teams);
      // 清除这个请求的选中团队
      setSelectedTeams(prev => {
        const newState = { ...prev };
        delete newState[requestIndex];
        return newState;
      });
      alert("Teams allocated successfully!");
    }
  };

  const availableTeams = [
    'Photography', 
    'Music', 
    'Graphic Design', 
    'Decorations', 
    'Network Support'
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-4">Task Allocate - Assign Requests to Sub-teams</h3>
        {requestsToAllocate.length === 0 ? (
          <p className="text-gray-500">No requests available for allocation.</p>
        ) : (
          <ul className="space-y-4">
            {requestsToAllocate.map((request, index) => (
              <li key={request.clientName + index} className="p-4 border border-gray-300 rounded-md">
                <p><strong>Client Name:</strong> {request.clientName}</p>
                <p data-testid={`event-type-${index}`}><strong>Event Type:</strong> {request.eventType}</p>
                <p><strong>Date:</strong> {request.date}</p>
                <p><strong>Budget:</strong> {request.budget}</p>
                {request.extraBudget && (
                  <div className="mt-2">
                    <p><strong>Extra Budget:</strong> {request.extraBudget.amount}</p>
                    <p><strong>Reason:</strong> {request.extraBudget.reason}</p>
                  </div>
                )}
                <p><strong>Details:</strong> {request.details}</p>
                <p><strong>Status:</strong> {request.status || 'Pending'}</p>
                <p><strong>Comments from FM:</strong> {request.comment || 'No comments'}</p>
                <p><strong>Assigned Team:</strong> {Array.isArray(request.team) ? request.team.join(', ') : request.team || 'Not Assigned'}</p>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Select Teams:</label>
                  <div className="mt-2">
                    {availableTeams.map((team) => (
                      <div key={team} data-testid={`team-checkbox-container-${index}`}>
                        <input
                          type="checkbox"
                          id={`${team}-${index}`}
                          data-testid={`team-checkbox-${team}-${index}`}
                          value={team}
                          checked={(selectedTeams[index] || []).includes(team)}
                          onChange={() => handleTeamChange(index, team)}
                          className="mr-2"
                        />
                        <label htmlFor={`${team}-${index}`}>{team}</label>
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