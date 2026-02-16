import React from 'react';
import { X, ExternalLink, ShieldCheck, Monitor, MapPin } from 'lucide-react';
import type { AuditLog } from '../../../services/auditService';

interface AuditLogDrawerProps {
    log: AuditLog | null;
    onClose: () => void;
}

const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ log, onClose }) => {
    if (!log) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-border dark:border-slate-800">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Audit Log Details</h2>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 rounded text-slate-700 dark:text-slate-300">{log.id}</span>
                            <span>•</span>
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-slate-950">

                    {/* 1. Activity Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Module & Action</span>
                            <div className="mt-1 flex items-center space-x-2">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{log.module}</span>
                                <span className="text-slate-300 dark:text-slate-600">/</span>
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{log.action}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Severity</span>
                            <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-sm font-bold ${log.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                log.severity === 'WARNING' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                    'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                }`}>
                                {log.severity === 'CRITICAL' && <ShieldCheck className="h-4 w-4 mr-1.5" />}
                                {log.severity}
                            </div>
                        </div>
                    </div>

                    {/* 2. Target Record Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Target Entity</h3>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">{log.targetType}</div>
                                <div className="text-base font-semibold text-slate-900 dark:text-white">{log.targetName}</div>
                                <div className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">{log.targetId}</div>
                            </div>
                            <button className="flex items-center px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-300 transition-all text-xs font-medium">
                                View Record <ExternalLink className="h-3 w-3 ml-1.5" />
                            </button>
                        </div>
                    </div>

                    {/* 3. Changes Comparison */}
                    {(() => {
                        let changesList: any[] = [];
                        try {
                            if (typeof log.changes === 'string') {
                                changesList = JSON.parse(log.changes);
                            } else if (Array.isArray(log.changes)) {
                                changesList = log.changes;
                            }
                        } catch (e) {
                            console.error('Failed to parse changes:', e);
                        }

                        if (changesList && changesList.length > 0) {
                            return (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Change Log</h3>
                                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                                <tr>
                                                    <th className="px-4 py-2 w-1/3">Field</th>
                                                    <th className="px-4 py-2 w-1/3 text-red-600 dark:text-red-400">Old Value</th>
                                                    <th className="px-4 py-2 w-1/3 text-emerald-600 dark:text-emerald-400">New Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                                {changesList.map((change: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{change.field}</td>
                                                        <td className="px-4 py-3 text-red-600 dark:text-red-400 bg-red-50/30 dark:bg-red-900/10 break-all">{String(change.oldValue ?? '-')}</td>
                                                        <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10 break-all">{String(change.newValue ?? '-')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* 4. Metadata */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Session Details</h3>
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Monitor className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                                <span className="font-medium mr-2">Device:</span>
                                {log.device} • {log.browser}
                            </div>
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                                <span className="font-medium mr-2">IP Address:</span>
                                <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">{log.ipAddress}</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. User */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Performed By</h3>
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold">
                                {log.userName.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{log.userName}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{log.userRole} • {log.userEmail}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogDrawer;
