import React from 'react';
import { MoreHorizontal, Play, Calendar, User } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Project } from '../../../types/schema'; // Safely import interface
import { backendService } from '../../../services/backendService';

interface ProjectCardProps {
    project: Project;
    onStartTimer: (projectId: string) => void;
    onViewDetails: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onStartTimer, onViewDetails }) => {

    // Resolve allowed tasks
    const allCategories = backendService.getTaskCategories();
    let allowedCategories = allCategories;

    if (project.allowedCategoryIds && project.allowedCategoryIds.length > 0) {
        allowedCategories = allCategories.filter(c => project.allowedCategoryIds?.includes(c.id));
    }

    // Sort by name for consistency
    allowedCategories.sort((a, b) => a.name.localeCompare(b.name));

    const displayLimit = 3;
    const visibleCategories = allowedCategories.slice(0, displayLimit);
    const remainingCount = allowedCategories.length - displayLimit;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">

            {/* Card Header */}
            <div className="p-5 border-b border-slate-50 dark:border-slate-800">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {project.code}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase",
                                project.status === 'ACTIVE' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800" :
                                    project.status === 'PLANNED' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800" :
                                        "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                            )}>
                                {project.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.name}
                        </h3>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {project.clientName}
                        </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">

                {/* Meta Info */}
                <div className="space-y-3 mb-6">
                    {/* Only show Manager if available */}
                    {(project as any).managerName && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <User className="h-3.5 w-3.5 mr-2 text-slate-400 dark:text-slate-500" />
                            Manager: <span className="text-slate-700 dark:text-slate-300 font-medium ml-1">{(project as any).managerName}</span>
                        </div>
                    )}
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400 dark:text-slate-500" />
                        Due: <span className="text-slate-700 dark:text-slate-300 font-medium ml-1">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}</span>
                    </div>
                </div>

                {/* Progress / Hours */}
                <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Logged this month</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {/* Display calculated hours or 0 */}
                            {(((project as any).totalTrackedMinutes || 0) / 60).toFixed(1)}h
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        {/* Mock progress bar for now, or 0 width if no hours */}
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((((project as any).totalTrackedMinutes || 0) / 60) * 5, 100)}%` }}></div>
                    </div>

                    {/* Only show billable if relevant (mocked for now as we don't have exact billable % per project here readily) */}
                    {/* <div className="flex justify-end mt-1.5">
                        <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                             72% Billable
                        </span>
                    </div> */}
                </div>

                {/* Categories Chips - Only show if it's a Project with multiple allowed tasks, not a single Task Assignment */}
                {!(project as any).categoryId && (
                    <div className="mt-auto">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-2 tracking-wide">Allowed Tasks</p>
                        <div className="flex flex-wrap gap-2">
                            {visibleCategories.map(cat => (
                                <span key={cat.id} className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md shadow-sm">
                                    {cat.name}
                                </span>
                            ))}
                            {remainingCount > 0 && (
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-2 py-1 rounded-md">
                                    +{remainingCount} more
                                </span>
                            )}
                            {allowedCategories.length === 0 && (
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 italic">
                                    All tasks allowed
                                </span>
                            )}
                        </div>
                    </div>
                )}
                {/* Provide context for Task Assignment */}
                {(project as any).categoryId && (
                    <div className="mt-auto">
                        <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-2 tracking-wide">Task</p>
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-2 py-1 rounded-md shadow-sm">
                            {(project as any).name} {/* Name acts as Category Name here */}
                        </span>
                    </div>
                )}

            </div>

            {/* Card Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between rounded-b-xl">
                <button
                    onClick={() => onViewDetails(project.id)}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:underline flex items-center"
                >
                    View Details
                </button>

                <button
                    onClick={() => onStartTimer(project.id)}
                    className="flex items-center px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
                    Start Timer
                </button>
            </div>

        </div>
    );
};

export default ProjectCard;
