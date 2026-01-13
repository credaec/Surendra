import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, User, Settings, Mail, Shield, Smartphone, Globe, Moon, Bell, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans text-gray-900 dark:text-gray-100">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border dark:border-slate-700">

                {/* Header */}
                <div className="flex border-b border-gray-100 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('PROFILE')}
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'PROFILE' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-750'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{t('My Profile', 'My Profile')}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('SETTINGS')}
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'SETTINGS' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-750'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>{t('Preferences', 'Preferences')}</span>
                        </div>
                    </button>

                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 min-h-[400px]">
                    {activeTab === 'PROFILE' ? (
                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-6">
                                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-blue-50 dark:ring-blue-900">
                                    {user?.avatarInitials}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                                    <p className="text-gray-500 dark:text-slate-400 font-medium">{user?.designation}</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 mt-2">
                                        Active Employee
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-slate-750 p-6 rounded-xl border border-gray-100 dark:border-slate-700">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                                        <Mail className="h-3 w-3 mr-1.5" /> Email Address
                                    </label>
                                    <p className="text-sm font-medium text-gray-900 dark:text-slate-200">{user?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                                        <Shield className="h-3 w-3 mr-1.5" /> Role Access
                                    </label>
                                    <p className="text-sm font-medium text-gray-900 dark:text-slate-200">{user?.role === 'ADMIN' ? 'Full Administrator Access' : 'Standard Employee Access'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                                        <Smartphone className="h-3 w-3 mr-1.5" /> Phone
                                    </label>
                                    <p className="text-sm font-medium text-gray-900 dark:text-slate-200">+1 (555) 000-0000</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                                        <Globe className="h-3 w-3 mr-1.5" /> Location
                                    </label>
                                    <p className="text-sm font-medium text-gray-900 dark:text-slate-200">New York, USA</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Settings</h3>
                                <div className="space-y-4">

                                    {/* Setting Item */}
                                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                                                <Bell className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">Receive weekly summaries and alerts</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* Setting Item - Dark Mode */}
                                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-purple-600 dark:text-purple-400">
                                                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">Switch to a darker interface theme</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 dark:peer-focus:ring-purple-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>

                                    {/* Setting Item */}
                                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                                                <Globe className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Language</p>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">Select your preferred system language</p>
                                            </div>
                                        </div>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value as any)}
                                            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                <div className="bg-gray-50 dark:bg-slate-800/50 px-8 py-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Close
                    </button>
                    {activeTab === 'SETTINGS' && (
                        <button
                            className="ml-3 px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {
                                // Mock Save
                                alert("Settings Saved!");
                                onClose();
                            }}
                        >
                            Save Changes
                        </button>
                    )}
                </div>

            </div>
        </div>,
        document.body
    );
};

export default ProfileSettingsModal;
