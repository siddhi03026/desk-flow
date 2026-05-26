import React, { useEffect, useState } from 'react';

const AnimatedNumber = ({ value, className }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = value || 0;
    const duration = 600;
    const start = display;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(start + (target - start) * eased));
      
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span className={className}>{display}</span>;
};

const statConfig = [
  { 
    key: 'open', 
    label: 'Open', 
    getValue: s => s.byStatus.open,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: (
      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    )
  },
  { 
    key: 'in_progress', 
    label: 'In Progress', 
    getValue: s => s.byStatus.in_progress,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    key: 'resolved', 
    label: 'Resolved', 
    getValue: s => s.byStatus.resolved,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    icon: (
      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    key: 'closed', 
    label: 'Closed', 
    getValue: s => s.byStatus.closed,
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-100',
    icon: (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  },
  { 
    key: 'breached', 
    label: 'SLA Breached', 
    getValue: s => s.breachedUnresolved,
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    isAlert: true,
    icon: (
      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const StatsStrip = ({ stats }) => {
  if (!stats) return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="skeleton h-20 rounded-xl" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {statConfig.map((stat, index) => {
        const value = stat.getValue(stats);
        return (
          <div 
            key={stat.key} 
            className={`stat-card ${stat.bg} rounded-xl p-4 border ${stat.border} flex flex-col items-center justify-center gap-1 animate-fade-in-up ${stat.isAlert && value > 0 ? 'animate-pulse-red' : ''}`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              {stat.icon}
              <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">{stat.label}</span>
            </div>
            <AnimatedNumber value={value} className={`text-2xl font-extrabold ${stat.color}`} />
          </div>
        );
      })}
    </div>
  );
};

export default StatsStrip;
