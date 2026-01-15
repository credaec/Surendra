import React from 'react';
import type { BillingConfig } from '../../../services/settingsService';
import { Receipt, CreditCard } from 'lucide-react';

interface BillingSettingsProps {
    data: BillingConfig;
    onChange: (data: Partial<BillingConfig>) => void;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({ data, onChange }) => {

    const handleChange = (field: keyof BillingConfig, value: any) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-6">

            {/* Invoice Numbering */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Receipt className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Invoice Numbering</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prefix</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 uppercase"
                            value={data.invoicePrefix}
                            onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Next Number</label>
                        <input
                            type="text"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.startingNumber}
                            onChange={(e) => handleChange('startingNumber', e.target.value)}
                        />
                    </div>
                    <div className="col-span-2 p-3 bg-slate-50 text-slate-600 rounded-lg text-sm">
                        Preview: <span className="font-mono font-medium">{data.invoicePrefix}{data.startingNumber}</span>
                    </div>
                </div>
            </div>

            {/* Financial Defaults */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Financial Defaults</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Default Payment Terms</label>
                        <select
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.defaultPaymentTerms}
                            onChange={(e) => handleChange('defaultPaymentTerms', e.target.value)}
                        >
                            <option value="NET7">Net 7</option>
                            <option value="NET15">Net 15</option>
                            <option value="NET30">Net 30</option>
                            <option value="DUE_RECEIPT">Due on Receipt</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Default Tax (%)</label>
                        <input
                            type="number"
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={data.defaultTaxPercentage}
                            onChange={(e) => handleChange('defaultTaxPercentage', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Notes Template</label>
                        <textarea
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                            value={data.invoiceNotesTemplate}
                            onChange={(e) => handleChange('invoiceNotesTemplate', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Billing Rules */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing Rules</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Block Invoicing for Pending Approvals</span>
                            <p className="text-xs text-slate-500">Prevent generating invoice if project has unapproved timesheets.</p>
                        </div>
                        <button
                            onClick={() => handleChange('blockInvoicingForPending', !data.blockInvoicingForPending)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.blockInvoicingForPending ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${data.blockInvoicingForPending ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="py-2">
                        <div className="flex items-center">
                            <input type="checkbox" checked readOnly className="h-4 w-4 text-slate-300 rounded border-slate-300 bg-slate-100" />
                            <span className="ml-2 text-sm text-slate-400">Billable = Only Approved Entries (System Default)</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BillingSettings;
