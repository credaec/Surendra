import React from 'react';
import type { TimesheetConfig } from '../../../services/settingsService';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface TimesheetRulesProps {
    data: TimesheetConfig;
    onChange: (data: Partial<TimesheetConfig>) => void;
}

const TimesheetRules: React.FC<TimesheetRulesProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof TimesheetConfig, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Entry Validation Rules */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center shadow-sm border border-orange-100 dark:border-orange-500/20">
                        <Clock className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Entry Validation</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Time constraints & limits</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Max Hours Per Day</label>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black h-12 px-5"
                            value={data.maxHoursPerDay}
                            onChange={(e) => handleChange('maxHoursPerDay', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Min Hours Per Day (Optional)</label>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black h-12 px-5"
                            value={data.minHoursPerDay || ''}
                            onChange={(e) => handleChange('minHoursPerDay', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="e.g. 8"
                        />
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-500">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Allow Future Entries</span>
                                <p className="text-[10px] show-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Log time for upcoming days</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('allowFutureEntries', !data.allowFutureEntries)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                data.allowFutureEntries ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                data.allowFutureEntries ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-500">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Allow Backdated Entries</span>
                                <p className="text-[10px] show-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Log time for past days</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('allowBackdatedEntries', !data.allowBackdatedEntries)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                data.allowBackdatedEntries ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                data.allowBackdatedEntries ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-500">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Require Description</span>
                                <p className="text-[10px] show-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Mandatory notes for every entry</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('requireDescription', !data.requireDescription)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                data.requireDescription ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                data.requireDescription ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Approval Workflow */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                        <CheckCircle className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Approval Workflow</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Sign-off hierarchy</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 block">Approval Mode</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                onClick={() => handleChange('approvalMode', 'SINGLE_LEVEL')}
                                className={cn(
                                    "p-6 border rounded-[2rem] cursor-pointer transition-all duration-300 relative overflow-hidden group hover:shadow-lg",
                                    data.approvalMode === 'SINGLE_LEVEL'
                                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 ring-1 ring-blue-600 dark:ring-blue-500"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/30"
                                )}
                            >
                                <div className={cn(
                                    "font-black text-lg mb-2 transition-colors",
                                    data.approvalMode === 'SINGLE_LEVEL' ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"
                                )}>Single Level</div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">Direct employee to admin approval flow.</p>
                                {data.approvalMode === 'SINGLE_LEVEL' && (
                                    <div className="absolute top-6 right-6 text-blue-600 dark:text-blue-400 animate-in zoom-in spin-in-12">
                                        <CheckCircle className="h-6 w-6" />
                                    </div>
                                )}
                            </div>

                            <div
                                onClick={() => handleChange('approvalMode', 'MULTI_LEVEL')}
                                className={cn(
                                    "p-6 border rounded-[2rem] cursor-pointer transition-all duration-300 relative overflow-hidden group hover:shadow-lg opacity-80 hover:opacity-100",
                                    data.approvalMode === 'MULTI_LEVEL'
                                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 ring-1 ring-blue-600 dark:ring-blue-400"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950/30"
                                )}
                            >
                                <div className={cn(
                                    "font-black text-lg mb-2 transition-colors",
                                    data.approvalMode === 'MULTI_LEVEL' ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"
                                )}>Multi-Level</div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">Employee → Manager → Admin chain.</p>
                                <span className="absolute bottom-6 right-6 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-900/50">Pro</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                            <div className="pr-4">
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Auto-Submit Weekly</span>
                                <p className="text-[10px] show-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Auto-submit Sunday 11:59 PM</p>
                            </div>
                            <button
                                onClick={() => handleChange('autoSubmitWeekly', !data.autoSubmitWeekly)}
                                className={cn(
                                    "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                    data.autoSubmitWeekly ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                                )}
                            >
                                <span className={cn(
                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                    data.autoSubmitWeekly ? "translate-x-6" : "translate-x-1"
                                )} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TimesheetRules;
