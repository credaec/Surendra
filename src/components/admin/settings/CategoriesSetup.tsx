import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';
import type { TaskCategory } from '../../../types/schema';
import { useToast } from '../../../context/ToastContext';

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
        setCategories(mockBackend.getTaskCategories());
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

    const handleSave = () => {
        if (!formData.name) {
            showToast('Category name is required', 'error');
            return;
        }

        if (editingCategory) {
            mockBackend.updateTaskCategory({ ...editingCategory, ...formData } as TaskCategory);
            showToast('Category updated successfully', 'success');
        } else {
            mockBackend.addTaskCategory({
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

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            mockBackend.deleteTaskCategory(id);
            showToast('Category deleted', 'success');
            loadCategories();
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Task Categories</h3>
                    <p className="text-sm text-slate-500">Define the types of work employees can select in timesheets.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Category Name</th>
                            <th className="px-6 py-4">Billable Allowed</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{cat.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${cat.isBillable
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {cat.isBillable ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cat.status === 'ACTIVE'
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {cat.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(cat)}
                                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    No categories found. Click "Add Category" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                <p><strong>Note:</strong> Employees cannot create categories. Only Admins can manage this list to ensure data consistency.</p>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Category Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="e.g., Engineering, Consultations"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                        checked={formData.isBillable}
                                        onChange={(e) => setFormData({ ...formData, isBillable: e.target.checked })}
                                    />
                                    <span className="text-sm text-slate-700">Billable</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    className="w-full text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 p-6 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                {editingCategory ? 'Save Changes' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesSetup;
