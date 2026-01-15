import React from 'react';
import { Briefcase, Building } from 'lucide-react';

const ProjectClientSettings: React.FC = () => {
    // Mock settings for this specific section not strictly coverd by global AppSettings,
    // demonstrating specific module configuration.

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
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 cursor-pointer">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div>
                            <span className="text-sm font-medium text-slate-700">Enable Client Categories</span>
                            <p className="text-xs text-slate-500">Group clients by Industry or Type.</p>
                        </div>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-pointer">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                        </div>
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
                        <select className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option>Active</option>
                            <option>Planning</option>
                            <option>On Hold</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Budget Type Default</label>
                        <select className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option>Total Project Hours</option>
                            <option>Total Project Fees</option>
                            <option>No Budget</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <h4 className="text-sm font-medium text-slate-900 mb-3">Assignment Rules</h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input type="checkbox" checked readOnly className="h-4 w-4 text-blue-600 rounded border-slate-300" />
                                <span className="ml-2 text-sm text-slate-600">Allow employees to be assigned to multiple projects</span>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-slate-300" />
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
