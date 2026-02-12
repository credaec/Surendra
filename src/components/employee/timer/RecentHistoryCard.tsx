import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentHistoryCardProps {
    entries: any[]; // Using any for brevity given TimeEntry schema variations
}

const RecentHistoryCard: React.FC<RecentHistoryCardProps> = ({ entries }) => {
    const navigate = useNavigate();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">Approved</span>;
            case 'SUBMITTED': return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">Submitted</span>;
            default: return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">Draft</span>;
        }
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Recent History</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {entries.map(entry => (
                    <div key={entry.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                        <div className="min-w-0 pr-4">
                            <div className="font-medium text-sm text-slate-900 dark:text-white truncate">{entry.projectName}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-2">
                                <span>{entry.category}</span>
                                {entry.proof && <ImageIcon className="h-3 w-3 text-purple-400" />}
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300">
                                {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                            </div>
                            <div className="mt-1">{getStatusBadge(entry.status)}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-slate-100 dark:border-slate-700 text-center">
                <button
                    onClick={() => navigate('/employee/timesheet')}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-full py-1"
                >
                    View All Activity
                </button>
            </div>
        </div>
    );
};

export default RecentHistoryCard;
