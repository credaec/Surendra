import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, UserCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { settingsService, type AppSettings } from '../../services/settingsService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [settings, setSettings] = useState<AppSettings | null>(null);

    // Local form state
    const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            const loaded = await settingsService.getSettings();
            setSettings(loaded);
        };
        loadSettings();
    }, []);

    // Determine redirect path
    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/employee/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            // Navigation handled by useEffect
        } catch (error) {
            alert('Login failed: Invalid credentials. Please check your email and password.');
            setLoading(false);
        }
    };

    const companyName = settings?.company.name || 'Pulse';
    const companyLogo = settings?.company.logoUrl;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[600px] animate-in fade-in duration-500">
                {/* Left Side - Hero / Branding */}
                <div className="hidden md:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />

                    <div className="relative z-10 flex items-center mb-2">
                        {companyLogo ? (
                            <img src={companyLogo} alt="Logo" className="h-10 w-10 object-contain mr-3" />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mr-3 shadow-lg">
                                <span className="text-white font-black text-xl italic">{companyName.substring(0, 1).toUpperCase()}</span>
                            </div>
                        )}
                        <h1 className="text-2xl font-black tracking-widest text-white">{companyName.toUpperCase()}</h1>
                    </div>
                    <p className="text-slate-400 relative z-10 text-[10px] font-black uppercase tracking-[0.2em]">Enterprise Resource Console</p>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Welcome Back</h2>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            Manage your workflow, track project progress, and synchronize with your team in real-time.
                        </p>
                    </div>

                    <div className="relative z-10 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} {companyName} • V2.5.0-PRO
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Access Hub</h2>
                        <p className="text-sm text-slate-500 font-medium">Please authenticate to continue to your workspace.</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
                        <button
                            onClick={() => setRole('EMPLOYEE')}
                            className={`flex-1 flex items-center justify-center py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === 'EMPLOYEE' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <UserCircle className="h-4 w-4 mr-2" />
                            Employee
                        </button>
                        <button
                            onClick={() => setRole('ADMIN')}
                            className={`flex-1 flex items-center justify-center py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === 'ADMIN' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Administrator
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                            <div className="relative group">
                                < Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-14 pl-12 pr-6 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-14 pl-12 pr-6 text-sm font-semibold text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !settings}
                            className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                            <span>Begin Session</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400 font-medium tracking-tight">
                            Access restricted to authorized personnel only.
                            <br />
                            Infrastructure status: <span className="text-emerald-500 font-bold uppercase tracking-widest ml-1">Live Database Linked</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
