import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { mockBackend } from '../../services/mockBackend';
import type { Project } from '../../types/schema';

interface ProjectWithStats extends Project {
    usedBudget: number;
    budgetHealth: 'GOOD' | 'WARNING' | 'CRITICAL';
    percentageUsed: number;
}

const ActiveProjectsTable: React.FC = () => {
    const [activeProjects, setActiveProjects] = useState<ProjectWithStats[]>([]);

    useEffect(() => {
        const fetchProjects = () => {
            const allProjects = mockBackend.getProjects();
            const entries = mockBackend.getEntries();
            const activeOnly = allProjects.filter(p => p.status === 'ACTIVE');

            const projectsStats = activeOnly.map(project => {
                // Calculate used hours/budget
                const projectEntries = entries.filter(e => e.projectId === project.id);
                const usedMinutes = projectEntries.reduce((acc, e) => acc + e.durationMinutes, 0);
                const usedHours = usedMinutes / 60;

                // Determine budget (use amount or estimated hours)
                // const totalBudget = project.currency ? project.budgetAmount : project.estimatedHours;
                // Simplified: Assuming we track against hours if no budget amount
                // const trackingMetric = project.budgetAmount ? (usedHours * 100) : usedHours; 
                // Or much simpler: Just track hours against estimatedHours for now as universal metric

                const percentage = project.estimatedHours > 0
                    ? Math.round((usedHours / project.estimatedHours) * 100)
                    : 0;

                let health: 'GOOD' | 'WARNING' | 'CRITICAL' = 'GOOD';
                if (percentage > 100) health = 'CRITICAL';
                else if (percentage > 85) health = 'WARNING';

                return {
                    ...project,
                    usedBudget: usedHours, // Displaying used hours primarily
                    budgetHealth: health,
                    percentageUsed: percentage
                };
            });

            // Sort by health (Critical first)
            projectsStats.sort((a, b) => b.percentageUsed - a.percentageUsed);
            setActiveProjects(projectsStats.slice(0, 5)); // Top 5
        };

        fetchProjects();
        // periodic refresh 
        const interval = setInterval(fetchProjects, 5000);
        return () => clearInterval(interval);

    }, []);

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Active Projects Snapshot</h3>
                <Link to="/admin/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Project Name</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Budget / Hours Used</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Health</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeProjects.map((project) => (
                            <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{project.name}</td>
                                <td className="px-6 py-4 text-slate-500">{project.clientName}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2 w-24">
                                            <div
                                                className={cn("h-2 rounded-full",
                                                    project.percentageUsed > 100 ? "bg-red-500" :
                                                        project.percentageUsed > 85 ? "bg-amber-500" : "bg-blue-500"
                                                )}
                                                style={{ width: `${Math.min(project.percentageUsed, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500">{project.percentageUsed}%</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                        {Math.round(project.usedBudget)} / {project.estimatedHours} h
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium",
                                        project.status === 'ACTIVE' ? "bg-blue-50 text-blue-700" :
                                            project.status === 'ON_HOLD' ? "bg-amber-50 text-amber-700" :
                                                "bg-slate-100 text-slate-600"
                                    )}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn("h-3 w-3 rounded-full block",
                                        project.budgetHealth === 'GOOD' ? "bg-emerald-500" :
                                            project.budgetHealth === 'WARNING' ? "bg-amber-500" :
                                                "bg-red-500"
                                    )} title={project.budgetHealth} />
                                </td>
                            </tr>
                        ))}
                        {activeProjects.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                    No active projects found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveProjectsTable;
