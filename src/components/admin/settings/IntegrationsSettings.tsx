import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

const IntegrationsSettings: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="mb-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Connected Apps</h3>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Manage external integrations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* QuickBooks */}
                    <div className="group relative p-6 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-green-500/5 hover:border-green-200 dark:hover:border-green-900 transition-all duration-300 bg-slate-50/50 dark:bg-slate-950/30">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center space-x-5">
                            <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-green-600 font-black text-lg tracking-tighter">QB</span>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">QuickBooks</h4>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Accounting Integration</p>
                            </div>
                        </div>
                        <button disabled className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed opacity-70 group-hover:opacity-100 transition-opacity">
                            Coming Soon
                        </button>
                    </div>

                    {/* Slack */}
                    <div className="group relative p-6 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-200 dark:hover:border-purple-900 transition-all duration-300 bg-slate-50/50 dark:bg-slate-950/30">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="flex items-center space-x-5">
                            <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-purple-600 font-black text-lg tracking-tighter">SL</span>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Slack</h4>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Notifications & Alerts</p>
                            </div>
                        </div>
                        <button disabled className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed opacity-70 group-hover:opacity-100 transition-opacity">
                            Coming Soon
                        </button>
                    </div>

                    {/* Jira (Bonus) */}
                    <div className="group relative p-6 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 bg-slate-50/50 dark:bg-slate-950/30">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex items-center space-x-5">
                            <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-blue-600 font-black text-lg tracking-tighter">JR</span>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Jira</h4>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Task Sync</p>
                            </div>
                        </div>
                        <button disabled className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed opacity-70 group-hover:opacity-100 transition-opacity">
                            Coming Soon
                        </button>
                    </div>

                    {/* Zapier (Bonus) */}
                    <div className="group relative p-6 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex items-center justify-between hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-200 dark:hover:border-orange-900 transition-all duration-300 bg-slate-50/50 dark:bg-slate-950/30">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="flex items-center space-x-5">
                            <div className="h-14 w-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-orange-600 font-black text-lg tracking-tighter">ZP</span>
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Zapier</h4>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Automation</p>
                            </div>
                        </div>
                        <button disabled className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed opacity-70 group-hover:opacity-100 transition-opacity">
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsSettings;
