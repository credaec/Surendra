import React from 'react';
import { cn } from '../../../lib/utils';
import { Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const RecentHistoryCard: React.FC = () => {
    const entries = [
        { id: 1, project: 'BCS Skylights', task: 'Engineering', duration: '1h 15m', status: 'DRAFT', proof: false },
        { id: 2, project: 'Dr. Wade Residence', task: 'Drafting', duration: '2h 00m', status: 'SUBMITTED', proof: true },
        { id: 3, project: 'Internal', task: 'Meeting', duration: '0h 45m', status: 'APPROVED', proof: false },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Approved</span>;
            case 'SUBMITTED': return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">Submitted</span>;
            default: return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">Draft</span>;
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Recent History</h3>
            </div>
            <div className="divide-y divide-slate-50">
                {entries.map(entry => (
                    <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                        <div className="min-w-0 pr-4">
                            <div className="font-medium text-sm text-slate-900 truncate">{entry.project}</div>
                            <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                                <span>{entry.task}</span>
                                {entry.proof && <ImageIcon className="h-3 w-3 text-purple-400" />}
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="font-mono text-sm font-medium text-slate-700">{entry.duration}</div>
                            <div className="mt-1">{getStatusBadge(entry.status)}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-slate-100 text-center">
                <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                    View All Activity
                </button>
            </div>
        </div>
    );
};

export default RecentHistoryCard;
