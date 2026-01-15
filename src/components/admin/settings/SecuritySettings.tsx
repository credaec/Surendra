import React from 'react';
import type { SecurityConfig } from '../../../services/settingsService';
import { Lock, Smartphone, LogOut } from 'lucide-react';

interface SecuritySettingsProps {
    data: SecurityConfig;
    onChange: (data: Partial<SecurityConfig>) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof SecurityConfig, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-6">

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Authentication Policy</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Lock className="h-4 w-4 text-slate-500" />
                            <label className="block text-sm font-medium text-slate-700">Min Password Length</label>
                        </div>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.minPasswordLength}
                            onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value))}
                        />
                    </div>

                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <LogOut className="h-4 w-4 text-slate-500" />
                            <label className="block text-sm font-medium text-slate-700">Session Timeout (Minutes)</label>
                        </div>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.sessionTimeoutMinutes}
                            onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                        />
                    </div>

                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            <label className="block text-sm font-medium text-slate-700">Force Logout After (Days)</label>
                        </div>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.forceLogoutAfterDays}
                            onChange={(e) => handleChange('forceLogoutAfterDays', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Access Control</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-700">Two-Factor Authentication (2FA)</span>
                                <p className="text-xs text-slate-500">Require code verification for all users.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('twoFactorEnabled', !data.twoFactorEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Allow Admin Role Switch</span>
                            <p className="text-xs text-slate-500">Permit Admins to toggle into Employee Mode.</p>
                        </div>
                        <button
                            onClick={() => handleChange('allowAdminRoleSwitch', !data.allowAdminRoleSwitch)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.allowAdminRoleSwitch ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.allowAdminRoleSwitch ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Import
import { Calendar } from 'lucide-react';

export default SecuritySettings;
