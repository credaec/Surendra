import React from 'react';
import { Eye, Copy } from 'lucide-react';
import type { AuditLog } from '../../../services/auditService';
import { useToast } from '../../../context/ToastContext';

interface AuditLogTableProps {
    logs: AuditLog[];
    onViewIds: (id: string) => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, onViewIds }) => {

    const { showToast } = useToast();

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'CRITICAL':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400">Critical</span>;
            case 'WARNING':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100 dark:bg-orange-500/10 text-orange-800 dark:text-orange-400">Warning</span>;
            default:
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400">Info</span>;
        }
    };

    const formatTimestamp = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    };

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        showToast('Log ID copied to clipboard', 'success');
    };

    return (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                        <tr>
                            <th className="px-6 py-3 whitespace-nowrap">Date/Time</th>
                            <th className="px-6 py-3 whitespace-nowrap">Module</th>
                            <th className="px-6 py-3 whitespace-nowrap">Action</th>
                            <th className="px-6 py-3 whitespace-nowrap">Severity</th>
                            <th className="px-6 py-3 whitespace-nowrap">Performed By</th>
                            <th className="px-6 py-3 whitespace-nowrap">Target</th>
                            <th className="px-6 py-3 w-1/3">Summary</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono text-xs">{formatTimestamp(log.timestamp)}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                        {log.module}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{log.action}</td>
                                <td className="px-6 py-4">
                                    {getSeverityBadge(log.severity)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 dark:text-white font-bold">{log.userName}</span>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">{log.userRole}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 dark:text-white font-medium">{log.targetType}</span>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-tighter">{log.targetId}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 truncate max-w-xs" title={log.summary}>{log.summary}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            title="Copy ID"
                                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                            onClick={() => handleCopyId(log.id)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onViewIds(log.id)}
                                            className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Details
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogTable;
