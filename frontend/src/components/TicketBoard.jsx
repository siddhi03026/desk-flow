import React from 'react';
import TicketCard from './TicketCard';

const TicketBoard = ({ tickets, onUpdateStatus, onDelete }) => {
  const columns = [
    { id: 'open', title: 'Open', bg: 'bg-gray-100' },
    { id: 'in_progress', title: 'In Progress', bg: 'bg-blue-50' },
    { id: 'resolved', title: 'Resolved', bg: 'bg-green-50' },
    { id: 'closed', title: 'Closed', bg: 'bg-gray-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
      {columns.map(col => (
        <div key={col.id} className={`flex flex-col rounded-lg ${col.bg} border border-gray-200 overflow-hidden`}>
          <div className="p-3 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-700 text-sm">{col.title}</h3>
            <span className="text-xs text-gray-500">
              {tickets.filter(t => t.status === col.id).length} tickets
            </span>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {tickets
              .filter(t => t.status === col.id)
              .map(ticket => (
                <TicketCard 
                  key={ticket._id} 
                  ticket={ticket} 
                  onUpdateStatus={onUpdateStatus}
                  onDelete={onDelete}
                />
              ))}
            {tickets.filter(t => t.status === col.id).length === 0 && (
              <div className="h-full flex items-center justify-center p-4">
                <p className="text-xs text-gray-400 text-center italic">No tickets in this column</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketBoard;
