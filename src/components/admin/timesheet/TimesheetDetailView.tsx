import React from 'react';
import { ArrowLeft, CheckCircle, Download, Printer } from 'lucide-react';

interface TimesheetDetailViewProps {
    employeeId: string;
    weekStartDate: string; // Added weekStartDate to props
    onBack: () => void;
}

const TimesheetDetailView: React.FC<TimesheetDetailViewProps> = ({ employeeId: _employeeId, weekStartDate: _weekStartDate, onBack }) => {
    // Mock Data based on ID
    const employeeName = "Naresh Prajapati";
    const weekRange = "Jan 13 - Jan 19, 2026";
    const stats = { total: 42.5, billable: 38, nonBillable: 4.5 };

    const dailyBreakdown = [
        { date: 'Mon, Jan 13', hours: 8.5, entries: 2 },
        { date: 'Tue, Jan 14', hours: 9.0, entries: 3 },
        { date: 'Wed, Jan 15', hours: 8.0, entries: 2 },
        { date: 'Thu, Jan 16', hours: 8.5, entries: 1 },
        { date: 'Fri, Jan 17', hours: 8.5, entries: 2 },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{employeeName}</h2>
                        <p className="text-sm text-slate-500">{weekRange}</p>
                    </div>
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Submitted
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm transition-colors">
                        <CheckCircle className="w-4 h-4" /> Approve Week
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <Printer className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50/50">
                <div className="p-4 text-center">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Hours</div>
                    <div className="text-xl font-bold text-slate-900">{stats.total}h</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Billable</div>
                    <div className="text-xl font-bold text-emerald-600">{stats.billable}h</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Non-Billable</div>
                    <div className="text-xl font-bold text-slate-600">{stats.nonBillable}h</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Missing Proof</div>
                    <div className="text-xl font-bold text-rose-600">0</div>
                </div>
            </div>

            {/* Daily Breakdown */}
            <div className="p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Daily Breakdown</h3>
                <div className="space-y-4">
                    {dailyBreakdown.map((day, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 flex justify-between items-center border-b border-slate-200">
                                <span className="font-medium text-slate-700 text-sm">{day.date}</span>
                                <span className="text-sm font-bold text-slate-900">{day.hours}h</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {[...Array(day.entries)].map((_, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50/50 transition-colors flex justify-between items-start text-sm">
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900">BCS Skylights</div>
                                            <div className="text-slate-500 text-xs mt-0.5">Engineering • Structural Analysis</div>
                                            <div className="mt-2 text-slate-600 italic">"Performed load calculations for the main variance."</div>
                                        </div>
                                        <div className="text-right pl-4">
                                            <div className="font-mono font-medium text-slate-700">4.25h</div>
                                            <div className="text-xs text-emerald-600 mt-1 flex items-center justify-end gap-1">
                                                <CheckCircle className="w-3 h-3" /> Billable
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimesheetDetailView;
