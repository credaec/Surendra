import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Building2, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBackend } from '../../services/mockBackend';

const ProjectListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const projects = mockBackend.getProjects();
    const entries = mockBackend.getEntries();

    const enrichedProjects = projects.map(p => {
        const projectEntries = entries.filter(e => e.projectId === p.id);
        const totalMinutes = projectEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
        const totalHours = Math.round(totalMinutes / 60);
        const progress = p.estimatedHours ? Math.min(100, Math.round((totalHours / p.estimatedHours) * 100)) : 0;

        return {
            ...p,
            loggedHours: totalHours,
            progress
        };
    });

    const filteredProjects = enrichedProjects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage ongoing and completed projects</p>
                </div>
                <button
                    onClick={() => navigate('/projects/new')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search projects or clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{project.clientName}</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 mb-5">
                            <div className="flex items-center text-xs text-slate-500 gap-2">
                                <span className={`w-2 h-2 rounded-full ${project.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                <span className="font-medium">{project.status}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Progress</span>
                                <span className="font-medium text-slate-700">{project.progress}%</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{project.startDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{project.loggedHours}h Logged</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Placeholder */}
                <button
                    onClick={() => navigate('/projects/new')}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:bg-blue-50/10 hover:text-blue-600 transition-all group min-h-[200px]"
                >
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium text-sm">Create New Project</span>
                </button>
            </div>
        </div>
    );
};

export default ProjectListPage;
