import React, { useContext } from 'react';
import { RequestsContext } from '../context/RequestContext';

function Subteam() {
    const { requests } = useContext(RequestsContext);
    
    // 过滤出分配给子团队的任务
    const assignedTasks = requests || [];

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
                <h3 className="text-xl font-bold mb-4">Subteam Tasks</h3>
                {assignedTasks.length === 0 ? (
                    <p className="text-gray-500">No tasks assigned to you.</p>
                ) : (
                    <ul className="space-y-4">
                        {assignedTasks.map((task, index) => (
                            <li key={task.clientName + index} className="p-4 border border-gray-300 rounded-md">
                                <p><strong>Client Name:</strong> {task.clientName}</p>
                                <p><strong>Event Type:</strong> {task.eventType}</p>
                                <p><strong>Date:</strong> {task.date}</p>
                                <p><strong>Budget:</strong> {task.budget}</p>
                                {task.extraBudget && (
                                    <div className="mt-2">
                                        <p><strong>Extra Budget:</strong> {task.extraBudget.amount}</p>
                                        <p><strong>Reason:</strong> {task.extraBudget.reason}</p>
                                    </div>
                                )}
                                <p><strong>Details:</strong> {task.details}</p>
                                <p><strong>Team Assignment:</strong> {
                                    Array.isArray(task.team) 
                                        ? task.team.join(', ') 
                                        : task.team || 'Not Assigned'
                                }</p>
                                <p><strong>Status:</strong> {task.status}</p>
                                <p><strong>Comments:</strong> {task.comment || 'No comments'}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Subteam;