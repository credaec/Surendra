import React from 'react';
import type { PayrollConfig } from '../../../services/settingsService';
import { DollarSign, CalendarCheck } from 'lucide-react';

interface PayrollSettingsProps {
    data: PayrollConfig;
    onChange: (data: Partial<PayrollConfig>) => void;
}

const PayrollSettings: React.FC<PayrollSettingsProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof PayrollConfig, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-6">

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <DollarSign className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Costing Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Default Employee Rate Type</label>
                        <select
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.defaultRateType}
                            onChange={(e) => handleChange('defaultRateType', e.target.value)}
                        >
                            <option value="HOURLY">Hourly Rate (Pro-rated)</option>
                            <option value="MONTHLY">Monthly Salary (Fixed)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">This sets the default calculation method for new employees.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Payroll Cycle</label>
                        <select
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.payrollCycle}
                            onChange={(e) => handleChange('payrollCycle', e.target.value)}
                        >
                            <option value="MONTHLY">Monthly</option>
                            <option value="BI_WEEKLY">Bi-Weekly</option>
                            <option value="WEEKLY">Weekly</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <CalendarCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Processing Rules</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Lock Payroll After Generation</span>
                            <p className="text-xs text-slate-500">Prevents changes to timesheets once payroll is processed for a period.</p>
                        </div>
                        <button
                            onClick={() => handleChange('lockPayrollAfterGeneration', !data.lockPayrollAfterGeneration)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.lockPayrollAfterGeneration ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.lockPayrollAfterGeneration ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="py-2">
                        <div className="flex items-center">
                            <input type="checkbox" checked readOnly className="h-4 w-4 text-slate-300 rounded border-slate-300 bg-slate-100" />
                            <span className="ml-2 text-sm text-slate-400">Allow Rate Changes Mid-Month (System Default)</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PayrollSettings;
