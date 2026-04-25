import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Users, LayoutDashboard, ShieldCheck, 
  ChevronRight, BarChart3, Database, AlertTriangle 
} from 'lucide-react';
import ParkingGrid from '../components/ParkingGrid';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const AdminPanel = () => {
    const [view, setView] = useState('insights');

    return (
        <div className="space-y-8 pb-20">
            {/* Real-time Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Direct Occupancy" val="78%" trend="+12" icon={<Activity />} color="text-primary" />
                <StatCard label="Active Sessions" val="1.2k" trend="+5" icon={<Users />} color="text-success" />
                <StatCard label="API Latency" val="44ms" trend="-3" icon={<Database />} color="text-amber-500" />
                <StatCard label="Threat Level" val="Minimal" trend="Stable" icon={<ShieldCheck />} color="text-primary" />
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-8 border-b border-white/5 pb-0">
                <ViewLink 
                    active={view === 'insights'} 
                    onClick={() => setView('insights')} 
                    icon={<BarChart3 size={18}/>} 
                    label="AI Insights" 
                />
                <ViewLink 
                    active={view === 'grid'} 
                    onClick={() => setView('grid')} 
                    icon={<LayoutDashboard size={18}/>} 
                    label="Live Grid" 
                />
                <ViewLink 
                    active={view === 'security'} 
                    onClick={() => setView('security')} 
                    icon={<AlertTriangle size={18}/>} 
                    label="Security Logs" 
                />
            </div>

            {/* Dynamic Viewport */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {view === 'grid' && <ParkingGrid />}
                        {view === 'insights' && <AnalyticsDashboard />}
                        {view === 'security' && <SecurityPanel />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const StatCard = ({ label, val, trend, icon, color }) => (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 hover:border-primary/40 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all"></div>
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 bg-white/5 rounded-2xl ${color} group-hover:scale-110 transition-all`}>
                {icon}
            </div>
            <div className="bg-success/10 text-success text-[10px] font-black px-2 py-1 rounded-lg italic tracking-widest">{trend}%</div>
        </div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-1">{label}</p>
        <h3 className="text-3xl font-black">{val}</h3>
    </div>
);

const ViewLink = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 pb-4 px-2 font-bold text-sm tracking-tight transition-all relative
            ${active ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
    >
        {icon}
        {label}
        {active && (
            <motion.div 
                layoutId="nav-active"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(37,99,235,0.4)]"
            />
        )}
    </button>
);

const SecurityPanel = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <Database className="text-primary" /> Master Access Logs
            </h3>
            <div className="space-y-4">
                <SecurityRow type="ENTRY" gate="North" time="10:22:04" />
                <SecurityRow type="EXIT" gate="West" time="10:25:55" />
                <SecurityRow type="DENIED" gate="South" time="10:30:12" isError />
                <SecurityRow type="ENTRY" gate="North" time="10:35:44" />
            </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h3 className="text-xl font-black mb-6">Threat Intelligence</h3>
            <div className="space-y-6">
                 <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-4">
                    <AlertTriangle className="text-red-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-black text-white">Unauthorized Access</p>
                        <p className="text-xs text-slate-400 mt-1">Token RE-55 detected at Gate B without clearance.</p>
                    </div>
                 </div>
            </div>
        </div>
    </div>
);

const SecurityRow = ({ type, gate, time, isError }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
        <div className="flex items-center gap-4">
             <div className={`text-[10px] font-black px-2 py-1 rounded-md ${isError ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>{type}</div>
             <div>
                <p className="text-sm font-bold">Gate {gate}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{time} UTC</p>
             </div>
        </div>
        <ChevronRight className="text-slate-600" size={16} />
    </div>
);

export default AdminPanel;
