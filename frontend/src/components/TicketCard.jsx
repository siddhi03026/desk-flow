import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const priorityColors = {
  urgent: 'bg-red-50 text-red-700 border-red-200/60',
  high: 'bg-orange-50 text-orange-700 border-orange-200/60',
  medium: 'bg-blue-50 text-blue-700 border-blue-200/60',
  low: 'bg-slate-50 text-slate-700 border-slate-200/60'
};

const SLA_TARGETS = {
  urgent: 1 * 60 * 60 * 1000,
  high: 4 * 60 * 60 * 1000,
  medium: 24 * 60 * 60 * 1000,
  low: 72 * 60 * 60 * 1000
};

const TicketCard = ({ ticket, onUpdateStatus, onDelete }) => {
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [slaBreached, setSlaBreached] = useState(ticket.slaBreached);

  const getValidTransitions = (status) => {
    switch (status) {
      case 'open': return [{ label: 'Start Progress', value: 'in_progress' }];
      case 'in_progress': return [{ label: 'Back to Open', value: 'open' }, { label: 'Resolve', value: 'resolved' }];
      case 'resolved': return [{ label: 'Reopen', value: 'in_progress' }, { label: 'Close', value: 'closed' }];
      case 'closed': return [{ label: 'Reopen to Resolved', value: 'resolved' }];
      default: return [];
    }
  };

  useEffect(() => {
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      setTimeLeftStr('Resolved');
      setSlaBreached(ticket.slaBreached);
      return;
    }

    const updateSlaCountdown = () => {
      const createdAt = new Date(ticket.createdAt);
      const now = new Date();
      const slaTargetMs = SLA_TARGETS[ticket.priority] || SLA_TARGETS.low;
      const deadline = new Date(createdAt.getTime() + slaTargetMs);
      const diffMs = deadline.getTime() - now.getTime();

      if (diffMs <= 0) {
        setSlaBreached(true);
        const overdueMs = Math.abs(diffMs);
        const hours = Math.floor(overdueMs / (1000 * 60 * 60));
        const mins = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeftStr(`Overdue by ${hours}h ${mins}m`);
      } else {
        setSlaBreached(false);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeftStr(`${hours}h ${mins}m remaining`);
      }
    };

    updateSlaCountdown();
    const interval = setInterval(updateSlaCountdown, 60000);
    return () => clearInterval(interval);
  }, [ticket.createdAt, ticket.priority, ticket.status, ticket.slaBreached]);

  const createdTimeAgo = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });

  const cardStyle = slaBreached && (ticket.status !== 'resolved' && ticket.status !== 'closed')
    ? 'border-red-300 bg-red-50/40 hover:border-red-400'
    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md';

  return (
    <div className={`ticket-card p-4 rounded-xl shadow-sm border ${cardStyle} flex flex-col gap-3`}>
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug" title={ticket.subject}>
          {ticket.subject}
        </h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>
      
      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
        {ticket.description}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="truncate" title={ticket.customerEmail}>{ticket.customerEmail}</span>
      </div>

      <div className="flex flex-col gap-1 bg-slate-50/70 border border-slate-100 rounded-lg p-2.5 mt-1">
        <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
          <span>Created</span>
          <span className="font-semibold text-slate-700">{createdTimeAgo}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-medium">
          <span className="text-slate-500">SLA Status</span>
          <span className={`font-semibold ${slaBreached && (ticket.status !== 'resolved' && ticket.status !== 'closed') ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
            {timeLeftStr}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-1 pt-2 border-t border-slate-100">
        {getValidTransitions(ticket.status).map(transition => (
          <button
            key={transition.value}
            onClick={() => onUpdateStatus(ticket._id, transition.value)}
            className="action-btn text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
          >
            {transition.label}
          </button>
        ))}
        <button
          onClick={() => onDelete(ticket._id)}
          className="action-btn text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 ml-auto rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
