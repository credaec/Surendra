import React, { useState, useEffect, useMemo } from 'react';
import {
    Save, Database, Network, Cloud, Loader2,
    RefreshCw, HardDrive, Server, Play, ShieldCheck,
    ChevronDown, ChevronRight, CheckCircle2, AlertCircle,
    Calendar, Clock, History, Settings2, ArrowRight
} from 'lucide-react';
import { settingsService, type BackupConfig } from '../../../services/settingsService';
import { backupService, type BackupLogEntry } from '../../../services/backupService';
import { cn } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';

const BackupSettings: React.FC = () => {
    const { showToast } = useToast();
    const [config, setConfig] = useState<BackupConfig>({
        enabled: true,
        schedule: 'Daily (Midnight)',
        localBackup: { enabled: false, path: 'C:\\Backups\\CRED' },
        networkBackup: { enabled: false, path: '', username: '' },
        ftpBackup: { enabled: false, host: '', port: 21, username: '' },
        lastBackupDate: ''
    });

    const [isDirty, setIsDirty] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isTestingLocal, setIsTestingLocal] = useState(false);
    const [isTestingNetwork, setIsTestingNetwork] = useState(false);
    const [isTestingFtp, setIsTestingFtp] = useState(false);
    const [history, setHistory] = useState<BackupLogEntry[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [activeMethod, setActiveMethod] = useState<'LOCAL' | 'NETWORK' | 'FTP' | null>(null);

    const [testedStatus, setTestedStatus] = useState({
        local: false,
        network: false,
        ftp: false
    });

    useEffect(() => {
        const loadBackupSettings = async () => {
            const settings = await settingsService.getSettings();
            if (settings.backup) {
                setConfig(settings.backup);
                setTestedStatus({
                    local: settings.backup.localBackup.enabled,
                    network: settings.backup.networkBackup.enabled,
                    ftp: settings.backup.ftpBackup.enabled
                });
            }
        };
        loadBackupSettings();
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const data = await backupService.getBackupHistory();
            setHistory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleSave = async () => {
        await settingsService.updateSection('backup', config);
        showToast('Backup strategy synchronized to database', 'success');
        setIsDirty(false);
    };

    const handleManualBackup = async () => {
        setIsBackingUp(true);
        try {
            await backupService.performBackup();
            showToast('Backup execution successful', 'success');
            fetchHistory();
        } catch (error: any) {
            showToast(error.message || 'Backup execution failed', 'error');
        } finally {
            setIsBackingUp(false);
        }
    };

    const testLocal = async () => {
        setIsTestingLocal(true);
        try {
            const res = await backupService.testLocalConnection(config.localBackup);
            if (res.success) {
                showToast(res.message, 'success');
                setTestedStatus(prev => ({ ...prev, local: true }));
            } else {
                showToast(res.error, 'error');
                setTestedStatus(prev => ({ ...prev, local: false }));
            }
        } finally {
            setIsTestingLocal(false);
        }
    };

    const testNetwork = async () => {
        setIsTestingNetwork(true);
        try {
            const res = await backupService.testNetworkConnection(config.networkBackup);
            if (res.success) {
                showToast(res.message, 'success');
                setTestedStatus(prev => ({ ...prev, network: true }));
            } else {
                showToast(res.error, 'error');
                setTestedStatus(prev => ({ ...prev, network: false }));
            }
        } finally {
            setIsTestingNetwork(false);
        }
    };

    const testFtp = async () => {
        setIsTestingFtp(true);
        try {
            const res = await backupService.testFtpConnection(config.ftpBackup);
            if (res.success) {
                showToast(res.message, 'success');
                setTestedStatus(prev => ({ ...prev, ftp: true }));
            } else {
                showToast(res.error, 'error');
                setTestedStatus(prev => ({ ...prev, ftp: false }));
            }
        } finally {
            setIsTestingFtp(false);
        }
    };

    const canSave = useMemo(() => {
        if (!isDirty) return false;
        const localValid = !config.localBackup.enabled || testedStatus.local;
        const networkValid = !config.networkBackup.enabled || testedStatus.network;
        const ftpValid = !config.ftpBackup.enabled || testedStatus.ftp;
        return localValid && networkValid && ftpValid;
    }, [isDirty, config, testedStatus]);

    const backupMethods = [
        {
            id: 'LOCAL' as const,
            name: 'Local Storage',
            desc: 'Physical drive or local directory',
            icon: HardDrive,
            enabled: config.localBackup.enabled,
            color: 'blue',
            verified: testedStatus.local
        },
        {
            id: 'NETWORK' as const,
            name: 'Network Share',
            desc: 'UNC Path (Windows Share)',
            icon: Network,
            enabled: config.networkBackup.enabled,
            color: 'purple',
            verified: testedStatus.network
        },
        {
            id: 'FTP' as const,
            name: 'Remote FTP',
            desc: 'Remote server transfer',
            icon: Server,
            enabled: config.ftpBackup.enabled,
            color: 'orange',
            verified: testedStatus.ftp
        }
    ];

    return (
        <div className="h-full flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
            {/* Control Header */}
            <div className="p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Backup Orchestration</h2>
                    <p className="text-sm text-slate-500 font-medium">Manage automated data redundancy across multiple protocols.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Run</span>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-200 lowercase">
                                {config.lastBackupDate ? new Date(config.lastBackupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'never'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleManualBackup}
                        disabled={isBackingUp}
                        className="flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg active:scale-95"
                    >
                        {isBackingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        <span>Execute Now</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area - Wide Split */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden">

                {/* Configuration Zone */}
                <div className="xl:col-span-8 p-8 lg:p-10 space-y-10 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar">

                    {/* Method Matrix */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center space-x-2">
                                <Database className="h-4 w-4" />
                                <span>Destination Nodes</span>
                            </h3>
                            <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
                                <span>Frequency:</span>
                                <select
                                    value={config.schedule}
                                    onChange={(e) => { setConfig({ ...config, schedule: e.target.value }); setIsDirty(true); }}
                                    className="bg-transparent text-blue-600 font-black outline-none border-b border-transparent hover:border-blue-600/20 px-1"
                                >
                                    <option>Daily (Midnight)</option>
                                    <option>Weekly (Sunday)</option>
                                    <option>Monthly (1st)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {backupMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setActiveMethod(method.id)}
                                    className={cn(
                                        "flex flex-col p-6 rounded-2xl border transition-all text-left group relative",
                                        activeMethod === method.id
                                            ? "bg-white dark:bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/5 ring-4 ring-blue-500/5"
                                            : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all",
                                        method.id === 'LOCAL' && "bg-blue-50 dark:bg-blue-500/10 text-blue-600",
                                        method.id === 'NETWORK' && "bg-purple-50 dark:bg-purple-500/10 text-purple-600",
                                        method.id === 'FTP' && "bg-orange-50 dark:bg-orange-500/10 text-orange-600"
                                    )}>
                                        <method.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{method.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium line-clamp-1">{method.desc}</p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className={cn(
                                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5",
                                            method.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                        )}>
                                            <div className={cn("h-1.5 w-1.5 rounded-full", method.enabled ? "bg-emerald-500" : "bg-slate-300")} />
                                            <span>{method.enabled ? 'Live' : 'Off'}</span>
                                        </div>
                                        {method.verified && <ShieldCheck className="h-5 w-5 text-emerald-500" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Node Configurator */}
                    {activeMethod && (
                        <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500 shadow-2xl shadow-slate-900/5">
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl">
                                        {activeMethod === 'LOCAL' && <HardDrive className="h-6 w-6" />}
                                        {activeMethod === 'NETWORK' && <Network className="h-6 w-6" />}
                                        {activeMethod === 'FTP' && <Server className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Configure {activeMethod} node</h4>
                                        <p className="text-xs text-slate-500 font-medium">Security and transmission parameters</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Status</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={
                                                activeMethod === 'LOCAL' ? config.localBackup.enabled :
                                                    activeMethod === 'NETWORK' ? config.networkBackup.enabled :
                                                        config.ftpBackup.enabled
                                            }
                                            onChange={(e) => {
                                                const enabled = e.target.checked;
                                                if (activeMethod === 'LOCAL') setConfig({ ...config, localBackup: { ...config.localBackup, enabled } });
                                                else if (activeMethod === 'NETWORK') setConfig({ ...config, networkBackup: { ...config.networkBackup, enabled } });
                                                else if (activeMethod === 'FTP') setConfig({ ...config, ftpBackup: { ...config.ftpBackup, enabled } });
                                                setIsDirty(true);
                                            }}
                                        />
                                        <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {activeMethod === 'LOCAL' && (
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Storage Target Path</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                value={config.localBackup.path}
                                                onChange={(e) => {
                                                    setConfig({ ...config, localBackup: { ...config.localBackup, path: e.target.value } });
                                                    setIsDirty(true); setTestedStatus(p => ({ ...p, local: false }));
                                                }}
                                                className="flex-1 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 text-sm font-semibold text-slate-900 dark:text-white focus:border-blue-500 transition-all outline-none"
                                                placeholder="C:\Backups\App"
                                            />
                                            <button
                                                onClick={testLocal}
                                                disabled={isTestingLocal}
                                                className={cn(
                                                    "h-12 px-8 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                                                    testedStatus.local ? "bg-emerald-600 text-white shadow-emerald-500/10" : "bg-blue-600 text-white shadow-blue-500/10"
                                                )}
                                            >
                                                {isTestingLocal ? <Loader2 className="h-4 w-4 animate-spin" /> : testedStatus.local ? 'Verified' : 'Verify Path'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeMethod === 'NETWORK' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">UNC Resource Share</label>
                                            <input
                                                type="text"
                                                value={config.networkBackup.path}
                                                onChange={(e) => { setConfig({ ...config, networkBackup: { ...config.networkBackup, path: e.target.value } }); setIsDirty(true); setTestedStatus(p => ({ ...p, network: false })); }}
                                                className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm font-semibold"
                                                placeholder="\\NAS-DRIVE\Backups"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Access User</label>
                                                <input
                                                    type="text"
                                                    value={config.networkBackup.username}
                                                    onChange={(e) => { setConfig({ ...config, networkBackup: { ...config.networkBackup, username: e.target.value } }); setIsDirty(true); }}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Access Password</label>
                                                <input
                                                    type="password"
                                                    value={config.networkBackup.password || ''}
                                                    onChange={(e) => { setConfig({ ...config, networkBackup: { ...config.networkBackup, password: e.target.value } }); setIsDirty(true); }}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <button onClick={testNetwork} disabled={isTestingNetwork} className="w-full h-12 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-500/10 flex items-center justify-center space-x-2">
                                            {isTestingNetwork ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                            <span>{testedStatus.network ? 'Network Connection Ready' : 'Validate Share Access'}</span>
                                        </button>
                                    </div>
                                )}

                                {activeMethod === 'FTP' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-4 gap-8">
                                            <div className="col-span-3 space-y-4">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Remote Server Host</label>
                                                <input
                                                    type="text"
                                                    value={config.ftpBackup.host}
                                                    onChange={(e) => { setConfig({ ...config, ftpBackup: { ...config.ftpBackup, host: e.target.value } }); setIsDirty(true); }}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm"
                                                    placeholder="ftp.yourdomain.com"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Port</label>
                                                <input
                                                    type="number"
                                                    value={config.ftpBackup.port}
                                                    onChange={(e) => { setConfig({ ...config, ftpBackup: { ...config.ftpBackup, port: parseInt(e.target.value) } }); setIsDirty(true); }}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">User ID</label>
                                                <input
                                                    type="text"
                                                    value={config.ftpBackup.username}
                                                    onChange={(e) => { setConfig({ ...config, ftpBackup: { ...config.ftpBackup, username: e.target.value } }); setIsDirty(true); }}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Credential Secret</label>
                                                <input
                                                    type="password"
                                                    value={config.ftpBackup.password || ''}
                                                    onChange={(e) => { setConfig({ ...config, ftpBackup: { ...config.ftpBackup, password: e.target.value } }); setIsDirty(true); }}
                                                    className="w-full h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <button onClick={testFtp} disabled={isTestingFtp} className="w-full h-12 bg-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-500/10 flex items-center justify-center space-x-2">
                                            {isTestingFtp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Server className="h-4 w-4" />}
                                            <span>{testedStatus.ftp ? 'Transmission Stream Verified' : 'Test Remote Connection'}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status & Log Log - Stretching Vertically */}
                <div className="xl:col-span-4 flex flex-col divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/30 dark:bg-slate-900/10 h-full">

                    {/* Synchronize Hub */}
                    <div className="p-8 lg:p-10 space-y-6">
                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className={cn(
                                "w-full py-16 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300",
                                canSave
                                    ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/20 active:scale-[0.98]"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60"
                            )}
                        >
                            <Save className={cn("h-8 w-8", canSave && "animate-pulse")} />
                            <div className="text-center">
                                <p className="text-sm font-black uppercase tracking-[0.2em]">Synchronize Hub</p>
                                {!canSave && isDirty && (
                                    <p className="text-[10px] font-bold text-rose-500 mt-2 lowercase">Verification of active nodes required</p>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Timeline Activity */}
                    <div className="flex-1 p-8 lg:p-10 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center space-x-2">
                                <History className="h-4 w-4" />
                                <span>Activity Stream</span>
                            </h3>
                            <button onClick={fetchHistory} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <RefreshCw className={cn("h-4 w-4 text-slate-400", isLoadingHistory && "animate-spin")} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-4">
                            {history.length > 0 ? (
                                <div className="space-y-6">
                                    {history.map((log, idx) => (
                                        <div key={log.id} className="relative pl-8">
                                            {/* Line */}
                                            {idx !== history.length - 1 && (
                                                <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-100 dark:bg-slate-800" />
                                            )}
                                            {/* Node */}
                                            <div className={cn(
                                                "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center z-10",
                                                log.status === 'SUCCESS' ? "bg-emerald-500" : "bg-rose-500"
                                            )}>
                                                {log.status === 'SUCCESS' ? <CheckCircle2 className="h-3 w-3 text-white" /> : <AlertCircle className="h-3 w-3 text-white" />}
                                            </div>

                                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:border-blue-200 dark:hover:border-blue-900/30 transition-all">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{log.location}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                                    {log.details || 'Backup stream completed successfully with zero packet loss.'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <Database className="h-10 w-10 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silent Stream</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackupSettings;
