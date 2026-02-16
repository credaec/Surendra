import React from 'react';
import ProjectCard from './ProjectCard';
import type { Project } from '../../../types/schema';

interface ProjectsGridProps {
    projects: Project[];
    onStartTimer: (projectId: string) => void;
    onViewDetails: (projectId: string) => void;
    viewMode?: 'grid' | 'list';
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, onStartTimer, onViewDetails, viewMode = 'grid' }) => {
    if (viewMode === 'list') {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Project</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Client</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Status</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-4">
                                            {project.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{project.name}</p>
                                            <p className="text-xs text-slate-500">{project.code || 'NO-CODE'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{project.clientName}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                            project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400' :
                                                'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => onStartTimer(project.id)}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                                    >
                                        Timer
                                    </button>
                                    <button
                                        onClick={() => onViewDetails(project.id)}
                                        className="inline-flex items-center px-3 py-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
                <div key={project.id} className="h-full">
                    <ProjectCard
                        project={project}
                        onStartTimer={onStartTimer}
                        onViewDetails={onViewDetails}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProjectsGrid;
