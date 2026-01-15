import React from 'react';
import type { AppSettings } from '../../../services/settingsService';
import { Mail, Bell, Calendar } from 'lucide-react';

interface NotificationSettingsProps {
    data: AppSettings['notifications'];
    onChange: (data: Partial<AppSettings['notifications']>) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof AppSettings['notifications'], value: boolean) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-6">

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">System Alerts</h3>

                <div className="space-y-6">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                                <p className="text-xs text-slate-500">Send critical alerts via email (Submission, Approval, Invoice).</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('emailAlerts', !data.emailAlerts)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.emailAlerts ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-700">In-App Notifications</span>
                                <p className="text-xs text-slate-500">Show notification bell alerts in the dashboard.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('inAppAlerts', !data.inAppAlerts)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.inAppAlerts ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.inAppAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-700">Pending Approval Reminders</span>
                                <p className="text-xs text-slate-500">Automatically remind Admins of pending items every 3 days.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('remindPendingApprovals', !data.remindPendingApprovals)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.remindPendingApprovals ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.remindPendingApprovals ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
