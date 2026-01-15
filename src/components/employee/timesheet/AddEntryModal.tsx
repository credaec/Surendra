import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';
import { useAuth } from '../../../context/AuthContext';

interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    selectedDate?: string;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, onSave, selectedDate }) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        projectId: '',
        description: '',
        hours: 0,
        minutes: 0,
        date: selectedDate || new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            setProjects(mockBackend.getProjects());
            setFormData(prev => ({
                ...prev,
                date: selectedDate || new Date().toISOString().split('T')[0]
            }));
        }
    }, [isOpen, selectedDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const totalMinutes = (Number(formData.hours) * 60) + Number(formData.minutes);

        if (totalMinutes === 0) {
            alert('Please enter duration (hours or minutes)');
            return;
        }

        const project = projects.find(p => p.id === formData.projectId);

        try {
            // Note: mockBackend uses 'addEntry' not 'addTimeEntry' based on grep assumption,
            // but I will verify in view_file. If it is addEntry:
            mockBackend.addEntry({
                userId: user.id,
                projectId: formData.projectId,
                projectName: project?.name || 'Unknown',
                description: formData.description,
                startTime: new Date(`${formData.date}T09:00:00`).toISOString(),
                endTime: new Date(`${formData.date}T${9 + Math.floor(totalMinutes / 60)}:${totalMinutes % 60}:00`).toISOString(),
                durationMinutes: totalMinutes,
                status: 'PENDING',
                category: 'Development',
                isBillable: true, // Default
                date: formData.date
            } as any);
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to save entry');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Add Time Entry</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                        <select
                            required
                            value={formData.projectId}
                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="What did you work on?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hours</label>
                            <input
                                type="number"
                                min="0"
                                max="24"
                                value={formData.hours}
                                onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Minutes</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                step="5"
                                value={formData.minutes}
                                onChange={(e) => setFormData({ ...formData, minutes: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-colors flex items-center"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEntryModal;
