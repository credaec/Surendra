import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockBackend } from '../../services/mockBackend';

const ProjectBudgetBurnChart: React.FC = () => {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const loadData = () => {
            const projects = mockBackend.getProjects();
            const entries = mockBackend.getEntries();
            const activeProjects = projects.filter(p => p.status === 'ACTIVE');

            const data = activeProjects.map(project => {
                const projectEntries = entries.filter(e => e.projectId === project.id);
                // Calculate actual hours used
                const actualHours = projectEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0) / 60;

                // Determine planned/budget hours
                // If budgetAmount exists, use that (assuming simplistic $1 = 1hr for demo if no rate).
                // Or better, prefer estimatedHours if available.
                const plannedHours = project.estimatedHours || (project.budgetAmount ? project.budgetAmount / 50 : 0) || 0;

                return {
                    name: project.name.split(' ').slice(0, 2).join(' '), // Shorten name
                    planned: Math.round(plannedHours),
                    actual: Math.round(actualHours)
                };
            }).filter(item => item.planned > 0 || item.actual > 0) // Only show relevant projects
                .sort((a, b) => b.planned - a.planned) // Sort by biggest projects
                .slice(0, 5); // Top 5

            setChartData(data);
        };

        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Project Budget Burn (Hours)</h3>

            <div className="h-72 w-full" style={{ minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} interval={0} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                        <Bar dataKey="planned" fill="#e2e8f0" name="Planned Budget" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" fill="#3b82f6" name="Actual Used" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProjectBudgetBurnChart;
