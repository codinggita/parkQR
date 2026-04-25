import React, { useState } from 'react';
import { User, Phone, Car, Home, Zap } from 'lucide-react';

const VisitorForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    flatNumber: '',
    isPriority: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full bg-slate-900/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label icon={<User size={14}/>} text="Full Identity" />
          <input 
            name="name" 
            placeholder="John Doe" 
            className={inputClass} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label icon={<Phone size={14}/>} text="Contact Relay" />
          <input 
            name="phone" 
            placeholder="+1 (555) 000-0000" 
            className={inputClass} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label icon={<Car size={14}/>} text="Vehicle ID" />
          <input 
            name="vehicle" 
            placeholder="XYZ-7788" 
            className={inputClass} 
            onChange={handleChange} 
          />
        </div>
        <div className="space-y-2">
          <Label icon={<Home size={14}/>} text="Destination Unit" />
          <input 
            name="flatNumber" 
            placeholder="WING-A 404" 
            className={inputClass} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white/3 p-4 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
        <input 
          type="checkbox" 
          name="isPriority" 
          id="isPriority" 
          className="w-5 h-5 rounded bg-slate-900 border-white/10 text-primary focus:ring-primary"
          onChange={handleChange} 
        />
        <label htmlFor="isPriority" className="flex flex-col cursor-pointer">
            <span className="text-sm font-black text-white group-hover:text-primary transition-all flex items-center gap-2">
                <Zap size={14} className="fill-primary text-primary" /> VIP HIGH-PRIORITY CLEARANCE
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">ALLOCATE PREMIUM SLOTS AUTOMATICALLY</span>
        </label>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? (
            <>
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                PROCESSING PROTOCOL...
            </>
        ) : (
            <>ISSUE SMART SECURITY PASS</>
        )}
      </button>
    </form>
  );
};

const Label = ({ icon, text }) => (
    <label className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-3 ml-1">
        {icon} {text}
    </label>
);

export default VisitorForm;
