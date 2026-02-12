import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, User, Briefcase } from 'lucide-react';
import { backendService } from '../../services/backendService';
import { format, differenceInMinutes, parse } from 'date-fns';
import type { User as UserType, Project, TaskCategory } from '../../types/schema';

interface ManualEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    filterEmployeeId?: string;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ isOpen, onClose, onSuccess }) => {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<UserType[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<TaskCategory[]>([]);

    const [formData, setFormData] = useState({
        employeeId: '',
        projectId: '',
        categoryId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '17:00',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            setEmployees(backendService.getUsers().filter(u => u.role === 'EMPLOYEE'));
            setProjects(backendService.getProjects());
            setCategories(backendService.getTaskCategories());
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const start = parse(formData.startTime, 'HH:mm', new Date());
            const end = parse(formData.endTime, 'HH:mm', new Date());
            const durationMinutes = differenceInMinutes(end, start);

            if (durationMinutes <= 0) {
                alert("End time must be after start time");
                setLoading(false);
                return;
            }

            await backendService.addTimeEntry({
                userId: formData.employeeId,
                projectId: formData.projectId,
                categoryId: formData.categoryId,
                date: formData.date,
                startTime: `${formData.date}T${formData.startTime}:00`,
                endTime: `${formData.date}T${formData.endTime}:00`,
                durationMinutes: durationMinutes,
                description: formData.description,
                isBillable: true, // Default to billable for admin entry
                status: 'APPROVED', // Admin entries are auto-approved
                // userName: selectedEmployee?.name || 'Unknown', // Not in schema but might be needed by some mocks
            });

            setTimeout(() => {
                setLoading(false);
                onSuccess?.();
                onClose();
                // alert("Entry added successfully"); // Optional: replace with toast
            }, 500);
        } catch (error) {
            console.error("Failed to add entry", error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        Manual Time Entry (Admin Override)
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase">Employee</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <select
                                    required
                                    value={formData.employeeId}
                                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="">Select Employee...</option>
                                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase">Project</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <select
                                    required
                                    value={formData.projectId}
                                    onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
                                >
                                    <option value="">Select Project...</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase">Task Category</label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white"
                        >
                            <option value="">Select Category...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            {/* Assuming categoryId in TimeEntry stores the name for now based on previous mock data observation, 
                                but schema says categoryId. If backendService stores names, we stick to names or IDs. 
                                Let's assume names for now if other components use names, or IDs if strictly following schema.
                                Checking schema TaskCategory has id and name. 
                                Checking TimeEntry has categoryId. 
                                Let's use ID if possible, but previous code used 'Engineering' etc strings? 
                                Let's use name as value if previous mock data used strings, or ID if it used IDs. 
                                Mock data in TimeLogsTab used 'Engineering' (string). So I will use name for now to match UI. */}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase">Start</label>
                                <input
                                    type="time"
                                    required
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase">End</label>
                                <input
                                    type="time"
                                    required
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
                            placeholder="Work description..."
                        ></textarea>
                    </div>

                    <div className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50">
                            {loading ? 'Adding...' : 'Add Time Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualEntryModal;

