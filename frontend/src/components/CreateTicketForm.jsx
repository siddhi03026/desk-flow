import React, { useState } from 'react';

const CreateTicketForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ subject: '', description: '', customerEmail: '', priority: 'medium' });
      setErrors({});
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }
  };

  return (
    <div className={`glass-card rounded-2xl shadow-sm border border-slate-200/80 p-6 transition-all ${isSuccess ? 'form-success ring-2 ring-emerald-500/30 border-emerald-500' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800">Create New Ticket</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
          <input
            type="text"
            className={`input-field ${errors.subject ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/10' : ''}`}
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            placeholder="Brief summary of the issue"
            maxLength={100}
          />
          {errors.subject && <p className="text-xs text-red-500 mt-1 font-medium">{errors.subject}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Customer Email</label>
          <input
            type="email"
            className={`input-field ${errors.customerEmail ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/10' : ''}`}
            value={formData.customerEmail}
            onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
            placeholder="customer@example.com"
          />
          {errors.customerEmail && <p className="text-xs text-red-500 mt-1 font-medium">{errors.customerEmail}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Priority Target</label>
          <select
            className="input-field cursor-pointer"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="low">Low (72h SLA)</option>
            <option value="medium">Medium (24h SLA)</option>
            <option value="high">High (4h SLA)</option>
            <option value="urgent">Urgent (1h SLA)</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
            <span className="text-[10px] text-slate-400 font-medium">
              {formData.description.length}/500
            </span>
          </div>
          <textarea
            rows="3"
            className={`input-field resize-none ${errors.description ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/10' : ''}`}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Detailed explanation of request..."
            maxLength={500}
          ></textarea>
          {errors.description && <p className="text-xs text-red-500 mt-1 font-medium">{errors.description}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading || isSuccess}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-all shadow-sm active:scale-[0.98] ${
            isSuccess 
              ? 'bg-emerald-600 text-white cursor-default' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </>
          ) : isSuccess ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ticket Submitted!
            </>
          ) : (
            'Create Ticket'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateTicketForm;
