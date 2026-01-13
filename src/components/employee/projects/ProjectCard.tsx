import React from 'react';
import { MoreHorizontal, Play, Calendar, User, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Project } from '../../../types/schema'; // Safely import interface

interface ProjectCardProps {
    project: Project;
    onStartTimer: (projectId: string) => void;
    onViewDetails: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onStartTimer, onViewDetails }) => {

    // Mock computed values for UI demo
    const loggedHours = 18.5;
    const billablePercent = 72;
    const allowedCategories = ['Engineering', 'Drafting', 'Modelling'];
    const remainingCategories = 2; // "+2 more"

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">

            {/* Card Header */}
            <div className="p-5 border-b border-slate-50">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {project.code}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase",
                                project.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                    project.status === 'PLANNED' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                        "bg-slate-50 text-slate-600 border-slate-200"
                            )}>
                                {project.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                            {project.name}
                        </h3>
                        <div className="text-sm text-slate-500 font-medium mt-0.5">
                            {project.clientName}
                        </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">

                {/* Meta Info */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-xs text-slate-500">
                        <User className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        Manager: <span className="text-slate-700 font-medium ml-1">Sarah Jenkins</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                        Due: <span className="text-slate-700 font-medium ml-1">{project.endDate || 'Ongoing'}</span>
                    </div>
                </div>

                {/* Progress / Hours */}
                <div className="mb-6 bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-semibold text-slate-600">Logged this month</span>
                        <span className="text-sm font-bold text-slate-900">{loggedHours}h</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="flex justify-end mt-1.5">
                        <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                            {billablePercent}% Billable
                        </span>
                    </div>
                </div>

                {/* Categories Chips */}
                <div className="mt-auto">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wide">Allowed Tasks</p>
                    <div className="flex flex-wrap gap-2">
                        {allowedCategories.map(cat => (
                            <span key={cat} className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                                {cat}
                            </span>
                        ))}
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                            +{remainingCategories} more
                        </span>
                    </div>
                </div>

            </div>

            {/* Card Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-b-xl">
                <button
                    onClick={() => onViewDetails(project.id)}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline flex items-center"
                >
                    View Details
                </button>

                <button
                    onClick={() => onStartTimer(project.id)}
                    className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm"
                >
                    <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
                    Start Timer
                </button>
            </div>

        </div>
    );
};

export default ProjectCard;
