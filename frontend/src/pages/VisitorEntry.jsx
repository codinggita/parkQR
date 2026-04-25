import React, { useState } from 'react';
import VisitorForm from '../components/VisitorForm';
import QRModal from '../components/QRModal';
import { UserPlus, ShieldPlus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const VisitorEntry = () => {
  const [qrCode, setQrCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVisitorSubmit = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.ok ? await response.json() : null;

      if (response.ok) {
        setQrCode(data.qrCode);
        setExpiresAt(data.expiresAt);
      } else {
        const errData = await response.json();
        setError(errData.message || 'Verification system rejected request');
      }
    } catch (err) {
      setError('Cloud Sync Error: Access control node is unreachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Info Card */}
        <div className="md:col-span-1 space-y-6">
            <div className="bg-primary/10 p-6 rounded-[32px] border border-primary/20">
                <ShieldPlus className="text-primary mb-4" size={32} />
                <h2 className="text-xl font-black text-white mb-2">Secure Pass Generation</h2>
                <p className="text-slate-400 text-xs font-bold leading-relaxed">
                    Registered visitors are allocated temporary virtual tokens with dynamic expiry protocols.
                </p>
            </div>
            
            <div className="p-6 bg-white/5 border border-white/5 rounded-[32px]">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-slate-500 mb-4">Procedure</h3>
                <div className="space-y-4">
                    <StepItem num="01" label="Input Identity" />
                    <StepItem num="02" label="Validate Vehicle" />
                    <StepItem num="03" label="Issue Smart Token" />
                </div>
            </div>
        </div>

        {/* Right: Form Core */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="flex items-center gap-3 mb-10">
                 <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <UserPlus className="text-primary" size={20} />
                 </div>
                 <h1 className="text-2xl font-black">Visitor Protocol</h1>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black flex items-center gap-3 mb-8"
              >
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <VisitorForm onSubmit={handleVisitorSubmit} loading={loading} />
        </div>
      </div>

      <QRModal 
        qrCode={qrCode} 
        expiresAt={expiresAt} 
        onClose={() => setQrCode(null)} 
      />
    </div>
  );
};

const StepItem = ({ num, label }) => (
    <div className="flex items-center gap-4 group cursor-help">
        <span className="text-[10px] font-black text-primary bg-primary/10 w-8 h-8 flex items-center justify-center rounded-lg border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">{num}</span>
        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-all">{label}</span>
    </div>
);

export default VisitorEntry;
