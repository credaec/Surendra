import React, { useEffect, useState } from 'react';
import { Play, Bell, ArrowRight, FolderKanban, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { backendService } from '../../../services/backendService';
import { cn } from '../../../lib/utils';

export const MyProjectsCard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assignedItems, setAssignedItems] = useState<{ id: string, name: string, subtitle: string, categoryId: string }[]>([]);

    useEffect(() => {
        if (!user) return;

        // 1. Get Assignments
        const assignments = backendService.getUserAssignments(user.id);
        const allCategories = backendService.getTaskCategories();

        // 2. Map to display items
        const items = assignments.map(asn => {
            const category = allCategories.find(c => c.id === asn.categoryId);
            return {
                id: asn.id,
                name: category ? category.name : 'Unknown Task',
                subtitle: 'Assigned Task',
                categoryId: asn.categoryId
            };
        });

        setAssignedItems(items);
    }, [user]);

    const handleStartTimer = (item: typeof assignedItems[0]) => {
        if (!user) return;
        navigate('/employee/timer', {
            state: {
                autoStart: true,
                projectId: 'p1',
                categoryId: item.categoryId
            }
        });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 transition-all duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
                        <FolderKanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Scope</h3>
                </div>
                <button
                    onClick={() => navigate('/employee/projects')}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:translate-x-1 transition-transform"
                >
                    View All
                </button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {assignedItems.length > 0 ? (
                    assignedItems.map(item => (
                        <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all group">
                            <div className="flex-1 min-w-0 mr-4">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase tracking-widest">{item.subtitle}</p>
                            </div>
                            <button
                                onClick={() => handleStartTimer(item)}
                                title="Start Timer"
                                className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white transition-all shadow-lg shadow-blue-500/10 active:scale-90"
                            >
                                <Play className="h-4 w-4 ml-0.5 fill-current" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-300 dark:text-slate-700">No items assigned</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const NotificationsCard: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<{ type: 'warning' | 'error' | 'info', title: string, subtitle: string }[]>([]);

    useEffect(() => {
        if (!user) return;
        const dynNotifications: typeof notifications = [];
        const approvals = backendService.getApprovals();
        const rejected = approvals.filter(a => a.employeeId === user.id && a.status === 'REJECTED');

        rejected.forEach(r => {
            dynNotifications.push({
                type: 'error',
                title: 'Timesheet Rejected',
                subtitle: `Week: ${r.weekRange}. reason: "${r.remarks || 'No reason provided'}"`
            });
        });

        const entries = backendService.getEntries(user.id);
        const hasUnsubmitted = entries.some(e => !e.status || e.status === 'DRAFT');

        if (hasUnsubmitted) {
            dynNotifications.push({
                type: 'warning',
                title: 'Submission Pending',
                subtitle: 'Unsubmitted hours for this week.'
            });
        }

        if (dynNotifications.length === 0) {
            dynNotifications.push({
                type: 'info',
                title: 'All caught up!',
                subtitle: 'No pending notifications.'
            });
        }

        setNotifications(dynNotifications);
    }, [user]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-xl">
                        <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">System Feed</h3>
                </div>
            </div>
            <div className="p-6 space-y-4">
                {notifications.map((notif, idx) => (
                    <div key={idx} className="flex space-x-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100/50 dark:border-slate-800/50 group hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110",
                            notif.type === 'error' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                notif.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        )}>
                            {notif.type === 'error' ? <AlertCircle className="h-5 w-5" /> :
                                notif.type === 'warning' ? <AlertCircle className="h-5 w-5" /> :
                                    <CheckCircle2 className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{notif.title}</p>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 leading-tight mt-1">{notif.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
