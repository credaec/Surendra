import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import type { PayrollRecord } from '../../../services/mockBackend';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Payroll Slip Details</h2>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Period: {period}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                            record.status === 'PAID' ? "bg-emerald-100 text-emerald-700" :
                                record.status === 'APPROVED' ? "bg-blue-100 text-blue-700" :
                                    "bg-slate-100 text-slate-700"
                        )}>
                            {record.status}
                        </span>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Employee Info */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                                {record.employeeName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{record.employeeName}</h3>
                                <p className="text-slate-500 text-sm">{record.designation}</p>
                                <p className="text-slate-400 text-xs mt-1">ID: {record.employeeId}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Work Summary</h4>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Total Hours</span>
                                <span className="font-medium text-slate-900">{record.totalHours} hrs</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Billable</span>
                                <span className="font-medium text-emerald-600">{record.billableHours} hrs</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Non-Billable</span>
                                <span className="font-medium text-slate-600">{record.nonBillableHours} hrs</span>
                            </div>
                        </div>
                    </div>

                    {/* Financials & Adjustments */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Earnings & Deductions</h4>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Base Pay</span>
                                <span className="font-medium text-slate-900">{formatCurrency(basePay)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Overtime</span>
                                <span className="font-medium text-emerald-600">+{formatCurrency(overtime)}</span>
                            </div>

                            {/* Editable Fields */}
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                                <label className="text-slate-700 font-medium flex items-center">
                                    Bonus
                                    <span className="ml-1 text-xs text-blue-500">(Edit)</span>
                                </label>
                                <div className="relative w-32">
                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                        <span className="text-slate-400 text-xs">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={bonus}
                                        onChange={(e) => setBonus(Number(e.target.value))}
                                        className="w-full pl-6 pr-2 py-1 text-right text-sm border-slate-200 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <label className="text-slate-700 font-medium flex items-center">
                                    Deductions
                                    <span className="ml-1 text-xs text-rose-500">(Edit)</span>
                                </label>
                                <div className="relative w-32">
                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                        <span className="text-slate-400 text-xs">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={deductions}
                                        onChange={(e) => setDeductions(Number(e.target.value))}
                                        className="w-full pl-6 pr-2 py-1 text-right text-sm border-slate-200 rounded focus:ring-rose-500 focus:border-rose-500 text-rose-600"
                                    />
                                </div>
                            </div>

                            {/* Net Pay */}
                            <div className="flex justify-between items-center pt-4 border-t-2 border-slate-100 mt-2">
                                <span className="text-base font-bold text-slate-800">Net Payable</span>
                                <span className="text-xl font-bold text-blue-700">{formatCurrency(totalPayable)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollSlipModal;
