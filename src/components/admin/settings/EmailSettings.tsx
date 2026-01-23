import React, { useState } from 'react';
import { Mail, Shield, Server, Key, AlertCircle, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { EmailConfig } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';

interface EmailSettingsProps {
    data: EmailConfig;
    onChange: (data: Partial<EmailConfig>) => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ data, onChange }) => {
    const { showToast } = useToast();
    const [testEmail, setTestEmail] = useState('surendra@credaec.in');
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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-lg font-medium text-slate-900">Email Server Configuration</h2>
                <p className="text-sm text-slate-500">Configure how the system sends transactional emails.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">

                {/* Service Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Service</label>
                        <select
                            className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                            value={data.service}
                            onChange={(e) => onChange({ service: e.target.value as any })}
                        >
                            <option value="Custom">Custom SMTP</option>
                            <option value="Outlook">Outlook / Office 365</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Select 'Custom SMTP' for generic providers or specialized services.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Authentication Type</label>
                        <select
                            className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                            value={data.authType}
                            onChange={(e) => onChange({ authType: e.target.value as any })}
                        >
                            <option value="STANDARD">Standard (Username/Password)</option>
                            <option value="OAUTH2">OAuth2 (Secure)</option>
                        </select>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Sender Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sender Name</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-9 rounded-lg border-slate-200 focus:ring-blue-500"
                                value={data.fromName}
                                onChange={(e) => onChange({ fromName: e.target.value })}
                                placeholder="e.g. Credence Support"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sender Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                className="w-full pl-9 rounded-lg border-slate-200 focus:ring-blue-500"
                                value={data.fromEmail}
                                onChange={(e) => onChange({ fromEmail: e.target.value })}
                                placeholder="e.g. support@company.com"
                            />
                        </div>
                    </div>
                </div>

                {/* SMTP Details */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                    <h3 className="text-sm font-medium text-slate-900 flex items-center">
                        <Server className="h-4 w-4 mr-2 text-slate-500" /> SMTP Connection
                    </h3>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8">
                            <label className="block text-xs font-medium text-slate-600 mb-1">SMTP Host</label>
                            <input
                                type="text"
                                className="w-full rounded border-slate-200 text-sm focus:ring-blue-500"
                                value={data.host}
                                onChange={(e) => onChange({ host: e.target.value })}
                                placeholder="e.g. smtp.office365.com"
                            />
                        </div>
                        <div className="col-span-4">
                            <label className="block text-xs font-medium text-slate-600 mb-1">Port</label>
                            <input
                                type="number"
                                className="w-full rounded border-slate-200 text-sm focus:ring-blue-500"
                                value={data.port}
                                onChange={(e) => onChange({ port: parseInt(e.target.value) })}
                                placeholder="587"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            checked={data.secure}
                            onChange={(e) => onChange({ secure: e.target.checked })}
                        />
                        <span className="text-sm text-slate-600">Use Secure Connection (TLS/SSL)</span>
                    </div>
                </div>

                {/* Auth Credentials */}
                {data.authType === 'STANDARD' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Username</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                                value={data.username}
                                onChange={(e) => onChange({ username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Password / App Password</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="password"
                                    className="w-full pl-9 rounded-lg border-slate-200 focus:ring-blue-500"
                                    value={data.password || ''}
                                    onChange={(e) => onChange({ password: e.target.value })}
                                    placeholder="Enter password..."
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100 flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                            <p>OAuth2 requires registering an application with your provider ({data.service}) to obtain a Client ID and Client Secret.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Client ID</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                                    value={data.clientId || ''}
                                    onChange={(e) => onChange({ clientId: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Client Secret</label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                                    value={data.clientSecret || ''}
                                    onChange={(e) => onChange({ clientSecret: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Refresh Token</label>
                            <input
                                type="password"
                                className="w-full rounded-lg border-slate-200 focus:ring-blue-500"
                                value={data.refreshToken || ''}
                                onChange={(e) => onChange({ refreshToken: e.target.value })}
                                placeholder="Paste refresh token here..."
                            />
                        </div>
                    </div>
                )}

                <hr className="border-slate-100" />

                {/* Connection Test */}
                <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-3">Test Configuration</h3>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            className="flex-1 rounded-lg border-slate-200 text-sm focus:ring-blue-500"
                            placeholder="Recipient email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                        />
                        <button
                            onClick={handleTestConnection}
                            disabled={isTesting}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center"
                        >
                            {isTesting ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing...</>
                            ) : (
                                <><Send className="h-4 w-4 mr-2" /> Send Test Email</>
                            )}
                        </button>
                    </div>

                    {testResult === 'SUCCESS' && (
                        <div className="mt-3 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm flex items-center animate-in fade-in">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Connection established! Test email sent successfully.
                        </div>
                    )}

                    {testResult === 'ERROR' && (
                        <div className="mt-3 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm flex items-center animate-in fade-in">
                            <XCircle className="h-4 w-4 mr-2" />
                            Connection failed. Please check your host, port, and credentials.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default EmailSettings;
