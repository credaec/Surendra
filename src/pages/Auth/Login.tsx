import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, UserCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Mock Microsoft Icon
const MicrosoftIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
        <path fill="#f35022" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
);

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();

    // Local form state
    const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // const [msLoading, setMsLoading] = useState(false);

    // Determine redirect path
    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/employee/dashboard');
        }
    }, [user, navigate]);

    // Auto-fill demo credentials based on role
    // Auto-fill demo credentials based on role
    useEffect(() => {
        if (role === 'ADMIN') {
            setEmail('dhiraj@credaec.in');
            setPassword(''); // clear password or set default
        } else {
            setEmail('naresh@credaec.in');
            setPassword('');
        }
    }, [role]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, role);
            // Navigation handled by useEffect
        } catch (error) {
            alert('Login failed: Invalid credentials or role. Please check your email and role selection.');
            setLoading(false);
        }
    };

    const handleMicrosoftLogin = () => {
        alert("Microsoft Logic not implemented yet. Please use Standard Login.");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
                {/* Left Side - Hero / Branding */}
                <div className="hidden md:flex w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold tracking-wider mb-2">CREDENCE</h1>
                        <p className="text-slate-400">Time Tracking & Project Management</p>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-semibold mb-4">Welcome Back</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Streamline your workflow, track your progress, and collaborate seamlessly with your team.
                        </p>
                    </div>

                    <div className="relative z-10 text-xs text-slate-500">
                        © 2024 Credence Inc. All rights reserved.
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-900">Sign In to your account</h2>
                        <p className="text-slate-500 mt-2">Enter your details to access the workspace.</p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
                        <button
                            onClick={() => setRole('EMPLOYEE')}
                            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-md transition-all ${role === 'EMPLOYEE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <UserCircle className="h-4 w-4 mr-2" />
                            Employee
                        </button>
                        <button
                            onClick={() => setRole('ADMIN')}
                            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-md transition-all ${role === 'ADMIN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-900"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center"
                        >
                            {loading ? (
                                <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Microsoft SSO Button */}
                    <button
                        onClick={handleMicrosoftLogin}
                        // disabled={msLoading}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        {/* {msLoading ? (
                            <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></span>
                        ) : ( */}
                        <>
                            <MicrosoftIcon />
                            Sign in with Microsoft
                        </>
                        {/* )} */}
                    </button>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <div className="text-xs text-slate-400 mb-2">
                            SSO enabled for Enterprise Integration
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
