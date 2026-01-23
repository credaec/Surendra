import React, { useState } from 'react';
import { Briefcase, Building } from 'lucide-react';
import { settingsService } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';

const ProjectClientSettings: React.FC = () => {
    const { showToast } = useToast();
    const settings = settingsService.getSettings();

    const [clientConfig, setClientConfig] = useState(settings.client);
    const [projectConfig, setProjectConfig] = useState(settings.project);

    const updateClientConfig = (key: keyof typeof clientConfig, value: boolean) => {
        const newConfig = { ...clientConfig, [key]: value };
        setClientConfig(newConfig);
        settingsService.updateSection('client', newConfig);
        showToast('Client settings updated', 'success');
    };

    const updateProjectConfig = (key: keyof typeof projectConfig, value: any) => {
        const newConfig = { ...projectConfig, [key]: value };
        setProjectConfig(newConfig);
        settingsService.updateSection('project', newConfig);
        // Don't toast for every dropdown change to avoid spam, or do generic
        showToast('Project settings saved', 'success');
    };

    return (
        <div className="space-y-6">

            {/* Client Settings */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Building className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Client Configuration</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Require Client Email & Phone</span>
                            <p className="text-xs text-slate-500">Mandatory fields when creating a new client.</p>
                        </div>
                        <button
                            onClick={() => updateClientConfig('requireEmailPhone', !clientConfig.requireEmailPhone)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${clientConfig.requireEmailPhone ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${clientConfig.requireEmailPhone ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Enable Client Categories</span>
                            <p className="text-xs text-slate-500">Group clients by Industry or Type.</p>
                        </div>
                        <button
                            onClick={() => updateClientConfig('enableCategories', !clientConfig.enableCategories)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${clientConfig.enableCategories ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${clientConfig.enableCategories ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Project Defaults */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Briefcase className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Project Defaults</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Default Project Status</label>
                        <select
                            value={projectConfig.defaultStatus}
                            onChange={(e) => updateProjectConfig('defaultStatus', e.target.value)}
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Planning">Planning</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Budget Type Default</label>
                        <select
                            value={projectConfig.defaultBudgetType}
                            onChange={(e) => updateProjectConfig('defaultBudgetType', e.target.value)}
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Total Project Hours">Total Project Hours</option>
                            <option value="Total Project Fees">Total Project Fees</option>
                            <option value="No Budget">No Budget</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <h4 className="text-sm font-medium text-slate-900 mb-3">Assignment Rules</h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={projectConfig.allowMultipleAssignments}
                                    onChange={(e) => updateProjectConfig('allowMultipleAssignments', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 rounded border-slate-300"
                                />
                                <span className="ml-2 text-sm text-slate-600">Allow employees to be assigned to multiple projects</span>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={projectConfig.requireProjectManager}
                                    onChange={(e) => updateProjectConfig('requireProjectManager', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 rounded border-slate-300"
                                />
                                <span className="ml-2 text-sm text-slate-600">Require Project Manager for every project</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProjectClientSettings;
