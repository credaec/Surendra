import React from 'react';
import { Briefcase, Folder } from 'lucide-react';

const ReportsBreakdown: React.FC = () => {
    const projects = [
        { name: 'BCS Skylights', hours: 42.5, percent: 65, color: 'bg-blue-500' },
        { name: 'Dr. Wade Residence', hours: 18.0, percent: 25, color: 'bg-indigo-500' },
        { name: 'City Mall Expansion', hours: 8.5, percent: 10, color: 'bg-violet-500' },
    ];

    const categories = [
        { name: 'Engineering', hours: 32.0, proofRequired: false },
        { name: 'Drafting', hours: 24.5, proofRequired: true },
        { name: 'Meetings', hours: 6.0, proofRequired: false },
        { name: 'Site Visits', hours: 4.0, proofRequired: true },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Card C: Project Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center mb-6">
                    <Briefcase className="h-4 w-4 text-slate-400 mr-2" />
                    <h3 className="font-semibold text-slate-900">Project Breakdown</h3>
                </div>
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div key={project.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">{project.name}</span>
                                <span className="text-slate-500">{project.hours}h ({project.percent}%)</span>
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
            </div>

            {/* Card D: Category Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center mb-6">
                    <Folder className="h-4 w-4 text-slate-400 mr-2" />
                    <h3 className="font-semibold text-slate-900">Category Breakdown</h3>
                </div>
                <div className="space-y-4">
                    {categories.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <div className="font-medium text-slate-900 text-sm">{cat.name}</div>
                                {cat.proofRequired && (
                                    <div className="text-[10px] text-amber-600 font-medium mt-0.5">Proof Required</div>
                                )}
                            </div>
                            <div className="text-sm font-bold text-slate-700">{cat.hours}h</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ReportsBreakdown;
