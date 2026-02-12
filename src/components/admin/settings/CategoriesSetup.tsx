import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Tags } from 'lucide-react';
import { backendService } from '../../../services/backendService';
import type { TaskCategory } from '../../../types/schema';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../lib/utils';

const CategoriesSetup: React.FC = () => {
    const [categories, setCategories] = useState<TaskCategory[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TaskCategory | null>(null);
    const { showToast } = useToast();

    // Form State
    const [formData, setFormData] = useState<Partial<TaskCategory>>({
        name: '',
        isBillable: true,
        status: 'ACTIVE'
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        setCategories(backendService.getTaskCategories());
    };

    const handleOpenModal = (category?: TaskCategory) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ ...category });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                isBillable: true,
                status: 'ACTIVE',
                isProofRequired: false,
                isNotesRequired: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSave = async () => {
        if (!formData.name) {
            showToast('Category name is required', 'error');
            return;
        }

        if (editingCategory) {
            await backendService.updateTaskCategory({ ...editingCategory, ...formData } as TaskCategory);
            showToast('Category updated successfully', 'success');
        } else {
            await backendService.addTaskCategory({
                ...formData as any,
                isProofRequired: formData.isProofRequired ?? false,
                isNotesRequired: formData.isNotesRequired ?? true,
                restrictedToProjects: []
            });
            showToast('Category added successfully', 'success');
        }
        loadCategories();
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            await backendService.deleteTaskCategory(id);
            showToast('Category deleted', 'success');
            loadCategories();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-5">
                    <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                        <Tags className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Task Categories</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Classification & Types</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 shadow-xl shadow-blue-600/20 transition-all text-xs font-black uppercase tracking-widest active:scale-95"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-300 p-2">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-6 uppercase tracking-widest text-[10px] font-black pl-10">Category Name</th>
                            <th className="px-8 py-6 uppercase tracking-widest text-[10px] font-black">Billable</th>
                            <th className="px-8 py-6 uppercase tracking-widest text-[10px] font-black">Status</th>
                            <th className="px-8 py-6 uppercase tracking-widest text-[10px] font-black text-right pr-10">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-200">
                                <td className="px-8 py-6 pl-10">
                                    <div className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={cn(
                                        "inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                        cat.isBillable
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                                    )}>
                                        {cat.isBillable ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={cn(
                                        "inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                        cat.status === 'ACTIVE'
                                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                                    )}>
                                        {cat.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right pr-10">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(cat)}
                                            className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400">
                                    No categories found. Click "Add Category" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Note Card */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start">
                <div className="p-1 bg-slate-200 dark:bg-slate-800 rounded-lg mr-3 mt-0.5">
                    <Tags className="h-3 w-3 text-slate-500" />
                </div>
                <p className="leading-relaxed"><strong>System Note:</strong> Employees utilize these categories for timesheet entries. Maintaining a concise list ensures accurate reporting and billing classification.</p>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center p-8 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {editingCategory ? 'Edit Category' : 'New Category'}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Configure details</p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                    Category Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold h-12 px-5"
                                    placeholder="e.g. Design, Development"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group" onClick={() => setFormData({ ...formData, isBillable: !formData.isBillable })}>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 text-blue-600 dark:text-blue-500 border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                    checked={formData.isBillable}
                                    onChange={(e) => setFormData({ ...formData, isBillable: e.target.checked })}
                                />
                                <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Billable Category</span>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</label>
                                <div className="relative">
                                    <select
                                        className="w-full text-xs font-bold border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all h-12 px-5 appearance-none cursor-pointer"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 p-8 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-3 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center uppercase tracking-widest active:scale-95"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                {editingCategory ? 'Save Changes' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesSetup;
