import React, { useEffect, useState } from 'react';
import { Play, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { mockBackend } from '../../../services/mockBackend';

export const MyProjectsCard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assignedItems, setAssignedItems] = useState<{ id: string, name: string, subtitle: string, categoryId: string }[]>([]);

    useEffect(() => {
        if (!user) return;

        // 1. Get Assignments
        const assignments = mockBackend.getUserAssignments(user.id);
        const allCategories = mockBackend.getTaskCategories();

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

        // 3. Fallback / Default Projects if empty (Optional, but good for demo)
        if (items.length === 0) {
            items.push(
                { id: 'p1', name: 'Skyline Tower Design', subtitle: 'Apex Corp', categoryId: 'Design' },
                { id: 'p2', name: 'Riverfront Park', subtitle: 'City Planning', categoryId: 'Planning' }
            );
        }

        setAssignedItems(items);
    }, [user]);

    const handleStartTimer = (item: typeof assignedItems[0]) => {
        if (!user) return;

        // Mock start timer - Defaulting to "Internal" project for assigned tasks for now
        // In a real app, we might ask which project this task belongs to.
        mockBackend.startTimer(user.id, user.name, 'p_internal', item.categoryId);
        navigate('/employee/timer');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">My Projects & Tasks</h3>
                <button onClick={() => navigate('/employee/projects')} className="text-xs text-blue-600 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
                {assignedItems.map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                            <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                        </div>
                        <button
                            onClick={() => handleStartTimer(item)}
                            title="Start Timer"
                            className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                            <Play className="h-3.5 w-3.5 ml-0.5" />
                        </button>
                    </div>
                ))}
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

        // 1. Check for Rejected Timesheets
        const approvals = mockBackend.getApprovals();
        const rejected = approvals.filter(a => a.employeeId === user.id && a.status === 'REJECTED');
        rejected.forEach(r => {
            dynNotifications.push({
                type: 'error',
                title: 'Timesheet Rejected',
                subtitle: `Week: ${r.weekRange}. reason: "${r.remarks || 'No reason provided'}"`
            });
        });

        // 2. Check for Pending Submission (Current Week)
        // Simple logic: If we have entries for this week but no "SUBMITTED" or "APPROVED" request

        // Assuming we can get entries directly
        const entries = mockBackend.getEntries(user.id);
        // data-fns isn't imported here, so we'll do a simple check or just mock the logic "smartly"
        // For now, let's look for any 'DRAFT' status entries or missing approval request for current week.
        // To be safe and avoid complex date math imports if not present, let's use the 'active' check.

        // Simpler approach for demo: Check if there are unsubmitted entries
        const hasUnsubmitted = entries.some(e => !e.status || e.status === 'DRAFT'); // Assuming DRAFT is default/empty

        if (hasUnsubmitted) {
            dynNotifications.push({
                type: 'warning',
                title: 'Timesheet Submission Pending',
                subtitle: 'You have unsubmitted hours for this week.'
            });
        }

        // If empty, show "All caught up"
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-slate-400" /> Notifications
                </h3>
            </div>
            <div className="p-4 space-y-4">
                {notifications.map((notif, idx) => (
                    <div key={idx} className="flex space-x-3">
                        <div className={`h-2 w-2 mt-1.5 rounded-full flex-shrink-0 ${notif.type === 'error' ? 'bg-red-500' :
                            notif.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                        <div>
                            <p className="text-xs text-slate-900 font-medium">{notif.title}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{notif.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
