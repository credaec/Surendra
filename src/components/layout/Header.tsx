import React, { useState } from 'react';
import { Bell, ChevronDown, Info, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileSettingsModal from './ProfileSettingsModal';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import GlobalSearch from './GlobalSearch';

import { backendService } from '../../services/backendService';
import { cn } from '../../lib/utils';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { isDarkMode, toggleTheme } = useTheme();

    // Notifications State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const loadNotifications = () => {
        if (user?.id) {
            const data = backendService.getNotifications(user.id);
            setNotifications(data);
        }
    };

    React.useEffect(() => {
        loadNotifications();
        // Poll for new notifications every minute (simple real-time simulation)
        const interval = setInterval(loadNotifications, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAllRead = () => {
        if (!user) return;
        // In a real app, backend would have a bulk endpoint.
        // Here we just mark displayed ones as read one by one or update local state + backend
        notifications.forEach(n => {
            if (!n.isRead) backendService.markNotificationRead(n.id);
        });
        loadNotifications();
    };

    // Helper to format time relative
    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return "Just now";
    };

    // Profile Dropdown State
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState<'PROFILE' | 'SETTINGS'>('PROFILE');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openProfile = () => {
        setModalTab('PROFILE');
        setIsModalOpen(true);
        setShowProfileMenu(false);
    };

    const openSettings = () => {
        setModalTab('SETTINGS');
        setIsModalOpen(true);
        setShowProfileMenu(false);
    };

    return (
        <>
            <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-[60] transition-all duration-300">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <GlobalSearch />
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-2 lg:space-x-5">

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 focus:outline-none transition-all duration-200"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2.5 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 focus:outline-none transition-all duration-200"
                        >
                            <span className="sr-only">View notifications</span>
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 py-0 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Notifications</h3>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-700"
                                        >
                                            Mark all read
                                        </button>
                                        <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                            <ChevronDown className="h-4 w-4 rotate-180" />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-[450px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-6 py-12 text-center">
                                            <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Bell className="h-6 w-6 text-slate-300" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No notifications</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className={`px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors group ${!notif.isRead ? 'bg-blue-50/20 dark:bg-blue-500/5' : ''}`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{notif.title}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{getTimeAgo(notif.createdAt)}</span>
                                                </div>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-center">
                                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">View All Notifications</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown Trigger */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 rounded-xl transition-all duration-200"
                        >
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                                {user?.avatarInitials || 'GU'}
                            </div>
                            <div className="hidden lg:flex flex-col text-left mr-1">
                                <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">{user?.name || 'Guest User'}</span>
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{user?.designation || user?.role || 'Visitor'}</span>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", showProfileMenu ? "rotate-180" : "")} />
                        </button>

                        {/* Profile Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email}</p>
                                </div>
                                <div className="py-2">
                                    <button
                                        onClick={openProfile}
                                        className="w-full text-left px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center transition-colors"
                                    >
                                        <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40"><Info className="h-4 w-4" /></span> {t('My Profile', 'My Profile')}
                                    </button>
                                    <button
                                        onClick={openSettings}
                                        className="w-full text-left px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white flex items-center transition-colors"
                                    >
                                        <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3"><Settings className="h-4 w-4" /></span> {t('Preferences', 'Preferences')}
                                    </button>
                                </div>
                                <div className="py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-5 py-2.5 text-sm font-black text-red-600 dark:text-rose-500 hover:bg-red-50 dark:hover:bg-rose-500/10 flex items-center uppercase tracking-widest"
                                    >
                                        <LogOut className="h-4 w-4 mr-3" /> {t('Sign out', 'Sign out')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Profile & Settings Modal */}
            <ProfileSettingsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialTab={modalTab}
            />
        </>
    );
};

export default Header;

