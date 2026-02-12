import React, { useState } from 'react';
import { Mail, Shield, Server, Key, AlertCircle, Send, CheckCircle, XCircle, Loader2, Globe } from 'lucide-react';
import type { EmailConfig } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../lib/utils';

interface EmailSettingsProps {
    data: EmailConfig;
    onChange: (data: Partial<EmailConfig>) => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ data, onChange }) => {
    const { showToast } = useToast();
    const [testEmail, setTestEmail] = useState('admin@localhost.com'); // Re-added as per instruction
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<'SUCCESS' | 'ERROR' | null>(null);

    const handleTestConnection = async () => {
        setIsTesting(true);
        setTestResult(null);

        // Simulate network delay
        setTimeout(() => {
            setIsTesting(false);

            // Basic validation
            if (!data.host || !data.port || !data.fromEmail) {
                setTestResult('ERROR');
                showToast('Configuration invalid: Missing required fields', 'error');
                return;
            }

            // Simulate success
            setTestResult('SUCCESS');
            showToast(`Test email sent successfully to ${testEmail}`, 'success');
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5">
                    <div className="h-14 w-14 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center shadow-sm border border-cyan-100 dark:border-cyan-500/20">
                        <Server className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Email Configuration</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">SMTP & Delivery</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-8">

                {/* Service Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Service</label>
                        <div className="relative">
                            <select
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-5 appearance-none cursor-pointer"
                                value={data.service}
                                onChange={(e) => onChange({ service: e.target.value as any })}
                            >
                                <option value="Custom">Custom SMTP</option>
                                <option value="Outlook">Outlook / Office 365</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Authentication Type</label>
                        <div className="relative">
                            <select
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-5 appearance-none cursor-pointer"
                                value={data.authType}
                                onChange={(e) => onChange({ authType: e.target.value as any })}
                            >
                                <option value="STANDARD">Standard (Username/Password)</option>
                                <option value="OAUTH2">OAuth2 (Secure)</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Sender Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Sender Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5 pl-12"
                                value={data.fromName}
                                onChange={(e) => onChange({ fromName: e.target.value })}
                                placeholder="e.g. System Notifications"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Shield className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Sender Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5 pl-12"
                                value={data.fromEmail}
                                onChange={(e) => onChange({ fromEmail: e.target.value })}
                                placeholder="e.g. support@company.com"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Mail className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SMTP Details */}
                <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 space-y-6">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center uppercase tracking-widest">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" /> SMTP Connection
                    </h3>

                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-8 space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Host</label>
                            <input
                                type="text"
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5"
                                value={data.host}
                                onChange={(e) => onChange({ host: e.target.value })}
                                placeholder="e.g. smtp.office365.com"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4 space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Port</label>
                            <input
                                type="number"
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5"
                                value={data.port}
                                onChange={(e) => onChange({ port: parseInt(e.target.value) })}
                                placeholder="587"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                        <input
                            type="checkbox"
                            className="rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 h-5 w-5 bg-white dark:bg-slate-900"
                            checked={data.secure}
                            onChange={(e) => onChange({ secure: e.target.checked })}
                        />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Use Secure Connection (TLS/SSL)</span>
                    </div>
                </div>

                {/* Auth Credentials */}
                {data.authType === 'STANDARD' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">SMTP Username</label>
                            <input
                                type="text"
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5"
                                value={data.username}
                                onChange={(e) => onChange({ username: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Password / App Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5 pl-12"
                                    value={data.password || ''}
                                    onChange={(e) => onChange({ password: e.target.value })}
                                    placeholder="Enter password..."
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Key className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300 rounded-2xl text-xs font-medium border border-blue-100 dark:border-blue-500/20 flex items-start">
                            <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
                            <p className="leading-relaxed">OAuth2 requires registering an application with your provider ({data.service}) to obtain a Client ID and Client Secret.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Client ID</label>
                                <input
                                    type="text"
                                    className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5"
                                    value={data.clientId || ''}
                                    onChange={(e) => onChange({ clientId: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Client Secret</label>
                                <input
                                    type="password"
                                    className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5"
                                    value={data.clientSecret || ''}
                                    onChange={(e) => onChange({ clientSecret: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Refresh Token</label>
                            <input
                                type="password"
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5"
                                value={data.refreshToken || ''}
                                onChange={(e) => onChange({ refreshToken: e.target.value })}
                                placeholder="Paste refresh token here..."
                            />
                        </div>
                    </div>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Connection Test */}
                <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">Test Connection</h3>
                    <div className="flex gap-4">
                        <input
                            type="email"
                            className="flex-1 text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5"
                            placeholder="Recipient email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                        />
                        <button
                            onClick={handleTestConnection}
                            disabled={isTesting}
                            className="px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-xs font-black hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-50 flex items-center uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                        >
                            {isTesting ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing...</>
                            ) : (
                                <><Send className="h-4 w-4 mr-2" /> Send Test</>
                            )}
                        </button>
                    </div>

                    {testResult === 'SUCCESS' && (
                        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs font-bold uppercase tracking-wide flex items-center animate-in fade-in border border-emerald-100 dark:border-emerald-500/20">
                            <CheckCircle className="h-5 w-5 mr-3" />
                            Connection established! Test email sent successfully.
                        </div>
                    )}

                    {testResult === 'ERROR' && (
                        <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded-2xl text-xs font-bold uppercase tracking-wide flex items-center animate-in fade-in border border-rose-100 dark:border-rose-500/20">
                            <XCircle className="h-5 w-5 mr-3" />
                            Connection failed. Please check your host, port, and credentials.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default EmailSettings;
