import React, { useMemo } from 'react';
import { Briefcase, Folder } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';
import type { TimeEntry } from '../../../types/schema';

interface ReportsBreakdownProps {
    entries: TimeEntry[];
}

const ReportsBreakdown: React.FC<ReportsBreakdownProps> = ({ entries }) => {

    // Calculate Project Breakdown
    const projectStats = useMemo(() => {
        const stats = new Map<string, number>();
        let totalHours = 0;
        const projects = mockBackend.getProjects();

        entries.forEach(e => {
            const hours = e.durationMinutes / 60;
            const project = projects.find(p => p.id === e.projectId);
            const name = project?.name || 'Unknown Project';
            stats.set(name, (stats.get(name) || 0) + hours);
            totalHours += hours;
        });

        // Convert to array and sort by hours desc
        const result = Array.from(stats.entries()).map(([name, hours]) => ({
            name,
            hours,
            percent: totalHours > 0 ? (hours / totalHours) * 100 : 0
        })).sort((a, b) => b.hours - a.hours).slice(0, 5); // Top 5

        // Assign colors dynamically (cycle through a few)
        const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500'];
        return result.map((item, index) => ({
            ...item,
            color: colors[index % colors.length]
        }));
    }, [entries]);

    // Calculate Category Breakdown
    const categoryStats = useMemo(() => {
        const stats = new Map<string, number>();

        entries.forEach(e => {
            const hours = e.durationMinutes / 60;
            // Use categoryId as name for now
            stats.set(e.categoryId, (stats.get(e.categoryId) || 0) + hours);
        });

        return Array.from(stats.entries()).map(([name, hours]) => ({
            name,
            hours,
            proofRequired: ['Drafting', 'Site Visits'].includes(name) // Mock logic
        })).sort((a, b) => b.hours - a.hours);
    }, [entries]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Card C: Project Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center mb-6">
                    <Briefcase className="h-4 w-4 text-slate-400 mr-2" />
                    <h3 className="font-semibold text-slate-900">Project Breakdown</h3>
                </div>
                {projectStats.length === 0 ? (
                    <p className="text-sm text-slate-500">No data available for this period.</p>
                ) : (
                    <div className="space-y-4">
                        {projectStats.map((project) => (
                            <div key={project.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">{project.name}</span>
                                    <span className="text-slate-500">{project.hours.toFixed(1)}h ({project.percent.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={`${project.color} h-2 rounded-full`}
                                        style={{ width: `${project.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Card D: Category Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center mb-6">
                    <Folder className="h-4 w-4 text-slate-400 mr-2" />
                    <h3 className="font-semibold text-slate-900">Category Breakdown</h3>
                </div>
                {categoryStats.length === 0 ? (
                    <p className="text-sm text-slate-500">No data available for this period.</p>
                ) : (
                    <div className="space-y-4">
                        {categoryStats.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <div className="font-medium text-slate-900 text-sm">{cat.name}</div>
                                    {cat.proofRequired && (
                                        <div className="text-[10px] text-amber-600 font-medium mt-0.5">Proof Required</div>
                                    )}
                                </div>
                                <div className="text-sm font-bold text-slate-700">{cat.hours.toFixed(1)}h</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default ReportsBreakdown;
