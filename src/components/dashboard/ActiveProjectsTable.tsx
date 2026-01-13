import React from 'react';
import { cn } from '../../lib/utils';

// Mock Data
const projects = [
    { id: 1, name: 'Skyline Tower Design', client: 'Apex Constructors', budget: 1200, used: 850, status: 'ACTIVE', health: 'GOOD' },
    { id: 2, name: 'Riverside Mall Struct.', client: 'Urban Developers', budget: 800, used: 720, status: 'ACTIVE', health: 'WARNING' },
    { id: 3, name: 'City Bridge Renov.', client: 'Gov Infrastructure', budget: 2500, used: 450, status: 'ACTIVE', health: 'GOOD' },
    { id: 4, name: 'Lakeside Villa Plans', client: 'Private Client', budget: 150, used: 160, status: 'OVER_BUDGET', health: 'CRITICAL' },
    { id: 5, name: 'Office HQ Retrofit', client: 'Tech Corp', budget: 500, used: 120, status: 'PLANNED', health: 'GOOD' },
];

const ActiveProjectsTable: React.FC = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Active Projects Snapshot</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Project Name</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Budget Used</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Health</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {projects.map((project) => {
                            const percentage = Math.round((project.used / project.budget) * 100);

                            return (
                                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{project.name}</td>
                                    <td className="px-6 py-4 text-slate-500">{project.client}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-full bg-slate-200 rounded-full h-2 w-24">
                                                <div
                                                    className={cn("h-2 rounded-full",
                                                        percentage > 100 ? "bg-red-500" :
                                                            percentage > 85 ? "bg-amber-500" : "bg-blue-500"
                                                    )}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500">{percentage}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium",
                                            project.status === 'ACTIVE' ? "bg-blue-50 text-blue-700" :
                                                project.status === 'OVER_BUDGET' ? "bg-red-50 text-red-700" :
                                                    "bg-slate-100 text-slate-600"
                                        )}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn("h-3 w-3 rounded-full block",
                                            project.health === 'GOOD' ? "bg-emerald-500" :
                                                project.health === 'WARNING' ? "bg-amber-500" :
                                                    "bg-red-500"
                                        )} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveProjectsTable;
