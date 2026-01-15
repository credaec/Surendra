import React from 'react';

const IntegrationsSettings: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Connected Apps (Coming Soon)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between opacity-75">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold text-xs">QB</div>
                            <div>
                                <h4 className="font-medium text-slate-900">QuickBooks</h4>
                                <p className="text-xs text-slate-500">Accounting Integration</p>
                            </div>
                        </div>
                        <button disabled className="px-3 py-1 bg-slate-100 text-slate-400 rounded text-xs font-medium">Connect</button>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between opacity-75">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-bold text-xs">SL</div>
                            <div>
                                <h4 className="font-medium text-slate-900">Slack</h4>
                                <p className="text-xs text-slate-500">Notifications & Alerts</p>
                            </div>
                        </div>
                        <button disabled className="px-3 py-1 bg-slate-100 text-slate-400 rounded text-xs font-medium">Connect</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsSettings;
