import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlignLeft, Briefcase, Layers } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';
import type { TimeEntry, Project, TaskCategory } from '../../../types/schema';

interface TimeEntryEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: TimeEntry;
    onSave: (updatedEntry: TimeEntry) => void;
}

const TimeEntryEditModal: React.FC<TimeEntryEditModalProps> = ({ isOpen, onClose, entry, onSave }) => {
    const [formData, setFormData] = useState<TimeEntry>(entry);
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<TaskCategory[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(entry);
            // Fetch dependencies
            setProjects(mockBackend.getProjects());
            setCategories(mockBackend.getTaskCategories());
        }
    }, [isOpen, entry]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'durationHours') {
            const hours = parseFloat(value) || 0;
            const minutes = (formData.durationMinutes % 60);
            setFormData(prev => ({ ...prev, durationMinutes: (hours * 60) + minutes }));
        } else if (name === 'durationMinutes') {
            const minutes = parseFloat(value) || 0;
            const hours = Math.floor(formData.durationMinutes / 60);
            setFormData(prev => ({ ...prev, durationMinutes: (hours * 60) + minutes }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const updated = mockBackend.updateEntry(formData);
            if (updated) {
                onSave(updated);
                onClose();
            }
            setLoading(false);
        }, 500);
    };

    if (!isOpen) return null;

    const currentHours = Math.floor(formData.durationMinutes / 60);
    const currentMinutes = formData.durationMinutes % 60;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-lg text-slate-900">Edit Time Log</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Project & Category row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" /> Project
                            </label>
                            <select
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                required
                            >
                                <option value="" disabled>Select Project</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5" /> Category
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date & Duration row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Duration
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        name="durationHours"
                                        value={currentHours}
                                        onChange={handleChange}
                                        min="0"
                                        max="23"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-8"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">h</span>
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        name="durationMinutes"
                                        value={currentMinutes}
                                        onChange={handleChange}
                                        min="0"
                                        max="59"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-8"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">m</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                            <AlignLeft className="w-3.5 h-3.5" /> Notes / Description
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            placeholder="Describe the activity..."
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-200"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default TimeEntryEditModal;
