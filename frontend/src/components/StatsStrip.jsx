import React from 'react';

const StatsStrip = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col items-center justify-center">
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Open</span>
        <span className="text-2xl font-bold text-gray-800">{stats.byStatus.open}</span>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col items-center justify-center">
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">In Progress</span>
        <span className="text-2xl font-bold text-blue-600">{stats.byStatus.in_progress}</span>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col items-center justify-center">
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Resolved</span>
        <span className="text-2xl font-bold text-green-600">{stats.byStatus.resolved}</span>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col items-center justify-center">
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Closed</span>
        <span className="text-2xl font-bold text-gray-400">{stats.byStatus.closed}</span>
      </div>
      <div className="bg-red-50 rounded-lg shadow-sm p-4 border border-red-100 flex flex-col items-center justify-center">
        <span className="text-red-600 text-xs font-bold uppercase tracking-wider text-center">Breached Unresolved</span>
        <span className="text-2xl font-bold text-red-700">{stats.breachedUnresolved}</span>
      </div>
    </div>
  );
};

export default StatsStrip;
