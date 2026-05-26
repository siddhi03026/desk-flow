import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import * as api from './services/api';
import StatsStrip from './components/StatsStrip';
import TicketBoard from './components/TicketBoard';
import CreateTicketForm from './components/CreateTicketForm';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
      toast.error('Failed to load data. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, [filterPriority, filterBreached]);

  useEffect(() => {
    fetchData();
    // Setup polling every 30s to keep ages and SLA updated
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleCreateTicket = async (ticketData) => {
    try {
      await api.createTicket(ticketData);
      toast.success('Ticket created successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create ticket');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateTicketStatus(id, status);
      toast.success('Ticket status updated');
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">D</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">DeskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Priority:</label>
              <select 
                className="input-field py-1"
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
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="breachFilter"
                checked={filterBreached}
                onChange={(e) => setFilterBreached(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="breachFilter" className="text-sm text-gray-600 cursor-pointer">SLA Breached</label>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Board & Stats */}
        <div className="flex-1 flex flex-col min-w-0">
          <StatsStrip stats={stats} />
          {isLoading && !tickets.length ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <TicketBoard 
              tickets={tickets} 
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteTicket}
            />
          )}
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24">
            <CreateTicketForm onSubmit={handleCreateTicket} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
