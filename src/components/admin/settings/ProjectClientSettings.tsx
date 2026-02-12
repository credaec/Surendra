import React, { useState } from 'react';
import { Briefcase, Building, Plus } from 'lucide-react';
import { settingsService } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../lib/utils';

const ProjectClientSettings: React.FC = () => {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [clientConfig, setClientConfig] = useState<any>(null); // Ideally import types from settingsService
    const [projectConfig, setProjectConfig] = useState<any>(null);

    React.useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await settingsService.getSettings();
                setClientConfig(settings.client);
                setProjectConfig(settings.project);
            } catch (error) {
                showToast('Failed to load project settings', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const updateClientConfig = (key: string, value: boolean) => {
        if (!clientConfig) return;
        const newConfig = { ...clientConfig, [key]: value };
        setClientConfig(newConfig);
        settingsService.updateSection('client', newConfig);
        showToast('Client settings updated', 'success');
    };

    const updateProjectConfig = (key: string, value: any) => {
        if (!projectConfig) return;
        const newConfig = { ...projectConfig, [key]: value };
        setProjectConfig(newConfig);
        settingsService.updateSection('project', newConfig);
        showToast('Project settings saved', 'success');
    };

    if (isLoading || !clientConfig || !projectConfig) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Client Settings */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100 dark:border-blue-500/20">
                        <Building className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Client Configuration</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Data requirements</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="pr-4">
                            <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Require Client Email & Phone</span>
                            <p className="text-[10px] show-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Mandatory contact details</p>
                        </div>
                        <button
                            onClick={() => updateClientConfig('requireEmailPhone', !clientConfig.requireEmailPhone)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                clientConfig.requireEmailPhone ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                clientConfig.requireEmailPhone ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="pr-4">
                            <span className="text-sm font-black text-slate-900 dark:text-white block mb-0.5">Enable Client Categories</span>
                            <p className="text-[10px] show-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Group by Industry/Type</p>
                        </div>
                        <button
                            onClick={() => updateClientConfig('enableCategories', !clientConfig.enableCategories)}
                            className={cn(
                                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                clientConfig.enableCategories ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                clientConfig.enableCategories ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Project Defaults */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5 mb-8">
                    <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                        <Briefcase className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Project Defaults</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Preset configurations</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Default Project Status</label>
                        <div className="relative">
                            <select
                                value={projectConfig.defaultStatus}
                                onChange={(e) => updateProjectConfig('defaultStatus', e.target.value)}
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-5 appearance-none cursor-pointer"
                            >
                                <option value="Active">Active</option>
                                <option value="Planning">Planning</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Budget Type Default</label>
                        <div className="relative">
                            <select
                                value={projectConfig.defaultBudgetType}
                                onChange={(e) => updateProjectConfig('defaultBudgetType', e.target.value)}
                                className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-5 appearance-none cursor-pointer"
                            >
                                <option value="Total Project Hours">Total Project Hours</option>
                                <option value="Total Project Fees">Total Project Fees</option>
                                <option value="No Budget">No Budget</option>
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-4 pt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Assignment Rules</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700/50 transition-all group">
                                <input
                                    type="checkbox"
                                    checked={projectConfig.allowMultipleAssignments}
                                    onChange={(e) => updateProjectConfig('allowMultipleAssignments', e.target.checked)}
                                    className="h-5 w-5 text-blue-600 dark:text-blue-500 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-blue-500/20"
                                />
                                <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Multiple Assignments</span>
                            </label>
                            <label className="flex items-center p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700/50 transition-all group">
                                <input
                                    type="checkbox"
                                    checked={projectConfig.requireProjectManager}
                                    onChange={(e) => updateProjectConfig('requireProjectManager', e.target.checked)}
                                    className="h-5 w-5 text-blue-600 dark:text-blue-500 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-blue-500/20"
                                />
                                <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Require Project Manager</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProjectClientSettings;
