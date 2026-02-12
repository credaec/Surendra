import React from 'react';
import type { CompanyConfig } from '../../../services/settingsService';
import { cn } from '../../../lib/utils';
import { Building2, Globe, MapPin, Clock, Camera } from 'lucide-react';

interface CompanySetupProps {
    data: CompanyConfig;
    onChange: (data: Partial<CompanyConfig>) => void;
}

const CompanySetup: React.FC<CompanySetupProps> = ({ data, onChange }) => {

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
        <div className="divide-y divide-slate-100 dark:divide-slate-800 h-full">
            {/* Branding Section */}
            <div className="p-10 lg:p-12 space-y-8">
                <div className="flex items-center space-x-3 text-slate-900 dark:text-white mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Company Profile</h3>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    {/* Logo Upload - Better sized for wide screens */}
                    <div className="xl:col-span-1 space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Logo</label>
                        <div className="relative group w-48 h-48 mx-auto xl:mx-0">
                            <div className="w-full h-full rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden border-dashed transition-colors group-hover:border-blue-400">
                                {data.logoUrl ? (
                                    <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="flex flex-col items-center space-y-2">
                                        <Camera className="h-10 w-10 text-slate-300" />
                                        <span className="text-[10px] font-bold text-slate-400">Drop logo URL</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Basic Info - Spread out */}
                    <div className="xl:col-span-3 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Display Name</label>
                                <input
                                    type="text"
                                    className="w-full text-base border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold h-14 px-5 shadow-sm"
                                    value={data.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Logo URL Resource</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/logo.png"
                                    className="w-full text-base border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold h-14 px-5 shadow-sm"
                                    value={data.logoUrl || ''}
                                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Address & Locale - More columns on wide screens */}
            <div className="p-10 lg:p-12 space-y-8 bg-slate-50/30 dark:bg-slate-900/10">
                <div className="flex items-center space-x-3 text-slate-900 dark:text-white mb-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <Globe className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Location & Regional Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <div className="md:col-span-2 xl:col-span-3 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Headquarters Address</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full text-base border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-14 px-5 pl-12"
                                value={data.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="123 Street Name, Building B"
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">City</label>
                        <input
                            type="text"
                            className="w-full text-base border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all h-14 px-5 shadow-sm font-semibold"
                            value={data.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">State / Province</label>
                        <input
                            type="text"
                            className="w-full text-base border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all h-14 px-5 shadow-sm font-semibold"
                            value={data.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Country</label>
                        <input
                            type="text"
                            className="w-full text-base border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all h-14 px-5 shadow-sm font-semibold"
                            value={data.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 xl:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Primary Timezone</label>
                        <select
                            className="w-full text-sm font-bold border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-14 px-5 appearance-none cursor-pointer shadow-sm"
                            value={data.timezone}
                            onChange={(e) => handleChange('timezone', e.target.value)}
                        >
                            <option value="UTC-8">Pacific Time (UTC-8)</option>
                            <option value="UTC-5">Eastern Time (UTC-5)</option>
                            <option value="UTC+0">Coordinated Universal Time (UTC)</option>
                            <option value="UTC+5:30">India Standard Time (IST)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Business Rules - Full Width controls */}
            <div className="p-10 lg:p-12 space-y-10">
                <div className="flex items-center space-x-3 text-slate-900 dark:text-white mb-4">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Financial & Scheduling Logic</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Organization Currency</label>
                        <select
                            className="w-full text-base font-bold border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 h-14 px-5"
                            value={data.currency}
                            onChange={(e) => handleChange('currency', e.target.value)}
                        >
                            <option value="USD">United States Dollar ($)</option>
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="EUR">Euro (€)</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">First Day of Week</label>
                        <select
                            className="w-full text-base font-bold border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 h-14 px-5"
                            value={data.weekStartDay}
                            onChange={(e) => handleChange('weekStartDay', e.target.value)}
                        >
                            <option value="MONDAY">Monday</option>
                            <option value="SUNDAY">Sunday</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 xl:col-span-3 space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Active Working Days</label>
                        <div className="flex flex-wrap gap-3">
                            {days.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleWorkingDay(day)}
                                    className={cn(
                                        "px-8 py-4 text-xs font-black rounded-xl border transition-all duration-300 flex-grow max-w-[150px]",
                                        data.workingDays.includes(day)
                                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 active:scale-95"
                                            : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-95"
                                    )}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 font-medium px-1">Selected days will be used for calculation of bills and timesheet compliance.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanySetup;
