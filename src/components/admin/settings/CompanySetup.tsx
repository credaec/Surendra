import React from 'react';
import type { CompanyConfig } from '../../../services/settingsService';

interface CompanySetupProps {
    data: CompanyConfig;
    onChange: (data: Partial<CompanyConfig>) => void;
}

const CompanySetup: React.FC<CompanySetupProps> = ({ data, onChange }) => {
    // Local state for the form, or sync strictly with props?
    // Let's use props + callback for "controlled" feel, but local validation if needed.
    // For simplicity, directly calling onChange on input.

    const handleChange = (field: keyof CompanyConfig, value: any) => {
        onChange({ [field]: value });
    };

    const toggleWorkingDay = (day: string) => {
        const currentDays = data.workingDays || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        handleChange('workingDays', newDays);
    };

    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    return (
        <div className="space-y-6">
            {/* Company Profile Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Company Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">State / Region</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                        <select
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.timezone}
                            onChange={(e) => handleChange('timezone', e.target.value)}
                        >
                            <option value="UTC-8">Pacific Time (UTC-8)</option>
                            <option value="UTC-5">Eastern Time (UTC-5)</option>
                            <option value="UTC+0">UTC</option>
                            <option value="UTC+5:30">India Standard Time (IST)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Business Rules Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Rules</h3>
                <div className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
                            <select
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={data.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Week Start Day</label>
                            <select
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={data.weekStartDay}
                                onChange={(e) => handleChange('weekStartDay', e.target.value)}
                            >
                                <option value="MONDAY">Monday</option>
                                <option value="SUNDAY">Sunday</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Working Days & Hours</label>
                        <div className="flex flex-wrap gap-2">
                            {days.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleWorkingDay(day)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${data.workingDays.includes(day)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Select the typical working days for your organization.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CompanySetup;
