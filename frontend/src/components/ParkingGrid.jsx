import React, { useState, useEffect } from 'react';
import { listenToParkingSlots } from '../services/parkingService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Shield, Info, Activity, 
  CheckCircle, AlertCircle, Bookmark 
} from 'lucide-react';

const ParkingGrid = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to real-time updates via the parking service
        const unsubscribe = listenToParkingSlots((data) => {
            setSlots(data);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Derived Statistics
    const totalSlots = slots.length;
    const occupiedCount = slots.filter(s => s.isOccupied).length;
    const freeCount = totalSlots - occupiedCount;
    const reservedCount = slots.filter(s => s.slotType === 'VIP' || s.slotType === 'Reserved').length;

    if (loading) return <SkeletonGrid />;

    return (
        <div className="space-y-8 animate-in">
            {/* Top Insight Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard label="Total Slots" val={totalSlots} icon={<Activity size={16}/>} color="var(--primary)" />
                <SummaryCard label="Available" val={freeCount} icon={<CheckCircle size={16}/>} color="var(--success)" />
                <SummaryCard label="Occupied" val={occupiedCount} icon={<AlertCircle size={16}/>} color="var(--error)" />
                <SummaryCard label="Reserved" val={reservedCount} icon={<Bookmark size={16}/>} color="var(--primary)" />
            </div>

            {/* Grid Container */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-xl font-black text-white">Live Facility Mapping</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Real-time Cloud Sync Active</p>
                    </div>
                </div>

                {slots.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center opacity-30">
                        <Info size={48} />
                        <p className="mt-4 font-black uppercase tracking-widest text-xs">No active slots defined in system</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        <AnimatePresence>
                            {slots.map((slot) => (
                                <SlotCard key={slot.id} slot={slot} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

const SlotCard = ({ slot }) => {
    const isOccupied = slot.isOccupied;
    const isReserved = slot.slotType === 'VIP' || slot.slotType === 'Reserved';

    return (
        <motion.div 
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`group relative aspect-[4/5] rounded-3xl border-2 transition-all p-5 flex flex-col items-center justify-between
                ${isOccupied 
                    ? 'bg-red-500/5 border-red-500/20' 
                    : isReserved 
                        ? 'bg-blue-500/5 border-blue-500/20' 
                        : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50'}`}
        >
            <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg
                ${isOccupied ? 'bg-red-500/20 text-red-500' : isReserved ? 'bg-blue-500/20 text-blue-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                {slot.slotType}
            </div>

            <div className={`${isOccupied ? 'text-red-500' : isReserved ? 'text-blue-500' : 'text-slate-500'}`}>
                {isReserved ? <Shield size={32} /> : <Car size={32} />}
            </div>

            <div className="text-center">
                <span className="text-xl font-black text-white">{slot.slotId}</span>
                {isOccupied && <p className="text-[9px] font-black text-slate-500 uppercase mt-1 truncate max-w-[80px]">{slot.vehicle || 'Unknown'}</p>}
            </div>

            {/* Hover State Detail */}
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 z-10 border border-white/ client-10">
                <p className="text-[10px] font-black text-primary mb-1 uppercase tracking-widest">{slot.slotId}</p>
                <p className="text-xs font-bold text-white">{isOccupied ? slot.vehicle : 'Available'}</p>
            </div>
        </motion.div>
    );
};

const SummaryCard = ({ label, val, icon, color }) => (
    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
        <div className="p-2 rounded-xl bg-white/5" style={{ color }}>{icon}</div>
        <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-xl font-black text-white leading-none">{val}</p>
        </div>
    </div>
);

const SkeletonGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-4 animate-pulse">
        {[...Array(16)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-white/5 rounded-3xl border border-white/5"></div>
        ))}
    </div>
);

export default ParkingGrid;
