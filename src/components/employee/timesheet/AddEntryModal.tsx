import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import { useAuth } from '../../../context/AuthContext';

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    selectedDate?: string;
    editData?: any; // StartTime, EndTime, Project, Description etc.
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, onSave, selectedDate, editData }) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        projectId: '',
        categoryId: '',
        description: '',
        hours: 0,
        minutes: 0,
        date: selectedDate || new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            setProjects(backendService.getProjects());
            setCategories(backendService.getTaskCategories());

            // If editing, populate form
            if (editData) {
                const mins = editData.durationMinutes || 0;

                setFormData({
                    projectId: editData.projectId,
                    categoryId: editData.categoryId || '',
                    description: editData.description || '',
                    hours: Math.floor(mins / 60),
                    minutes: mins % 60,
                    date: editData.date
                });
            } else {
                // Reset for add mode
                setFormData({
                    projectId: '',
                    categoryId: '',
                    description: '',
                    hours: 0,
                    minutes: 0,
                    date: selectedDate || new Date().toISOString().split('T')[0]
                });
            }
        }
    }, [isOpen, selectedDate, editData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const totalMinutes = (Number(formData.hours) * 60) + Number(formData.minutes);

        if (totalMinutes === 0) {
            alert('Please enter duration (hours or minutes)');
            return;
        }

        if (!formData.categoryId) {
            alert('Please select a category');
            return;
        }



        const [y, m, d] = formData.date.split('-').map(Number);
        const startTime = new Date(y, m - 1, d, 10, 0, 0); // 10:00 AM Local
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + totalMinutes);

        try {
            const commonData = {
                userId: user.id,
                projectId: formData.projectId,
                // projectName removed as it is not in schema
                description: formData.description,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                durationMinutes: totalMinutes,
                status: 'PENDING' as const,
                categoryId: formData.categoryId,
                isBillable: editData?.isBillable !== undefined ? editData.isBillable : true,
                date: formData.date,
                // Tag as Manual Entry
                activityLogs: editData ? undefined : JSON.stringify({ source: 'MANUAL', action: 'CREATED_MANUALLY', timestamp: new Date().toISOString() })
            };

            if (editData) {
                await backendService.updateTimeEntry({
                    id: editData.id,
                    ...commonData
                } as any);
            } else {
                await backendService.addTimeEntry(commonData as any);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert(`Failed to save entry: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editData ? 'Edit Time Entry' : 'Add Time Entry'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project</label>
                        <select
                            required
                            value={formData.projectId}
                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                            <option value="" className="dark:bg-slate-800">Select Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id} className="dark:bg-slate-800">{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                            <option value="" className="dark:bg-slate-800">Select Category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id} className="dark:bg-slate-800">{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            rows={3}
                            placeholder="What did you work on?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hours</label>
                            <input
                                type="number"
                                min="0"
                                max="24"
                                value={formData.hours}
                                onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Minutes</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                step="5"
                                value={formData.minutes}
                                onChange={(e) => setFormData({ ...formData, minutes: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 dark:shadow-none transition-colors flex items-center"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {editData ? 'Update Entry' : 'Save Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEntryModal;

