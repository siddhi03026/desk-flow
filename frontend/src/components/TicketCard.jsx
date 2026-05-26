import React from 'react';

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200'
};

const TicketCard = ({ ticket, onUpdateStatus, onDelete }) => {
  const formatAge = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getValidTransitions = (status) => {
    switch (status) {
      case 'open': return [{ label: 'Start Progress', value: 'in_progress' }];
      case 'in_progress': return [{ label: 'Back to Open', value: 'open' }, { label: 'Resolve', value: 'resolved' }];
      case 'resolved': return [{ label: 'Reopen', value: 'in_progress' }, { label: 'Close', value: 'closed' }];
      case 'closed': return [{ label: 'Reopen to Resolved', value: 'resolved' }];
      default: return [];
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-sm border ${ticket.slaBreached && (ticket.status !== 'resolved' && ticket.status !== 'closed') ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white'} transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800 text-sm line-clamp-2" title={ticket.subject}>{ticket.subject}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 mb-3 line-clamp-3">{ticket.description}</p>
      <p className="text-xs text-gray-600 mb-3 truncate" title={ticket.customerEmail}>{ticket.customerEmail}</p>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-4 font-mono bg-gray-50 rounded p-1">
        <span>Age: {formatAge(ticket.ageMinutes)}</span>
        {ticket.slaBreached && (
          <span className="text-red-600 font-bold flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            SLA Breached
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {getValidTransitions(ticket.status).map(transition => (
          <button
            key={transition.value}
            onClick={() => onUpdateStatus(ticket._id, transition.value)}
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            {transition.label}
          </button>
        ))}
        <button
          onClick={() => onDelete(ticket._id)}
          className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 ml-auto rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
