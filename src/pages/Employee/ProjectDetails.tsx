import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Building2 } from 'lucide-react';
import { backendService } from '../../services/backendService';
import type { Project } from '../../types/schema';
import { cn } from '../../lib/utils';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (id) {
            const found = backendService.getProjectById(id);
            if (found) {
                setProject(found);
            } else {
                // Handle not found
            }
        }
    }, [id]);

    if (!project) {
        return (
            <div className="p-8 text-center">
                <p>Loading project details...</p>
                <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mt-4">Go Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                    <div className="flex items-center text-sm text-slate-500 mt-1 space-x-3">
                        <span className="flex items-center"><Building2 className="h-3.5 w-3.5 mr-1" /> {project.clientName}</span>
                        <span>•</span>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium uppercase",
                            project.status === 'ACTIVE' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        )}>
                            {project.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Project Overview</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500 mb-1">Start Date</p>
                                <p className="font-medium flex items-center"><Calendar className="h-4 w-4 mr-2 text-slate-400" /> {project.startDate}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Billing Mode</p>
                                <p className="font-medium">{project.billingMode.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Team Members</h2>
                        <div className="space-y-3">
                            {project.teamMembers?.map((member, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                            {member.role.charAt(0)}
                                        </div>
                                        <div>
                                            {/* Resolve name from userId */}
                                            <p className="text-sm font-medium text-slate-900">
                                                {backendService.getUsers().find(u => u.id === member.userId)?.name || `User ${member.userId}`}
                                            </p>
                                            <p className="text-xs text-slate-500">{member.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!project.teamMembers || project.teamMembers.length === 0) && (
                                <p className="text-slate-500 text-sm italic">No team members assigned.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">Actions</h3>
                        <button
                            onClick={() => navigate('/employee/timer', { state: { projectId: project.id } })}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Clock className="h-4 w-4 mr-2" /> Start Timer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;

