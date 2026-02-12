import React from 'react';
import type { SecurityConfig } from '../../../services/settingsService';
import { Lock, Smartphone, LogOut, Shield, Calendar, Users } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SecuritySettingsProps {
    data: SecurityConfig;
    onChange: (data: Partial<SecurityConfig>) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof SecurityConfig, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center shadow-sm border border-red-100 dark:border-red-500/20">
                        <Lock className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Authentication Policy</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Password & Session Rules</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 mb-1">
                            <Shield className="h-4 w-4 text-slate-400" />
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Min Password Length</label>
                        </div>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black h-12 px-5"
                            value={data.minPasswordLength}
                            onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 mb-1">
                            <LogOut className="h-4 w-4 text-slate-400" />
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Session Timeout (Minutes)</label>
                        </div>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black h-12 px-5"
                            value={data.sessionTimeoutMinutes}
                            onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Force Logout After (Days)</label>
                        </div>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black h-12 px-5"
                            value={data.forceLogoutAfterDays}
                            onChange={(e) => handleChange('forceLogoutAfterDays', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                        <Smartphone className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Access Control</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">MFA & Permissions</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Two-Factor Authentication (2FA)</span>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Require code verification</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('twoFactorEnabled', !data.twoFactorEnabled)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                data.twoFactorEnabled ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                data.twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Allow Admin Role Switch</span>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Admins toggle to Employee mode</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('allowAdminRoleSwitch', !data.allowAdminRoleSwitch)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                data.allowAdminRoleSwitch ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                data.allowAdminRoleSwitch ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
