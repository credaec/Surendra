import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

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

    // Mock Data based on type (Generic fallback)
    const renderContent = () => {
        if (type === 'employee') {
            return (
                <div className="space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500 font-medium uppercase">Total Hours</span>
                            <div className="text-2xl font-bold text-slate-900 mt-1">160h</div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="text-xs text-emerald-600 font-medium uppercase">Billable</span>
                            <div className="text-2xl font-bold text-emerald-700 mt-1">140h</div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-4">Daily Activity (Last 7 Days)</h4>
                        <div className="h-48 w-full border border-slate-100 rounded-lg p-2" style={{ minWidth: 0, minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { day: 'Mon', hours: 8 }, { day: 'Tue', hours: 8.5 }, { day: 'Wed', hours: 7 },
                                    { day: 'Thu', hours: 9 }, { day: 'Fri', hours: 8 }, { day: 'Sat', hours: 0 }, { day: 'Sun', hours: 0 }
                                ]}>
                                    <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Logs Table */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-4">Recent Projects worked on</h4>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-2">Project</th>
                                        <th className="px-4 py-2 text-right">Hrs</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-3">Skyline Tower Design</td>
                                        <td className="px-4 py-3 text-right font-medium">42h</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">City Bridge Renovation</td>
                                        <td className="px-4 py-3 text-right font-medium">35h</td>
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
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500 font-medium uppercase">Budget Used</span>
                            <div className="text-2xl font-bold text-slate-900 mt-1">72%</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <span className="text-xs text-blue-600 font-medium uppercase">Margin</span>
                            <div className="text-2xl font-bold text-blue-700 mt-1">22%</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-4">Team Contribution</h4>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-2">Member</th>
                                        <th className="px-4 py-2 text-right">Hrs</th>
                                        <th className="px-4 py-2 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-3">Alice Johnson</td>
                                        <td className="px-4 py-3 text-right font-medium">120h</td>
                                        <td className="px-4 py-3 text-right text-slate-500">$6,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">Bob Smith</td>
                                        <td className="px-4 py-3 text-right font-medium">85h</td>
                                        <td className="px-4 py-3 text-right text-slate-500">$3,400</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        return <div className="text-slate-500 text-center py-8">Select an item to view details</div>;
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Side Drawer */}
            <div className={cn(
                "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-slate-200",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1 block">
                                {type ? `${type} Details` : 'Details'}
                            </span>
                            <h2 className="text-xl font-bold text-slate-900 line-clamp-1">{title || 'Unknown'}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {renderContent()}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50">
                        <button className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 shadow-sm transition-colors">
                            View Full Profile
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportDrillDownDrawer;
