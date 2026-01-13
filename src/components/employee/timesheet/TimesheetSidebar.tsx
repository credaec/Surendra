import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const WeeklySummaryCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Weekly Summary</h3>
            </div>
            <div className="p-5">
                <div className="flex items-baseline justify-between mb-4">
                    <span className="text-3xl font-bold text-slate-900">38.5<span className="text-lg font-normal text-slate-500">h</span></span>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        96% of Target
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Billable</span>
                        <span className="font-medium text-slate-900">32.0h</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '83%' }}></div>
                    </div>

                    <div className="flex justify-between text-sm pt-2">
                        <span className="text-slate-500">Non-Billable</span>
                        <span className="font-medium text-slate-900">6.5h</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: '17%' }}></div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-xs text-slate-500">Days Worked</div>
                        <div className="font-semibold text-slate-900">5</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Billable %</div>
                        <div className="font-semibold text-slate-900">83%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProofPendingTimesheetCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
                <h3 className="font-semibold text-red-900 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" /> Proof Missing
                </h3>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">1</span>
            </div>
            <div className="p-4">
                <div className="text-xs text-slate-600 mb-3">
                    Submission blocked until proof is uploaded for these entries:
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded border border-red-100 bg-red-50/10">
                        <div>
                            <div className="font-medium text-slate-900 text-xs">Tue • Rework</div>
                            <div className="text-[10px] text-slate-500">1h 00m</div>
                        </div>
                        <button className="text-[10px] font-medium text-red-600 border border-red-200 px-2 py-1 rounded bg-white hover:bg-red-50">
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ValidationChecklist: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Submission Checklist</h3>
            </div>
            <div className="p-5 space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                    All entries added
                </div>
                <div className="flex items-center text-sm text-slate-600">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    Proof attached
                </div>
                <div className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                    No time overlaps
                </div>

                <button className="w-full mt-2 py-2 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    Run Validation Check
                </button>
            </div>
        </div>
    );
};
