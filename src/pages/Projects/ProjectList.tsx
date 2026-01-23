import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Building2, Calendar, Clock, Check, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBackend } from '../../services/mockBackend';

const ProjectListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD'>('ALL');
    const [showTrash, setShowTrash] = useState(false);
    const [activeMenuProject, setActiveMenuProject] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0); // To trigger re-render on updates

    // Force re-fetch on refreshKey change (simple way for mock data)
    const projects = React.useMemo(() => mockBackend.getProjects(), [refreshKey]);
    const entries = React.useMemo(() => mockBackend.getEntries(), []);

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

    const filteredProjects = enrichedProjects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.clientName.toLowerCase().includes(searchTerm.toLowerCase());

        // Trash Logic
        if (showTrash) {
            return matchesSearch && p.status === 'ARCHIVED';
        }

        // Normal View Logic (Exclude Archived)
        if (p.status === 'ARCHIVED') return false;

        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEditProject = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        setActiveMenuProject(null);
        navigate(`/admin/projects/${projectId}/edit`);
    };

    const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to move this project to trash?')) {
            mockBackend.deleteProject(projectId);
            setRefreshKey(prev => prev + 1);
            setActiveMenuProject(null);
        }
    };

    const handleRestoreProject = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        if (confirm('Restore this project?')) {
            mockBackend.restoreProject(projectId);
            setRefreshKey(prev => prev + 1);
            setActiveMenuProject(null);
        }
    };

    // Permanently Delete (Optional, for trash view)
    const handlePermanentDelete = (e: React.MouseEvent, projectId: string) => {
        // Not implemented in mockBackend yet, safe to just ignore or implement later
        // For now, let's just use restore in trash view
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        {showTrash ? (
                            <>
                                <Trash2 className="w-6 h-6 text-slate-400" /> Trash (Deleted Projects)
                            </>
                        ) : 'Projects'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{showTrash ? 'View and restore deleted projects' : 'Manage ongoing and completed projects'}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowTrash(!showTrash)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium shadow-sm border ${showTrash
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        title={showTrash ? "Back to Projects" : "View Trash"}
                    >
                        {showTrash ? <ArrowLeft className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                        {showTrash ? 'Back to Projects' : 'Trash'}
                    </button>
                    {!showTrash && (
                        <button
                            onClick={() => navigate('/admin/projects/new')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    )}
                </div>
            </div>

            {/* Filters (Hide in Trash view) */}
            {!showFilters && !showTrash && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    {/* ... Search implementation remains same, just need to ensure variable scope ... */}
                    {/* Wait, I'm replacing the whole return block part or just up to filters? 
                       The replacement block is large. I should copy the search inputs logic too if I'm replacing lines 48-64 etc. 
                       Actually, I'll keep the search bar logic in the replacement content below for safety. 
                   */}
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-lg transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-10 p-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="mb-2 px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Status
                                </div>
                                {['ALL', 'ACTIVE', 'COMPLETED', 'ON_HOLD'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setStatusFilter(status as any);
                                            setShowFilters(false);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                                    >
                                        <span className="capitalize">{status.replace('_', ' ').toLowerCase()}</span>
                                        {statusFilter === status && <Check className="w-4 h-4 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Special Search Bar for Trash View (Optional, but cleaner to just have one. 
                For layout consistency, let's keep the filter bar visible but disable status toggle if in trash?
                Or just hide separate status filter. Simplified above: filtered by Trash state.
                Re-rendering the search bar if showTrash so it doesn't disappear.
            */}
            {showTrash && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search deleted projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            )}


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
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuProject(activeMenuProject === project.id ? null : project.id);
                                    }}
                                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>

                                {activeMenuProject === project.id && (
                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 z-10 py-1 animate-in fade-in zoom-in-95 duration-200">
                                        {!showTrash ? (
                                            <>
                                                <button
                                                    onClick={(e) => handleEditProject(e, project.id)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteProject(e, project.id)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={(e) => handleRestoreProject(e, project.id)}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-left"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                Restore
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 mb-5">
                            <div className="flex items-center text-xs text-slate-500 gap-2">
                                <span className={`w-2 h-2 rounded-full ${project.status === 'ACTIVE' ? 'bg-emerald-500' : project.status === 'ARCHIVED' ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
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
                {/* Empty State / Add New Placeholder */}
                {!showTrash && (
                    <button
                        onClick={() => navigate('/admin/projects/new')}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:bg-blue-50/10 hover:text-blue-600 transition-all group min-h-[200px]"
                    >
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm">Create New Project</span>
                    </button>
                )}
            </div>
        </div >
    );
};

export default ProjectListPage;
