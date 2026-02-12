import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, User, Briefcase, DollarSign as DollarIcon, TrendingUp, AlertCircle } from 'lucide-react';
import type { PayrollRecord } from '../../../services/backendService';
import { cn } from '../../../lib/utils';

interface PayrollSlipModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: PayrollRecord | null;
    period: string;
    onSave: (id: string, updates: { bonus: number; deductions: number }) => void;
}

const PayrollSlipModal: React.FC<PayrollSlipModalProps> = ({
    isOpen,
    onClose,
    record,
    period,
    onSave
}) => {
    const [bonus, setBonus] = useState(0);
    const [deductions, setDeductions] = useState(0);

    useEffect(() => {
        if (record) {
            setBonus(record.bonus);
            setDeductions(record.deductions);
        }
    }, [record]);

    if (!isOpen || !record) return null;

    const handleSave = () => {
        onSave(record.id, { bonus, deductions });
        onClose();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const basePay = record.basePay;
    const overtime = record.overtimeAmount;
    const totalPayable = basePay + overtime + bonus - deductions;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="flex items-center space-x-5">
                        <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                            <DollarIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Payroll Slip Details</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center mt-1">
                                <Calendar className="h-3.5 w-3.5 mr-2" />
                                Period: {period}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={cn(
                            "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                            record.status === 'PAID' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" :
                                record.status === 'APPROVED' ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20" :
                                    "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        )}>
                            {record.status}
                        </span>
                        <button onClick={onClose} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-90">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Employee Info Section */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-6">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full opacity-75 blur transition duration-300"></div>
                                    <div className="relative h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-2xl border-4 border-white dark:border-slate-900">
                                        {record.employeeName.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">{record.employeeName}</h3>
                                    <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">{record.designation}</p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        ID: {record.employeeId}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-3xl p-6 space-y-4 border border-slate-100 dark:border-slate-800/50">
                                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center mb-2">
                                    <TrendingUp className="h-3.5 w-3.5 mr-2" /> Work Summary
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Logged</span>
                                        <span className="text-base font-black text-slate-900 dark:text-white tracking-tighter">{record.totalHours}h</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Billable</span>
                                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{record.billableHours}h</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Non-Billable</span>
                                        <span className="text-sm font-black text-slate-400 dark:text-slate-500 tracking-tight">{record.nonBillableHours}h</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financials Section */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                                <AlertCircle className="h-3.5 w-3.5 mr-2" /> Adjustments
                            </h4>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Base Pay</span>
                                    <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">{formatCurrency(basePay)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Overtime</span>
                                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-tight">+{formatCurrency(overtime)}</span>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between group">
                                        <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center">
                                            Bonus
                                        </label>
                                        <div className="relative w-36">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-emerald-500 font-bold">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={bonus}
                                                onChange={(e) => setBonus(Number(e.target.value))}
                                                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-right text-sm font-black text-emerald-600 dark:text-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between group">
                                        <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center">
                                            Deductions
                                        </label>
                                        <div className="relative w-36">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-rose-500 font-bold">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={deductions}
                                                onChange={(e) => setDeductions(Number(e.target.value))}
                                                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-right text-sm font-black text-rose-600 dark:text-rose-400 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Section */}
                    <div className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <DollarIcon className="h-24 w-24" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80 mb-2">Final Net Payable</p>
                                <h3 className="text-4xl font-black tracking-tighter leading-none">{formatCurrency(totalPayable)}</h3>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="h-12 w-px bg-white/20 hidden md:block" />
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Currency</p>
                                    <p className="text-sm font-black">USD ($)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50/50 dark:bg-slate-950/50 px-10 py-8 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm active:scale-95"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-10 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center"
                    >
                        <Save className="h-4 w-4 mr-3" />
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollSlipModal;
