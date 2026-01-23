import React, { useState } from 'react';
import { Bell, ChevronDown, Info, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileSettingsModal from './ProfileSettingsModal';
import { useLanguage } from '../../context/LanguageContext';
import GlobalSearch from './GlobalSearch';

import { mockBackend } from '../../services/mockBackend';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Notifications State
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    const loadNotifications = () => {
        if (user?.id) {
            const data = mockBackend.getNotifications(user.id);
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
            if (!n.isRead) mockBackend.markNotificationRead(n.id);
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
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50 sticky-header-shadow">
                {/* Search Bar */}
                <GlobalSearch />

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <span className="sr-only">View notifications</span>
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-blue-600 hover:text-blue-500"
                                    >
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-6 text-center text-gray-400 text-sm">
                                            No notifications
                                        </div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}>
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                                    <span className="text-xs text-gray-400">{getTimeAgo(notif.createdAt)}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="px-4 py-2 border-t border-gray-100 text-center">
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-500">View all updates</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown Trigger */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 focus:outline-none hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {user?.avatarInitials || 'GU'}
                            </div>
                            <div className="hidden md:flex flex-col text-left">
                                <span className="text-sm font-medium text-gray-700">{user?.name || 'Guest User'}</span>
                                <span className="text-xs text-gray-500">{user?.designation || user?.role || 'Visitor'}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {/* Profile Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm text-gray-900 font-medium">Signed in as</p>
                                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        onClick={openProfile}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <span className="mr-3 text-gray-400"><Info className="h-4 w-4" /></span> {t('My Profile', 'My Profile')}
                                    </button>
                                    <button
                                        onClick={openSettings}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <span className="mr-3 text-gray-400"><Settings className="h-4 w-4" /></span> {t('Preferences', 'Preferences')}
                                    </button>
                                </div>
                                <div className="py-1 border-t border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <span className="mr-3 text-red-400"><LogOut className="h-4 w-4" /></span> {t('Sign out', 'Sign out')}
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
