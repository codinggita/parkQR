import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepLogged, setKeepLogged] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password, keepLogged);
        if (!result.success) {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans overflow-hidden">
            
            {/* Left Column - Full Height Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-[15%] h-screen relative z-10 bg-white">
                
                <div className="w-full max-w-[400px] mx-auto md:mx-0">
                    {/* Logo Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-[60px]"
                    >
                        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2L29.8564 10V26L16 34L2.14359 26V10L16 2Z" fill="#1c2b3a"/>
                            <path d="M16 18L29.8564 10L16 2L2.14359 10L16 18Z" fill="#1c2b3a"/>
                            <path d="M16 34V18L2.14359 10V26L16 34Z" fill="#009688"/>
                            <path d="M29.8564 26V10L16 18V34L29.8564 26Z" fill="#1c2b3a"/>
                            <path d="M16 5L26 10.5V21L16 26.5L6 21V10.5L16 5Z" fill="white"/>
                            <path d="M16 13L26 10.5L16 5L6 10.5L16 13Z" fill="#1c2b3a"/>
                            <path d="M16 26.5V13L6 10.5V21L16 26.5Z" fill="#009688"/>
                            <path d="M26 21V10.5L16 13V26.5L26 21Z" fill="#1c2b3a"/>
                        </svg>
                        <span className="font-bold text-[18px] text-[#1a2535] uppercase tracking-wider">
                            PARKWARE
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-10 leading-[1.15]"
                    >
                        <h1 className="font-bold text-[46px] text-[#1c2b3a] tracking-tight">
                            Enter Your <br />
                            <span className="text-[#009688]">Email & Password</span>
                        </h1>
                    </motion.div>

                    {/* Form Group */}
                    <motion.form 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        onSubmit={handleSubmit} 
                        className="flex flex-col w-full"
                    >
                        {/* Email Input */}
                        <div className="flex flex-col mb-[20px]">
                            <label className="text-[13px] text-[#888888] font-medium mb-2 uppercase tracking-wide">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                className="w-full h-[52px] bg-[#f0f0f0] border-2 border-transparent focus:border-[#009688]/40 focus:bg-white rounded-[10px] px-5 text-[#1c2b3a] text-[15px] placeholder:text-[#a1a1aa] outline-none transition-all duration-300"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col mb-[20px]">
                            <label className="text-[13px] text-[#888888] font-medium mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative w-full">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••••••"
                                    className="w-full h-[52px] bg-[#f0f0f0] border-2 border-transparent focus:border-[#009688]/40 focus:bg-white rounded-[10px] pl-5 pr-12 text-[#1c2b3a] text-[15px] placeholder:text-[#a1a1aa] outline-none tracking-[0.2em] transition-all duration-300"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#009688] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Checkbox and Forgot Password */}
                        <div className="flex items-center justify-between mt-2 mb-[32px]">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-colors ${keepLogged ? 'bg-[#009688]' : 'bg-[#e4e4e7] group-hover:bg-[#d4d4d8]'}`}>
                                    <Check size={14} className="text-white" strokeWidth={3} />
                                </div>
                                <span className="text-[13px] font-medium text-[#71717a] group-hover:text-[#3f3f46]">Keep me logged in</span>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={keepLogged}
                                    onChange={() => setKeepLogged(!keepLogged)}
                                />
                            </label>

                            <a href="#" className="text-[13px] font-semibold text-[#009688] hover:text-[#00796b] transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-3 bg-red-50 text-[13px] text-red-600 rounded-[8px] font-bold flex items-center gap-2"
                            >
                                <ShieldCheck size={16} /> {error}
                            </motion.div>
                        )}

                        {/* Login Button */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full h-[56px] bg-[#00796b] hover:bg-[#00695c] text-white font-bold text-[16px] rounded-[10px] transition-all duration-300 flex items-center justify-center shadow-[0_4px_12px_rgba(0,121,107,0.25)] hover:shadow-[0_6px_16px_rgba(0,121,107,0.35)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-[3px] border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </button>

                    </motion.form>
                </div>
            </div>

            {/* Right Column - Full Height Image */}
            <div className="hidden md:block w-1/2 h-screen relative bg-slate-100">
                <motion.img 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    src="/assets/ev-car.png" 
                    alt="Electric Sedan parked on wet concrete" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
            
        </div>
    );
};

export default LoginPage;
