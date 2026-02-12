import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { X, CheckCircle, XCircle, FileText, DollarSign, AlertTriangle, Edit2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { backendService, type ApprovalRequest } from '../../../services/backendService';

interface TimesheetReviewDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    approval: ApprovalRequest | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

type TabId = 'summary' | 'details' | 'cost' | 'history';

const TimesheetReviewDrawer: React.FC<TimesheetReviewDrawerProps> = ({
    isOpen,
    onClose,
    approval,
    onApprove,
    onReject
}) => {
    const [activeTab, setActiveTab] = useState<TabId>('summary');

    if (!isOpen || !approval) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{approval.employeeName}</h2>
                        <div className="flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5 uppercase tracking-widest">
                            <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded mr-3">{approval.employeeId}</span>
                            <span>{approval.weekRange}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 space-x-8 bg-white dark:bg-slate-900">
                    {(['summary', 'details', 'cost', 'history'] as TabId[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all capitalize",
                                activeTab === tab ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            {tab === 'details' ? 'Detailed Entries' : tab === 'cost' ? 'Cost & Billing' : tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900">
                    {activeTab === 'summary' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mb-2">Total Hours</div>
                                    <div className="text-3xl font-black text-blue-900 dark:text-white">{approval.totalHours.toFixed(1)}</div>
                                </div>
                                <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-2">Billable Hours</div>
                                    <div className="text-3xl font-black text-emerald-900 dark:text-white">{approval.billableHours.toFixed(1)}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5">Project Distribution</h3>
                                <div className="space-y-4">
                                    {approval.projects.map((proj, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30">
                                            <div className="flex items-center">
                                                <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-4"></div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{proj}</span>
                                            </div>
                                            <span className="text-slate-900 dark:text-white font-black font-mono">{(approval.totalHours / approval.projects.length).toFixed(1)}h</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-4">
                            {(() => {
                                const entries = backendService.getEntries(approval.employeeId);
                                const projects = backendService.getProjects();
                                const categories = backendService.getTaskCategories();

                                return entries.length > 0 ? (
                                    <div className="space-y-3">
                                        {entries.map(entry => {
                                            const projName = projects.find(p => p.id === entry.projectId)?.name || 'Unknown Project';
                                            const catName = categories.find(c => c.id === entry.categoryId)?.name || 'General';

                                            // Helper for safe formatting
                                            const fmtDate = (d: string) => {
                                                try { return format(parseISO(d), 'MMM d, yyyy'); } catch { return d; }
                                            };
                                            const fmtTime = (t?: string) => {
                                                if (!t) return '-';
                                                try { return format(parseISO(t), 'h:mm a'); } catch { return t; }
                                            };

                                            return (
                                                <div key={entry.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 flex flex-col gap-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white text-base leading-tight">{projName}</div>
                                                            <div className="text-xs font-bold text-slate-500 dark:text-slate-500 mt-0.5 uppercase tracking-wide">{catName}</div>
                                                            <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">
                                                                {fmtDate(entry.date)} • {fmtTime(entry.startTime)} - {fmtTime(entry.endTime)}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-black text-slate-900 dark:text-white text-lg">{entry.durationMinutes}m</div>
                                                            <span className={cn(
                                                                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest mt-1",
                                                                entry.isBillable ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800" : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                                            )}>
                                                                {entry.isBillable ? 'Billable' : 'Non-Billable'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {entry.notes && (
                                                        <div className="text-sm text-slate-600 dark:text-slate-400 italic border-l-4 border-slate-200 dark:border-slate-800 pl-3 py-1">
                                                            "{entry.notes}"
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                        {(() => {
                                                            let logs: string[] = [];
                                                            if (entry.activityLogs) {
                                                                try {
                                                                    const parsed = JSON.parse(entry.activityLogs);
                                                                    // Future proofing: if we store logs array in JSON
                                                                    if (Array.isArray(parsed.logs)) logs = parsed.logs;
                                                                } catch (e) {
                                                                    // If it was legacy array, it won't be string, but typescript expects string now. 
                                                                    // If runtime data is still array, JSON.parse might fail or we might need type guard.
                                                                }
                                                            }

                                                            if (logs.length > 0) {
                                                                return (
                                                                    <div>
                                                                        <button
                                                                            className="text-[10px] flex items-center font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 uppercase tracking-widest"
                                                                            onClick={(e) => {
                                                                                const target = (e.currentTarget.nextElementSibling as HTMLElement);
                                                                                if (target) target.classList.toggle('hidden');
                                                                            }}
                                                                        >
                                                                            <FileText className="h-3.5 w-3.5 mr-1" /> View Activity Log ({logs.length})
                                                                        </button>
                                                                        <div className="hidden mt-3 space-y-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                                                                            {logs.map((log, i) => (
                                                                                <div key={i} className="text-[10px] text-slate-500 dark:text-slate-400 font-medium font-mono">{log}</div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })()}
                                                        {entry.isEdited && (
                                                            <div className="flex items-center text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest" title={entry.lastEditedAt ? `Edited on ${new Date(entry.lastEditedAt).toLocaleString()}` : 'Edited by employee'}>
                                                                <Edit2 className="h-3 w-3 mr-1" />
                                                                Edited
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">No entries found for this period.</div>
                                );
                            })()}
                        </div>
                    )}

                    {activeTab === 'cost' && (
                        <div className="space-y-6">
                            {(() => {
                                const user = backendService.getUsers().find(u => u.id === approval.employeeId);
                                const costRate = user?.hourlyCostRate || 0;
                                const totalLaborCost = approval.totalHours * costRate;
                                const projects = backendService.getProjects();
                                let calculatedBillableAmount = 0;
                                let isEstimated = false;

                                const entries = backendService.getEntries(approval.employeeId);
                                const relevantEntries = entries.filter(e =>
                                    (e.status === 'SUBMITTED' || e.status === 'APPROVED') &&
                                    approval.projects.includes(projects.find(p => p.id === e.projectId)?.name || '')
                                );

                                if (relevantEntries.length > 0) {
                                    calculatedBillableAmount = relevantEntries.reduce((sum, entry) => {
                                        if (!entry.isBillable) return sum;
                                        const proj = projects.find(p => p.id === entry.projectId);
                                        const rate = proj?.globalRate || 100;
                                        return sum + (entry.durationMinutes / 60) * rate;
                                    }, 0);
                                } else {
                                    calculatedBillableAmount = approval.billableHours * 120;
                                    isEstimated = true;
                                }

                                return (
                                    <div className="space-y-6">
                                        <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <DollarSign className="h-24 w-24" />
                                            </div>
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center">
                                                <DollarSign className="h-4 w-4 mr-2 text-blue-500" /> Financial Impact
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wide">Employee Cost Rate</span>
                                                    <span className="font-black text-slate-900 dark:text-white font-mono text-base">
                                                        {costRate > 0 ? `$${costRate.toFixed(2)} / hr` : <span className="text-amber-600 font-bold uppercase tracking-widest text-[10px]">Not Configured</span>}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm pt-2">
                                                    <span className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wide">Total Labor Cost</span>
                                                    <span className="font-black text-slate-900 dark:text-white font-mono text-lg">${totalLaborCost.toFixed(2)}</span>
                                                </div>
                                                <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wide">Est. Billable Amount</span>
                                                    <div className="text-right">
                                                        <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-xl">${calculatedBillableAmount.toFixed(2)}</span>
                                                        {isEstimated && <div className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest mt-1">Based on default rate</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 flex items-start leading-relaxed border border-amber-200 dark:border-amber-900/50">
                                            <AlertTriangle className="h-4 w-4 mr-3 flex-shrink-0 mt-0.5" />
                                            Restricted Access: This financial detail is visible only to Administrators. Project Managers and Team Leads are excluded from cost rate visibility.
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            <div className="flex space-x-4">
                                <div className="flex-shrink-0 mt-1.5 relative">
                                    <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900 z-10 relative"></div>
                                </div>
                                <div className="flex-1 pb-8 border-l border-slate-100 dark:border-slate-800 pl-6 ml-[-23px]">
                                    <p className="text-sm text-slate-900 dark:text-white font-black uppercase tracking-tight">System Generated</p>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">Overdue alert triggered • SLA violation</p>
                                    <p className="text-xs font-bold text-blue-500 mt-2 uppercase tracking-widest">Today at 9:00 AM</p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-shrink-0 mt-1.5 relative">
                                    <div className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900 z-10 relative"></div>
                                </div>
                                <div className="flex-1 pb-4 border-l border-slate-100 dark:border-slate-800 pl-6 ml-[-23px]">
                                    <p className="text-sm text-slate-900 dark:text-white font-black uppercase tracking-tight">{approval.employeeName}</p>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">Submitted timesheet for manual approval</p>
                                    <p className="text-xs font-bold text-blue-500 mt-2 uppercase tracking-widest">{approval.submittedOn}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end space-x-4">
                    <button
                        onClick={() => onReject(approval.id)}
                        className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                        <XCircle className="h-4 w-4 mr-2 inline" />
                        Reject Timesheet
                    </button>
                    <button
                        onClick={() => onApprove(approval.id)}
                        className="flex-[2] px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <CheckCircle className="h-4 w-4 mr-2 inline" />
                        Approve & Lock Entries
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimesheetReviewDrawer;

