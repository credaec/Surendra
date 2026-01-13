import React from 'react';
import { AlertCircle, Play, ChevronRight, Bell } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ProofPendingCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-red-50 bg-red-50/30 flex items-center justify-between">
                <h3 className="font-semibold text-red-900 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-600" /> Proof Pending
                </h3>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </div>
            <div className="divide-y divide-slate-50">
                <div className="p-4 hover:bg-red-50/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Skyline Tower</p>
                            <p className="text-xs text-slate-500">Drafting • Jan 12</p>
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-600">3h 45m</span>
                    </div>
                    <button className="w-full py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors">
                        Upload Proof
                    </button>
                </div>
                {/* Second Item */}
                <div className="p-4 hover:bg-red-50/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Rework Request</p>
                            <p className="text-xs text-slate-500">Design • Jan 10</p>
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-600">1h 30m</span>
                    </div>
                    <button className="w-full py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors">
                        Upload Proof
                    </button>
                </div>
            </div>
        </div>
    );
};

export const MyProjectsCard: React.FC = () => {
    const projects = [
        { id: 1, name: 'Skyline Tower Design', client: 'Apex Corp' },
        { id: 2, name: 'Riverfront Park', client: 'City Planning' },
        { id: 3, name: 'Internal Training', client: 'Credence Inc' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">My Projects</h3>
                <a href="#" className="text-xs text-blue-600 hover:underline">View All</a>
            </div>
            <div className="divide-y divide-slate-50">
                {projects.map(p => (
                    <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                            <p className="text-xs text-slate-500 truncate">{p.client}</p>
                        </div>
                        <button className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <Play className="h-3.5 w-3.5 ml-0.5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const NotificationsCard: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-slate-400" /> Notifications
                </h3>
            </div>
            <div className="p-4 space-y-4">
                <div className="flex space-x-3">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-900 font-medium">Timesheet submission pending</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Please submit by Friday 5 PM</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-900 font-medium">PM rejected timesheet</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">"Missing proof for Jan 10 entry"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
