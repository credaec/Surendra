import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, Download, Printer, Loader2 } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import { useToast } from '../../../context/ToastContext';
import { formatDuration } from '../../../lib/utils';

interface TimesheetDetailViewProps {
    employeeId: string;
    weekStartDate: string;
    onBack: () => void;
}

const TimesheetDetailView: React.FC<TimesheetDetailViewProps> = ({ employeeId, weekStartDate, onBack }) => {
    const { showToast } = useToast();
    const [isApproving, setIsApproving] = useState(false);

    // Fetch Real Data
    const employee = backendService.getUsers().find(u => u.id === employeeId);
    const allEntries = backendService.getEntries().filter(e => e.userId === employeeId);

    // In a real app, filter by weekStartDate. For now, show all for demo
    const currentEntries = allEntries;

    // Derived Stats
    const stats = useMemo(() => {
        const total = currentEntries.reduce((acc, e) => acc + (e.durationMinutes / 60), 0);
        const billable = currentEntries.filter(e => e.isBillable).reduce((acc, e) => acc + (e.durationMinutes / 60), 0);
        const nonBillable = total - billable;
        return { total, billable, nonBillable };
    }, [currentEntries]);

    // Group by Date
    const dailyBreakdown = useMemo(() => {
        const groups: Record<string, typeof currentEntries> = {};
        currentEntries.forEach(e => {
            if (!groups[e.date]) groups[e.date] = [];
            groups[e.date].push(e);
        });

        return Object.entries(groups).map(([date, entries]) => ({
            date,
            hours: entries.reduce((acc, e) => acc + (e.durationMinutes / 60), 0),
            entries
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [currentEntries]);

    // Handlers
    const handleApproveWeek = async () => {
        setIsApproving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        currentEntries.forEach(e => {
            if (e.status !== 'APPROVED') {
                backendService.updateEntryStatus(e.id, 'APPROVED');
            }
        });

        showToast('Timesheet approved successfully', 'success');
        setIsApproving(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        if (currentEntries.length === 0) {
            showToast('No entries to download', 'error');
            return;
        }

        const headers = ['Date', 'Project', 'Category', 'Duration (Hours)', 'Billable', 'Notes', 'Status'];
        const rows = currentEntries.map(e => [
            e.date,
            backendService.getProjects().find(p => p.id === e.projectId)?.name || 'Unknown Project',
            e.categoryId,
            (e.durationMinutes / 60).toFixed(2),
            e.isBillable ? 'Yes' : 'No',
            `"${e.notes || ''}"`, // Quote notes to handle commas
            e.status
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Timesheet_${employee?.name || employeeId}_${weekStartDate}.csv`;
        a.click();
        showToast('Timesheet downloaded', 'success');
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300 print:shadow-none print:border-none">
            {/* Header */}
            <div className="border-b border-slate-200 p-6 flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{employee?.name || 'Unknown Employee'}</h2>
                        <p className="text-sm text-slate-500">{weekStartDate}</p>
                    </div>
                    {/* Dynamic Status Badge could go here */}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleApproveWeek}
                        disabled={isApproving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm transition-colors disabled:opacity-70"
                    >
                        {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve Week
                    </button>
                    <button
                        onClick={handlePrint}
                        className="p-2 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                        title="Print View"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                        title="Download CSV"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Printable Header - Only visible when printing */}
            <div className="hidden print:block p-6 border-b border-slate-200">
                <h1 className="text-2xl font-bold">Timesheet Report</h1>
                <p>{employee?.name} - {weekStartDate}</p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50/50 print:bg-white print:border-slate-300">
                <div className="p-4 text-center">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Hours</div>
                    <div className="text-xl font-bold text-slate-900">{formatDuration(stats.total * 60)}</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Billable</div>
                    <div className="text-xl font-bold text-emerald-600">{formatDuration(stats.billable * 60)}</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Non-Billable</div>
                    <div className="text-xl font-bold text-slate-600">{formatDuration(stats.nonBillable * 60)}</div>
                </div>
                <div className="p-4 text-center">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Entries</div>
                    <div className="text-xl font-bold text-blue-600">{currentEntries.length}</div>
                </div>
            </div>

            {/* Daily Breakdown */}
            <div className="p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Daily Breakdown</h3>
                <div className="space-y-4">
                    {dailyBreakdown.length > 0 ? dailyBreakdown.map((day, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden break-inside-avoid">
                            <div className="bg-slate-50 px-4 py-2 flex justify-between items-center border-b border-slate-200 print:bg-slate-100">
                                <span className="font-medium text-slate-700 text-sm">{day.date}</span>
                                <span className="text-sm font-bold text-slate-900">{formatDuration(day.hours * 60)}</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {day.entries.map((entry, i) => {
                                    const project = backendService.getProjects().find(p => p.id === entry.projectId);
                                    return (
                                        <div key={i} className="p-4 hover:bg-slate-50/50 transition-colors flex justify-between items-start text-sm print:bg-white">
                                            <div className="flex-1">
                                                <div className="font-medium text-slate-900">{project?.name || 'Unknown Project'}</div>
                                                <div className="text-slate-500 text-xs mt-0.5">{entry.categoryId}</div>
                                                {entry.notes && (
                                                    <div className="mt-2 text-slate-600 italic">"{entry.notes}"</div>
                                                )}
                                            </div>
                                            <div className="text-right pl-4">
                                                <div className="font-mono font-medium text-slate-700">{formatDuration(entry.durationMinutes)}</div>
                                                <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${entry.isBillable ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                    {entry.isBillable ? <><CheckCircle className="w-3 h-3" /> Billable</> : 'Non-Billable'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 text-slate-500">
                            No time entries found for this period.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimesheetDetailView;
