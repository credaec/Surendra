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

            <div className="absolute inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Audit Log Details</h2>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-mono bg-slate-200 px-1.5 rounded text-slate-700">{log.id}</span>
                            <span>•</span>
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* 1. Activity Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="block text-xs font-semibold text-slate-500 uppercase">Module & Action</span>
                            <div className="mt-1 flex items-center space-x-2">
                                <span className="text-sm font-medium text-slate-900">{log.module}</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-sm font-bold text-blue-600">{log.action}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="block text-xs font-semibold text-slate-500 uppercase">Severity</span>
                            <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-sm font-bold ${log.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                    log.severity === 'WARNING' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-50 text-blue-700'
                                }`}>
                                {log.severity === 'CRITICAL' && <ShieldCheck className="h-4 w-4 mr-1.5" />}
                                {log.severity}
                            </div>
                        </div>
                    </div>

                    {/* 2. Target Record Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Target Entity</h3>
                        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div>
                                <div className="text-xs text-slate-500 font-medium mb-0.5">{log.target.type}</div>
                                <div className="text-base font-semibold text-slate-900">{log.target.name}</div>
                                <div className="text-xs font-mono text-slate-400 mt-1">{log.target.id}</div>
                            </div>
                            <button className="flex items-center px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 hover:bg-white hover:border-slate-300 transition-all text-xs font-medium">
                                View Record <ExternalLink className="h-3 w-3 ml-1.5" />
                            </button>
                        </div>
                    </div>

                    {/* 3. Changes Comparison */}
                    {log.changes && log.changes.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Change Log</h3>
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-2 w-1/3">Field</th>
                                            <th className="px-4 py-2 w-1/3 text-red-600">Old Value</th>
                                            <th className="px-4 py-2 w-1/3 text-emerald-600">New Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {log.changes.map((change, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 font-medium text-slate-700">{change.field}</td>
                                                <td className="px-4 py-3 text-red-600 bg-red-50/30 break-all">{String(change.oldValue ?? '-')}</td>
                                                <td className="px-4 py-3 text-emerald-600 bg-emerald-50/30 break-all">{String(change.newValue ?? '-')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 4. Metadata */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Session Details</h3>
                        <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                            <div className="flex items-center text-sm text-slate-600">
                                <Monitor className="h-4 w-4 mr-3 text-slate-400" />
                                <span className="font-medium mr-2">Device:</span>
                                {log.metadata.device} • {log.metadata.browser}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <MapPin className="h-4 w-4 mr-3 text-slate-400" />
                                <span className="font-medium mr-2">IP Address:</span>
                                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{log.metadata.ipAddress}</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. User */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Performed By</h3>
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                {log.performedBy.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900">{log.performedBy.name}</div>
                                <div className="text-xs text-slate-500">{log.performedBy.role} • {log.performedBy.email}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogDrawer;
