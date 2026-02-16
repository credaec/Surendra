import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

interface ReportDrillDownDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'employee' | 'project' | 'client' | null;
    id: string | number | null;
    title: string;
}

const ReportDrillDownDrawer: React.FC<ReportDrillDownDrawerProps> = ({
    isOpen, onClose, type, title
}) => {
    const { isDarkMode } = useTheme();

    // Mock Data based on type (Generic fallback)
    const renderContent = () => {
        if (type === 'employee') {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Hours</span>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">160h</div>
                        </div>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50 transition-colors">
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Billable</span>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">140h</div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Daily Activity (Last 7 Days)</h4>
                        <div className="h-48 w-full border border-slate-100 dark:border-slate-800 rounded-lg p-2 bg-white dark:bg-slate-900 shadow-inner transition-colors" style={{ minWidth: 0, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { day: 'Mon', hours: 8 }, { day: 'Tue', hours: 8.5 }, { day: 'Wed', hours: 7 },
                                    { day: 'Thu', hours: 9 }, { day: 'Fri', hours: 8 }, { day: 'Sat', hours: 0 }, { day: 'Sun', hours: 0 }
                                ]}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10 }} />
                                    <Tooltip
                                        cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                                        contentStyle={{
                                            backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                                            borderRadius: '8px',
                                            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            color: isDarkMode ? '#f8fafc' : '#0f172a'
                                        }}
                                        itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                                    />
                                    <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Logs Table */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Recent Projects worked on</h4>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-colors">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-4 py-2">Project</th>
                                        <th className="px-4 py-2 text-right">Hrs</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Skyline Tower Design</td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">42h</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">City Bridge Renovation</td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">35h</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        if (type === 'project') {
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Budget Used</span>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">72%</div>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 transition-colors">
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">Margin</span>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">22%</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Team Contribution</h4>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-colors">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-4 py-2">Member</th>
                                        <th className="px-4 py-2 text-right">Hrs</th>
                                        <th className="px-4 py-2 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Alice Johnson</td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">120h</td>
                                        <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">$6,000</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Bob Smith</td>
                                        <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">85h</td>
                                        <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">$3,400</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        return <div className="text-slate-500 dark:text-slate-400 text-center py-8">Select an item to view details</div>;
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Side Drawer */}
            <div className={cn(
                "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl transform transition-all duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 transition-colors">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 block">
                                {type ? `${type} Details` : 'Details'}
                            </span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight">{title || 'Unknown'}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {renderContent()}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 transition-colors">
                        <button className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all active:scale-[0.98]">
                            View Full Profile
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportDrillDownDrawer;
