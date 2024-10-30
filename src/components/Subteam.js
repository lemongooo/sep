// src/components/Subteam.js
import React from 'react';

function Subteam({ requests }) {
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
                <h3 className="text-xl font-bold mb-4">Subteam Tasks</h3>
                {requests.length === 0 ? (
                    <p className="text-gray-500">No tasks assigned to you.</p>
                ) : (
                    <ul className="space-y-4">
                        {requests.map((request) => (
                            <li key={request.id} className="p-4 border border-gray-300 rounded-md">
                                <p><strong>Event Name:</strong> {request.eventName}</p>
                                <p><strong>Status:</strong> {request.status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Subteam;
