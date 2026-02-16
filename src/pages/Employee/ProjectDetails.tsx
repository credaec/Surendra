import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Building2, Eye } from 'lucide-react';
import { backendService } from '../../services/backendService';
import type { Project } from '../../types/schema';
import { cn } from '../../lib/utils';

const ProjectDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
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
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1 space-x-3">
                        <span className="flex items-center"><Building2 className="h-3.5 w-3.5 mr-1" /> {project.clientName}</span>
                        <span>•</span>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium uppercase",
                            project.status === 'ACTIVE' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        )}>
                            {project.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Project Overview</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 mb-1">Start Date</p>
                                <p className="font-medium flex items-center text-slate-900 dark:text-white"><Calendar className="h-4 w-4 mr-2 text-slate-400" /> {new Date(project.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 mb-1">Billing Mode</p>
                                <p className="font-medium text-slate-900 dark:text-white">{project.billingMode.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Team Members</h2>
                        <div className="space-y-3">
                            {project.teamMembers?.map((member, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mr-3">
                                            {member.role.charAt(0)}
                                        </div>
                                        <div>
                                            {/* Resolve name from userId */}
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {backendService.getUsers().find(u => u.id === member.userId)?.name || `User ${member.userId}`}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!project.teamMembers || project.teamMembers.length === 0) && (
                                <p className="text-slate-500 dark:text-slate-400 text-sm italic">No team members assigned.</p>
                            )}
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Project Documents</h2>
                        {project.documents && project.documents.length > 0 ? (
                            <div className="space-y-3">
                                {project.documents.map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                                                <div className="text-xs font-bold uppercase">{doc.type}</div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => window.open(doc.id, '_blank')} // Placeholder for now
                                                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-sm font-medium px-3 py-1 flex items-center transition-colors"
                                            >
                                                <Eye className="h-4 w-4 mr-1.5" />
                                                View
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium px-3 py-1">
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                <p className="text-sm">No documents uploaded for this project.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Only show actions for non-admins if needed, or check role */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Actions</h3>
                        <button
                            onClick={() => navigate(location.pathname.startsWith('/admin') ? '/admin/timesheets' : '/employee/timer', { state: { projectId: project.id } })}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Clock className="h-4 w-4 mr-2" /> {location.pathname.startsWith('/admin') ? 'View Timesheets' : 'Start Timer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;

