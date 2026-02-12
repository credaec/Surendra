import React from 'react';
import type { AppSettings } from '../../../services/settingsService';
import { Mail, Bell, Calendar, Zap } from 'lucide-react';

interface NotificationSettingsProps {
    data: AppSettings['notifications'];
    onChange: (data: Partial<AppSettings['notifications']>) => void;
}

import { cn } from '../../../lib/utils';

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof AppSettings['notifications'], value: boolean) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center shadow-sm border border-orange-100 dark:border-orange-500/20">
                        <Zap className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">System Alerts</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Delivery channels</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Email Notifications</span>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Critical alerts (Submission, Approval)</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('emailAlerts', !data.emailAlerts)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                data.emailAlerts ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                data.emailAlerts ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">In-App Notifications</span>
                                <p className="text-[10px] show-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Dashboard bell alerts</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('inAppAlerts', !data.inAppAlerts)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                data.inAppAlerts ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                data.inAppAlerts ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Pending Approval Reminders</span>
                                <p className="text-[10px] show-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Remind Admins every 3 days</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('remindPendingApprovals', !data.remindPendingApprovals)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                data.remindPendingApprovals ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                data.remindPendingApprovals ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
