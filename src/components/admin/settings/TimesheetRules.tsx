import React from 'react';
import type { TimesheetConfig } from '../../../services/settingsService';
import { Clock, CheckCircle } from 'lucide-react';

interface TimesheetRulesProps {
    data: TimesheetConfig;
    onChange: (data: Partial<TimesheetConfig>) => void;
}

const TimesheetRules: React.FC<TimesheetRulesProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof TimesheetConfig, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-6">

            {/* Entry Validation Rules */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <Clock className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Entry Validation</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Max Hours Per Day</label>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.maxHoursPerDay}
                            onChange={(e) => handleChange('maxHoursPerDay', parseInt(e.target.value))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Min Hours Per Day (Optional)</label>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.minHoursPerDay || ''}
                            onChange={(e) => handleChange('minHoursPerDay', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="e.g. 8"
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Allow Future Entries</span>
                            <p className="text-xs text-slate-500">Employees can log time for upcoming days.</p>
                        </div>
                        <button
                            onClick={() => handleChange('allowFutureEntries', !data.allowFutureEntries)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.allowFutureEntries ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.allowFutureEntries ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Allow Backdated Entries</span>
                            <p className="text-xs text-slate-500">Employees can log time for past days.</p>
                        </div>
                        <button
                            onClick={() => handleChange('allowBackdatedEntries', !data.allowBackdatedEntries)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.allowBackdatedEntries ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.allowBackdatedEntries ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Require Description</span>
                            <p className="text-xs text-slate-500">Description field is mandatory for every entry.</p>
                        </div>
                        <button
                            onClick={() => handleChange('requireDescription', !data.requireDescription)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.requireDescription ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.requireDescription ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>


                </div>
            </div>

            {/* Approval Workflow */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Approval Workflow</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Approval Mode</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => handleChange('approvalMode', 'SINGLE_LEVEL')}
                                className={`p-4 border rounded-xl cursor-pointer transition-all ${data.approvalMode === 'SINGLE_LEVEL'
                                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="font-medium text-slate-900 mb-1">Single Level Approval</div>
                                <p className="text-xs text-slate-500">Employee submits → Admin approves perfectly.</p>
                            </div>

                            <div
                                onClick={() => handleChange('approvalMode', 'MULTI_LEVEL')}
                                className={`p-4 border rounded-xl cursor-pointer transition-all ${data.approvalMode === 'MULTI_LEVEL'
                                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="font-medium text-slate-900 mb-1">Multi-Level Approval (Pro)</div>
                                <p className="text-xs text-slate-500">Employee → PM → Admin. (Coming soon)</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm font-medium text-slate-700">Auto-Submit Weekly</span>
                                <p className="text-xs text-slate-500">Automatically submit timesheets on Sunday 11:59 PM.</p>
                            </div>
                            <button
                                onClick={() => handleChange('autoSubmitWeekly', !data.autoSubmitWeekly)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.autoSubmitWeekly ? 'bg-blue-600' : 'bg-slate-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.autoSubmitWeekly ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TimesheetRules;
