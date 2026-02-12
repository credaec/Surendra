import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, User, Settings, Mail, Shield, Smartphone, Globe, Moon, Bell, Sun, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'PROFILE' | 'SETTINGS';
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose, initialTab = 'PROFILE' }) => {
    const { user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'PROFILE' | 'SETTINGS'>(initialTab);

    // Mock Settings State
    const [emailNotifs, setEmailNotifs] = useState(true);

    if (!isOpen) return null;

    // Use Portal to render outside of parent stacking context
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">

                {/* Header/Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-2">
                    <button
                        onClick={() => setActiveTab('PROFILE')}
                        className={cn(
                            "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-300 flex items-center justify-center space-x-3",
                            activeTab === 'PROFILE'
                                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/10 active:scale-95"
                                : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                        )}
                    >
                        <User className={cn("h-4 w-4", activeTab === 'PROFILE' ? "animate-pulse" : "")} />
                        <span>{t('Profile', 'Profile')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('SETTINGS')}
                        className={cn(
                            "flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-300 flex items-center justify-center space-x-3",
                            activeTab === 'SETTINGS'
                                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/10 active:scale-95"
                                : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                        )}
                    >
                        <Settings className={cn("h-4 w-4", activeTab === 'SETTINGS' ? "animate-spin-slow" : "")} />
                        <span>{t('Settings', 'Settings')}</span>
                    </button>

                    {/* Close Button - absolute but within header padding context */}
                    <button onClick={onClose} className="absolute top-6 right-8 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-90 z-20">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-10 min-h-[450px]">
                    {activeTab === 'PROFILE' ? (
                        <div className="space-y-10 animate-in slide-in-from-left-8 duration-500">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-8">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                                    <div className="relative h-28 w-28 rounded-full bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white dark:border-slate-900">
                                        {user?.avatarInitials}
                                    </div>
                                    <div className="absolute bottom-1 right-1 h-6 w-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full shadow-lg"></div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{user?.name}</h2>
                                    <p className="text-sm font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{user?.designation}</p>
                                    <div className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                                        Active Employee
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: Mail, label: 'Email Address', value: user?.email },
                                    { icon: Shield, label: 'Role Access', value: user?.role === 'ADMIN' ? 'Full Administrator' : 'Standard Employee' },
                                    { icon: Smartphone, label: 'Phone', value: '+1 (555) 000-0000' },
                                    { icon: Globe, label: 'Location', value: 'New York, USA' }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center mb-2">
                                            <item.icon className="h-3.5 w-3.5 mr-2" /> {item.label}
                                        </label>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-6">Preferences & Theme</h3>
                                <div className="space-y-4">

                                    {/* Setting Item */}
                                    <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-slate-950 shadow-sm transition-all group">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                                <Bell className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white tracking-tight">Email Notifications</p>
                                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Weekly summaries and system alerts</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setEmailNotifs(!emailNotifs)}
                                            className={cn(
                                                "w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner",
                                                emailNotifs ? "bg-blue-600 shadow-blue-500/20" : "bg-slate-200 dark:bg-slate-800"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300",
                                                emailNotifs ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>

                                    {/* Setting Item - Dark Mode */}
                                    <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 bg-white dark:bg-slate-950 shadow-sm transition-all group">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                                {isDarkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white tracking-tight">Interface Theme</p>
                                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Currently using {isDarkMode ? 'Dark' : 'Light'} Mode</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            className={cn(
                                                "w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner",
                                                isDarkMode ? "bg-purple-600 shadow-purple-500/20" : "bg-slate-200 dark:bg-slate-800"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300",
                                                isDarkMode ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>

                                    {/* Setting Item */}
                                    <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 bg-white dark:bg-slate-950 shadow-sm transition-all group">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                                <Globe className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white tracking-tight">Default Language</p>
                                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">System display language</p>
                                            </div>
                                        </div>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value as any)}
                                            className="bg-slate-50 dark:bg-slate-900 border-none text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/30 px-4 py-2 appearance-none cursor-pointer"
                                        >
                                            <option>English (US)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>German</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50/50 dark:bg-slate-950/50 px-10 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm active:scale-95"
                    >
                        Dismiss
                    </button>
                    {activeTab === 'SETTINGS' && (
                        <button
                            className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Apply Changes
                        </button>
                    )}
                </div>

            </div>
        </div>,
        document.body
    );
};

export default ProfileSettingsModal;
