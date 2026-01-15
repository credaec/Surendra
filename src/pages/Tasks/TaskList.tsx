import React, { useState } from 'react';
import { Plus, Search, Check, X, Tag, DollarSign, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { mockBackend } from '../../services/mockBackend';
import type { TaskCategory } from '../../types/schema';

const TaskListPage: React.FC = () => {
    const [categories, setCategories] = useState<TaskCategory[]>(mockBackend.getTaskCategories());
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Add Form State
    const [newCategory, setNewCategory] = useState<Partial<TaskCategory>>({
        name: '',
        isBillable: true,
        isProofRequired: false,
        isNotesRequired: false
    });

    const handleAddCategory = () => {
        if (!newCategory.name) return;

        mockBackend.addTaskCategory({
            name: newCategory.name,
            isBillable: newCategory.isBillable || false,
            isProofRequired: newCategory.isProofRequired || false,
            isNotesRequired: newCategory.isNotesRequired || false,
            defaultRate: newCategory.defaultRate,
            restrictedToProjects: []
        } as any); // Type assertion needed if schema doesn't exactly match Omit defaults

        // Refresh from source to be sure
        setCategories(mockBackend.getTaskCategories());
        setShowAddModal(false);
        setNewCategory({ name: '', isBillable: true, isProofRequired: false, isNotesRequired: false });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category? (This is a mock action)')) {
            // Mock backend doesn't implement delete yet, but let's update local state
            setCategories(categories.filter(c => c.id !== id));
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Task Categories</h1>
                    <p className="text-slate-500 mt-1">Manage the types of work your team tracks time against.</p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm ring-offset-2 focus:ring-2 ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-10 pr-4 py-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
                                <Tag className="h-6 w-6" />
                            </div>
                            <button onClick={() => handleDelete(category.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2 truncate" title={category.name}>{category.name}</h3>

                        <div className="space-y-3 mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 flex items-center"><DollarSign className="h-4 w-4 mr-2" /> Billable Project</span>
                                {category.isBillable ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Yes</span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Non-Billable</span>
                                )}
                            </div>

                            {category.defaultRate !== undefined && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center"><DollarSign className="h-4 w-4 mr-2" /> Rate Override</span>
                                    <span className="font-mono text-slate-700 font-medium">${category.defaultRate}/hr</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 flex items-center"><FileText className="h-4 w-4 mr-2" /> Notes Required</span>
                                {category.isNotesRequired ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-slate-300" />}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 flex items-center"><AlertCircle className="h-4 w-4 mr-2" /> Proof Required</span>
                                {category.isProofRequired ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-slate-300" />}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card (Empty State) */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group h-full min-h-[250px]"
                >
                    <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                        <Plus className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-600 group-hover:text-blue-700">Create New Category</span>
                </button>
            </div>

            {/* Simple Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Add Task Category</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Site Visit"
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-medium text-slate-700">Billable?</span>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={newCategory.isBillable}
                                    onChange={e => setNewCategory({ ...newCategory, isBillable: e.target.checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-medium text-slate-700">Require Notes?</span>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={newCategory.isNotesRequired}
                                    onChange={e => setNewCategory({ ...newCategory, isNotesRequired: e.target.checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-medium text-slate-700">Require Proof?</span>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    checked={newCategory.isProofRequired}
                                    onChange={e => setNewCategory({ ...newCategory, isProofRequired: e.target.checked })}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                            <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Create Category</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskListPage;
