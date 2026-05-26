import React from 'react';
import TicketCard from './TicketCard';

const columns = [
  { id: 'open', title: 'Open', dot: 'bg-amber-400', bg: 'bg-amber-50/50' },
  { id: 'in_progress', title: 'In Progress', dot: 'bg-blue-500', bg: 'bg-blue-50/50' },
  { id: 'resolved', title: 'Resolved', dot: 'bg-emerald-500', bg: 'bg-emerald-50/50' },
  { id: 'closed', title: 'Closed', dot: 'bg-gray-400', bg: 'bg-gray-50/50' }
];

const TicketBoard = ({ tickets, onUpdateStatus, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[500px]">
      {columns.map((col, colIdx) => {
        const colTickets = tickets.filter(t => t.status === col.id);
        return (
          <div 
            key={col.id} 
            className={`board-column flex flex-col rounded-xl ${col.bg} border border-gray-200/80 overflow-hidden animate-fade-in-up`}
            style={{ animationDelay: `${colIdx * 100}ms` }}
          >
            {/* Column header */}
            <div className="p-3 border-b border-gray-200/60 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 ${col.dot} rounded-full`} />
                  <h3 className="font-semibold text-gray-700 text-sm">{col.title}</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {colTickets.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5 custom-scrollbar">
              {colTickets.map((ticket, idx) => (
                <div 
                  key={ticket._id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(colIdx * 100) + (idx * 60)}ms` }}
                >
                  <TicketCard 
                    ticket={ticket} 
                    onUpdateStatus={onUpdateStatus}
                    onDelete={onDelete}
                  />
                </div>
              ))}
              {colTickets.length === 0 && (
                <div className="h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">No tickets</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketBoard;
