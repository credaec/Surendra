import React, { useState } from 'react';
import { X, CheckCircle, XCircle, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { ApprovalRequest } from '../../../services/mockBackend';

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
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{approval.employeeName}</h2>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold mr-2">{approval.employeeId}</span>
                            <span>{approval.weekRange}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6 space-x-6">
                    {(['summary', 'details', 'cost', 'history'] as TabId[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "py-3 text-sm font-medium border-b-2 transition-colors capitalize",
                                activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {tab === 'details' ? 'Detailed Entries' : tab === 'cost' ? 'Cost & Billing' : tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {activeTab === 'summary' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="text-sm text-blue-600 font-medium">Total Hours</div>
                                    <div className="text-2xl font-bold text-blue-900">{approval.totalHours.toFixed(1)}</div>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="text-sm text-emerald-600 font-medium">Billable Hours</div>
                                    <div className="text-2xl font-bold text-emerald-900">{approval.billableHours.toFixed(1)}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-900 mb-3">Project Distribution</h3>
                                <div className="space-y-3">
                                    {approval.projects.map((proj, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                                                <span className="font-medium text-slate-700">{proj}</span>
                                            </div>
                                            <span className="text-slate-500 font-mono">{(approval.totalHours / approval.projects.length).toFixed(1)}h</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="text-center py-10 text-slate-500">
                            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                            <p>Detailed daily time logs would be listed here.</p>
                            <p className="text-xs mt-1">(Mock Data - No granular entries available)</p>
                        </div>
                    )}

                    {activeTab === 'cost' && (
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                                    <DollarSign className="h-4 w-4 mr-2" /> Financial Impact
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Employee Cost Rate</span>
                                        <span className="font-mono text-slate-700">$45.00 / hr</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Total Labor Cost</span>
                                        <span className="font-mono font-bold text-slate-900">${(approval.totalHours * 45).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-slate-200 my-2"></div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Est. Billable Amount</span>
                                        <span className="font-mono font-bold text-emerald-600">${(approval.billableHours * 120).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-700 flex items-start">
                                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                This tab is visible only to Admins. Project Managers cannot see cost rates.
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <div className="flex space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
                                </div>
                                <div className="flex-1 pb-4 border-l border-slate-100 pl-4 ml-[-5px]">
                                    <p className="text-sm text-slate-900 font-medium">System Generated</p>
                                    <p className="text-xs text-slate-500">Overdue alert triggered</p>
                                    <p className="text-xs text-slate-400 mt-1">Today at 9:00 AM</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                </div>
                                <div className="flex-1 pb-4 border-l border-slate-100 pl-4 ml-[-5px]">
                                    <p className="text-sm text-slate-900 font-medium">{approval.employeeName}</p>
                                    <p className="text-xs text-slate-500">Submitted timesheet for approval</p>
                                    <p className="text-xs text-slate-400 mt-1">{approval.submittedOn}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
                    <button
                        onClick={() => onReject(approval.id)}
                        className="px-4 py-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-rose-600 rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                    </button>
                    <button
                        onClick={() => onApprove(approval.id)}
                        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Timesheet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimesheetReviewDrawer;
