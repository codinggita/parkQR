import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, CheckCircle, 
  Clock, MapPin, ScanLine, RotateCcw, Zap
} from 'lucide-react';

const GuardScanner = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const startScanner = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    
    setTimeout(() => {
        const scanner = new Html5QrcodeScanner("reader", { 
          fps: 15, 
          qrbox: { width: 280, height: 280 },
          rememberLastUsedCamera: true,
          aspectRatio: 1.0
        });
        scanner.render(onScanSuccess, onScanError);
        window.scannerInstance = scanner;
    }, 200);
  };

  const stopScanner = () => {
    if (window.scannerInstance) {
        window.scannerInstance.clear().catch(e => console.warn(e));
        setIsScanning(false);
    }
  };

  const onScanSuccess = async (qrData) => {
     if (loading) return;
     setLoading(true);
     
     try {
         const res = await fetch('http://localhost:5000/api/visitors/scan-qr', {
             method: 'POST',
             headers: { 
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${user?.token}`
             },
             body: JSON.stringify({ qrData, gateName: 'NORTH-TERMINAL-01' })
         });
         
         const data = await res.json();
         
         if (res.status === 401) {
             setError('TERMINAL REJECTED: Security Token Invalid');
             stopScanner();
         } else if (data.success) {
             setScanResult({ ...data.data, message: data.message, type: 'success' });
             if (window.navigator.vibrate) window.navigator.vibrate(100);
             stopScanner();
         } else {
             setScanResult({ message: data.message, type: 'error' });
             if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
             stopScanner();
         }
     } catch (e) {
         setError('NETWORK DESYNC: Access Node Offline');
     } finally {
         setLoading(false);
     }
  };

  const onScanError = () => {}; // Noise filter

  return (
    <div className="max-w-6xl mx-auto py-6 animate-in">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <ScanLine className="text-primary" size={28} /> Guard Terminal
                </h1>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">Biometric & Optical Clearance Logic</p>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                <MapPin size={16} className="text-primary" />
                <span className="text-xs font-black tracking-widest">GATE-NORTH-A1</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Scanner Viewport */}
            <div className="bg-slate-900 border-2 border-white/5 rounded-[40px] aspect-square relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                {!isScanning && !scanResult ? (
                    <div className="text-center p-10 flex flex-col items-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 border border-primary/20">
                            <ShieldCheck size={48} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">Scanner Inactive</h3>
                        <p className="text-slate-500 text-sm font-medium mb-10 max-w-xs mx-auto">
                            Initialize the optical sensor to begin credential verification for arriving visitors.
                        </p>
                        <button 
                            onClick={startScanner}
                            className="px-10 py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center gap-3"
                        >
                            <Zap size={20} fill="currentColor" /> ACTIVATE LASER
                        </button>
                    </div>
                ) : (
                    <div id="reader" className="w-full h-full object-cover"></div>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-10">
                         <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                         <p className="mt-6 text-[10px] font-black text-white uppercase tracking-[4px] animate-pulse">Verifying Credentials...</p>
                    </div>
                )}
            </div>

            {/* Result Panel */}
            <div className="flex flex-col gap-6">
                <AnimatePresence mode="wait">
                    {scanResult ? (
                        <motion.div 
                            key={scanResult.message}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className={`flex-1 rounded-[40px] p-10 border-2 flex flex-col items-center justify-center text-center
                                ${scanResult.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}
                        >
                            <div className="mb-8">
                                {scanResult.type === 'success' ? (
                                    <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/20">
                                        <CheckCircle size={48} className="text-emerald-500" />
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center border-4 border-red-500/20">
                                        <AlertTriangle size={48} className="text-red-500" />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter">
                                {scanResult.type === 'success' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                            </h2>
                            <p className="text-slate-400 font-medium mb-10">{scanResult.message}</p>

                            {scanResult.name && (
                                <div className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
                                    <DetailRow label="Visitor" val={scanResult.name} />
                                    <DetailRow label="Slot" val={scanResult.slotId} isPrimary />
                                    <DetailRow label="Unit" val={scanResult.flat || 'N/A'} />
                                    <div className="pt-2">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            <span>Validation Code</span>
                                            <span className="text-emerald-500 font-mono tracking-normal text-xs">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={() => { setScanResult(null); startScanner(); }}
                                className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-3"
                            >
                                <RotateCcw size={18} /> RESET TERMINAL
                            </button>
                        </motion.div>
                    ) : (
                        <div className="flex-1 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-10 opacity-30">
                            <Clock size={64} className="text-slate-500 mb-6" />
                            <p className="font-black text-slate-500 uppercase tracking-widest text-xs">Waiting for Scanner Stream</p>
                        </div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-xs font-black uppercase tracking-wider"
                    >
                        <AlertTriangle size={16} /> {error}
                    </motion.div>
                )}
            </div>
        </div>
    </div>
  );
};

const DetailRow = ({ label, val, isPrimary }) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">{label}</span>
        <span className={`text-sm font-black ${isPrimary ? 'text-primary' : 'text-white'}`}>{val}</span>
    </div>
);

export default GuardScanner;
