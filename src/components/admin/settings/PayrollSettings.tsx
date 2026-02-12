import React from 'react';
import type { PayrollConfig } from '../../../services/settingsService';
import { DollarSign, CalendarCheck, Clock, Lock } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface PayrollSettingsProps {
    data: PayrollConfig;
    onChange: (data: Partial<PayrollConfig>) => void;
}

const PayrollSettings: React.FC<PayrollSettingsProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof PayrollConfig, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Costing Config */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                        <DollarSign className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Costing Configuration</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Rates & Methodologies</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Default Rate Type</label>
                        <div className="relative">
                            <select
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-5 appearance-none cursor-pointer"
                                value={data.defaultRateType}
                                onChange={(e) => handleChange('defaultRateType', e.target.value)}
                            >
                                <option value="HOURLY">Hourly Rate (Pro-rated)</option>
                                <option value="MONTHLY">Monthly Salary (Fixed)</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 ml-1">Calculation method for new hires.</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Payroll Cycle</label>
                        <div className="relative">
                            <select
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-5 appearance-none cursor-pointer"
                                value={data.payrollCycle}
                                onChange={(e) => handleChange('payrollCycle', e.target.value)}
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="BI_WEEKLY">Bi-Weekly</option>
                                <option value="WEEKLY">Weekly</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Processing Rules */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center shadow-sm border border-purple-100 dark:border-purple-500/20">
                        <CalendarCheck className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Processing Rules</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Locks & Amendments</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-500">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Auto-Lock Payroll</span>
                                <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500">Prevents changes after generation</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('lockPayrollAfterGeneration', !data.lockPayrollAfterGeneration)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                                data.lockPayrollAfterGeneration ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-300",
                                data.lockPayrollAfterGeneration ? 'translate-x-6' : 'translate-x-1'
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-500">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Mid-Month Changes</span>
                                <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500">Allow rate updates during cycle</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange('allowMidMonthRateChanges', !data.allowMidMonthRateChanges)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                                data.allowMidMonthRateChanges ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-300",
                                data.allowMidMonthRateChanges ? 'translate-x-6' : 'translate-x-1'
                            )} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PayrollSettings;
