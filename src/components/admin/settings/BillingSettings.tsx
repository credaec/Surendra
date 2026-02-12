import React from 'react';
import type { BillingConfig } from '../../../services/settingsService';
import { Receipt, CreditCard, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface BillingSettingsProps {
    data: BillingConfig;
    onChange: (data: Partial<BillingConfig>) => void;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof BillingConfig, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Invoice Numbering */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                        <Receipt className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Invoice Numbering</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Configure sequence format</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Prefix</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black uppercase h-12 px-5 tracking-wider"
                            value={data.invoicePrefix}
                            onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Next Number</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black h-12 px-5 tracking-wider"
                            value={data.startingNumber}
                            onChange={(e) => handleChange('startingNumber', e.target.value)}
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 p-5 bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-70">Preview</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-black text-slate-900 dark:text-white tracking-widest font-mono">{data.invoicePrefix}{data.startingNumber}</span>
                            <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Defaults */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-500/20">
                        <CreditCard className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Financial Defaults</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Payment terms & taxes</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Default Payment Terms</label>
                        <div className="relative">
                            <select
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-5 appearance-none cursor-pointer"
                                value={data.defaultPaymentTerms}
                                onChange={(e) => handleChange('defaultPaymentTerms', e.target.value)}
                            >
                                <option value="NET7">Net 7 Days</option>
                                <option value="NET15">Net 15 Days</option>
                                <option value="NET30">Net 30 Days</option>
                                <option value="DUE_RECEIPT">Due on Receipt</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Default Tax (%)</label>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black h-12 px-5"
                            value={data.defaultTaxPercentage}
                            onChange={(e) => handleChange('defaultTaxPercentage', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Invoice Notes Template</label>
                        <textarea
                            className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-32 p-5 resize-none leading-relaxed"
                            value={data.invoiceNotesTemplate}
                            onChange={(e) => handleChange('invoiceNotesTemplate', e.target.value)}
                            placeholder="Thank you for your business..."
                        />
                    </div>
                </div>
            </div>

            {/* Billing Rules */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="mb-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Billing Rules</h3>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Automation & Constraints</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="pr-4">
                            <span className="text-sm font-black text-slate-900 dark:text-white block mb-1">Block Invoicing for Pending Approvals</span>
                            <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400 dark:text-slate-500">Prevent generation if unapproved timesheets exist</p>
                        </div>
                        <button
                            onClick={() => handleChange('blockInvoicingForPending', !data.blockInvoicingForPending)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                                data.blockInvoicingForPending ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-300",
                                data.blockInvoicingForPending ? 'translate-x-6' : 'translate-x-1'
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center p-4">
                        <input
                            type="checkbox"
                            checked={data.billableApprovedOnly ?? true}
                            onChange={(e) => handleChange('billableApprovedOnly', e.target.checked)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500/20 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer transition-all"
                        />
                        <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300">Strict Mode: Only Bill Approved Entries</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BillingSettings;
