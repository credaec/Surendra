import React from 'react';
import { Eye, Copy } from 'lucide-react';
import type { AuditLog } from '../../../services/auditService';

interface AuditLogTableProps {
    logs: AuditLog[];
    onViewIds: (id: string) => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, onViewIds }) => {

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'CRITICAL':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Critical</span>;
            case 'WARNING':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Warning</span>;
            default:
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">Info</span>;
        }
    };

    const formatTimestamp = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
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
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 text-slate-600 whitespace-nowrap font-mono text-xs">{formatTimestamp(log.timestamp)}</td>
                                <td className="px-6 py-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                        {log.module}
                                    </span>
                                </td>
                                <td className="px-6 py-3 font-medium text-slate-700">{log.action}</td>
                                <td className="px-6 py-3">
                                    {getSeverityBadge(log.severity)}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 font-medium">{log.performedBy.name}</span>
                                        <span className="text-xs text-slate-400">{log.performedBy.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900">{log.target.type}</span>
                                        <span className="text-xs text-slate-400 font-mono">{log.target.id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-slate-600 truncate max-w-xs" title={log.summary}>{log.summary}</td>
                                <td className="px-6 py-3 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            title="Copy ID"
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                            onClick={() => navigator.clipboard.writeText(log.id)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onViewIds(log.id)}
                                            className="flex items-center px-3 py-1.5 bg-white border border-slate-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-100 transition-colors text-xs font-medium shadow-sm"
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
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
