import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import * as api from './services/api';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import ConnectionStatus from './components/ConnectionStatus';
import StatsStrip from './components/StatsStrip';
import TicketBoard from './components/TicketBoard';
import CreateTicketForm from './components/CreateTicketForm';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Filters
  const [filterPriority, setFilterPriority] = useState('');
  const [filterBreached, setFilterBreached] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const filters = {};
      if (filterPriority) filters.priority = filterPriority;
      if (filterBreached) filters.breached = 'true';
      
      const [ticketsRes, statsRes] = await Promise.all([
        api.getTickets(filters),
        api.getStats()
      ]);
      
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load data. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, [filterPriority, filterBreached]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleCreateTicket = async (ticketData) => {
    try {
      await api.createTicket(ticketData);
      toast.success('🎉 Ticket created successfully!');
      fetchData();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create ticket');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateTicketStatus(id, status);
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await api.deleteTicket(id);
      toast.success('Ticket deleted');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete ticket');
    }
  };

  const totalTickets = tickets.length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#1e293b',
              color: '#f8fafc',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
        
        <ConnectionStatus />
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-extrabold text-lg leading-none">D</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">DeskFlow</h1>
                <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Support Dashboard</p>
              </div>
              {totalTickets > 0 && (
                <span className="ml-2 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                  {totalTickets}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Filters */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs text-gray-500 font-medium">Priority</label>
                  <select 
                    id="priorityFilter"
                    className="input-field py-1.5 pr-8 text-xs w-28"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    id="breachFilter"
                    checked={filterBreached}
                    onChange={(e) => setFilterBreached(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  <span className="text-xs text-gray-500 font-medium">SLA Breached</span>
                </label>
              </div>

              {/* Create button */}
              <button 
                id="createTicketBtn"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="btn-primary flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Ticket</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Filters */}
        <div className="sm:hidden bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-3">
          <select 
            className="input-field py-1.5 text-xs flex-1"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              checked={filterBreached}
              onChange={(e) => setFilterBreached(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="text-xs text-gray-500 font-medium">Breached</span>
          </label>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col lg:flex-row gap-6">
          
          {/* Left Side: Board & Stats */}
          <div className="flex-1 flex flex-col min-w-0">
            <StatsStrip stats={stats} />
            {isLoading && !tickets.length ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="skeleton h-10 rounded-none" />
                    <div className="p-3 space-y-3">
                      <div className="skeleton skeleton-card" />
                      <div className="skeleton skeleton-card" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <TicketBoard 
                tickets={tickets} 
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteTicket}
              />
            )}
          </div>

          {/* Right Side: Form (desktop always visible, mobile toggleable) */}
          <div className={`w-full lg:w-80 shrink-0 ${isFormOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 animate-slide-in-right">
              <CreateTicketForm onSubmit={handleCreateTicket} isLoading={isLoading} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200/60 bg-white/50 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs text-gray-400">
            <span>DeskFlow v1.0 — Support Ticket Dashboard</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Live
            </span>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
