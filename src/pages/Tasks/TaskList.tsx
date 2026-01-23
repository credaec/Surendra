import React, { useState, useEffect } from 'react';
import { Plus, Search, Check, X, Tag, DollarSign, FileText, Trash2, MoreVertical, UserPlus, Users, ChevronDown, Edit } from 'lucide-react';
import { mockBackend } from '../../services/mockBackend';
import type { User } from '../../services/mockBackend';
import type { TaskCategory } from '../../types/schema';

const TaskListPage: React.FC = () => {
    const [categories, setCategories] = useState<TaskCategory[]>(mockBackend.getTaskCategories());
    const [users, setUsers] = useState<User[]>([]); // State for users
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Load users on mount
    useEffect(() => {
        setUsers(mockBackend.getUsers());
    }, []);

    // ... (existing state) ...



    // Menu & Assignment State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // Add/Edit Form State
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCategory, setNewCategory] = useState<Partial<TaskCategory>>({
        name: '',
        isBillable: true,
        isNotesRequired: false
    });

    const handleOpenAddModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        setNewCategory({ name: '', isBillable: true, isNotesRequired: false });
        setShowAddModal(true);
    };

    const handleOpenEditModal = (category: TaskCategory, e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditMode(true);
        setEditingId(category.id);
        setNewCategory({ ...category });
        setShowAddModal(true);
        setActiveMenuId(null);
    };

    const handleAddOrUpdateCategory = () => {
        if (!newCategory.name) return;

        if (isEditMode && editingId) {
            // Update
            mockBackend.updateTaskCategory({
                ...newCategory,
                id: editingId
            } as TaskCategory);
            alert(`Category "${newCategory.name}" updated successfully.`);
        } else {
            // Add
            mockBackend.addTaskCategory({
                name: newCategory.name,
                isBillable: newCategory.isBillable || false,
                isNotesRequired: newCategory.isNotesRequired || false,
                defaultRate: newCategory.defaultRate,
                restrictedToProjects: []
            } as any);
        }

        // Refresh and Close
        setCategories(mockBackend.getTaskCategories());
        setShowAddModal(false);
        setNewCategory({ name: '', isBillable: true, isNotesRequired: false });
        setIsEditMode(false);
        setEditingId(null);
    };

    const handleOpenAssignModal = (category: TaskCategory, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCategory(category);
        setAssignModalOpen(true);
        setActiveMenuId(null);
    };

    const handleAssignTask = () => {
        if (!selectedCategory || !selectedEmployeeId) return;

        // Backend Call
        try {
            mockBackend.assignCategoryToUser(selectedCategory.id, selectedEmployeeId);

            // Show Success
            alert(`Successfully assigned "${selectedCategory.name}" to employee.`);
            setAssignModalOpen(false);
            setSelectedEmployeeId('');
            setSelectedCategory(null);
        } catch (error) {
            console.error(error);
            alert('Failed to assign task. Please try again.');
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete the category "${name}"? This will remove it for all future time entries.`)) {
            mockBackend.deleteTaskCategory(id);
            setCategories(mockBackend.getTaskCategories()); // Refresh
        }
    };

    // ... (rest of the file until the menu)

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Task Categories</h1>
                    <p className="text-slate-500 mt-1">Manage the types of work your team tracks time against.</p>
                </div>

                <button
                    onClick={handleOpenAddModal}
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

                            {/* Menu Button */}
                            <div className="relative">
                                <button
                                    onClick={(e) => toggleMenu(category.id, e)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>

                                {/* Dropdown Menu */}
                                {activeMenuId === category.id && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                                        <button
                                            onClick={(e) => handleOpenAssignModal(category, e)}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Assign to Employee
                                        </button>
                                        <button
                                            onClick={(e) => handleOpenEditModal(category, e)}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Category
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(category.id, category.name);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center border-t border-slate-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Category
                                        </button>
                                    </div>
                                )}
                            </div>
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


                        </div>
                    </div>
                ))}

                {/* Add New Card (Empty State) */}
                <button
                    onClick={handleOpenAddModal}
                    className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group h-full min-h-[250px]"
                >
                    <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                        <Plus className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-600 group-hover:text-blue-700">Create New Category</span>
                </button>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">{isEditMode ? 'Edit Task Category' : 'Add Task Category'}</h2>

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
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                            <button onClick={handleAddOrUpdateCategory} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                                {isEditMode ? 'Update Category' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Assign Task Modal */}
            {assignModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Assign Task
                            </h3>
                            <button
                                onClick={() => setAssignModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Assign <strong>{selectedCategory?.name}</strong> to:
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                                        className="w-full flex items-center justify-between rounded-xl border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 py-3 pl-4 pr-3 text-sm font-medium text-slate-700 transition-all border shadow-sm outline-none"
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            {selectedEmployeeId ? (
                                                (() => {
                                                    const selectedUser = users.find(u => u.id === selectedEmployeeId);
                                                    if (selectedUser) {
                                                        return (
                                                            <>
                                                                <div className="h-6 w-6 min-w-[1.5rem] rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold ring-1 ring-indigo-50">
                                                                    {selectedUser.avatarInitials}
                                                                </div>
                                                                <span className="truncate">{selectedUser.name}</span>
                                                                <span className="text-slate-400 font-normal truncate hidden sm:inline">({selectedUser.designation})</span>
                                                            </>
                                                        );
                                                    }
                                                    // Fallback for dummy users
                                                    const dummyName = {
                                                        'emp1': 'Sarah Johnson',
                                                        'emp2': 'Mike Chen',
                                                        'emp3': 'Emma Wilson'
                                                    }[selectedEmployeeId];
                                                    if (dummyName) return dummyName;
                                                    return "Select Employee";
                                                })()
                                            ) : <span className="text-slate-500">Select Employee...</span>}
                                        </span>
                                        <ChevronDown className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isAssignDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isAssignDropdownOpen && (
                                        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl max-h-72 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
                                            {/* Suggested Group */}
                                            <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 z-10">
                                                Suggested (Demo Users)
                                            </div>
                                            {[
                                                { id: 'CRED004/08-22', name: 'Naresh Prajapati', role: 'Default Employee', initials: 'NP' },
                                                { id: 'CRED001/06-22', name: 'Dhiraj Vasu', role: 'Default Admin', initials: 'DV' },
                                            ].map(dummy => (
                                                <button
                                                    key={dummy.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedEmployeeId(dummy.id);
                                                        setIsAssignDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="h-9 w-9 min-w-[2.25rem] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shadow-sm">
                                                            {dummy.initials}
                                                        </div>
                                                        <div className="text-left overflow-hidden">
                                                            <div className="font-semibold text-slate-900 truncate">{dummy.name}</div>
                                                            <div className="text-xs text-slate-500 font-medium truncate">{dummy.role}</div>
                                                        </div>
                                                    </div>
                                                    {selectedEmployeeId === dummy.id && <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />}

                                                </button>
                                            ))}

                                            {/* Employees Group */}
                                            <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-y border-slate-100 mt-1">
                                                Employees
                                            </div>
                                            {users.filter(u => u.role === 'EMPLOYEE').map(user => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedEmployeeId(user.id);
                                                        setIsAssignDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="h-9 w-9 min-w-[2.25rem] rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shadow-sm">
                                                            {user.avatarInitials}
                                                        </div>
                                                        <div className="text-left overflow-hidden">
                                                            <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                                                            <div className="text-xs text-slate-500 font-medium truncate">{user.designation}</div>
                                                        </div>
                                                    </div>
                                                    {selectedEmployeeId === user.id && <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />}
                                                </button>
                                            ))}

                                            {/* Admins Group */}
                                            <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-y border-slate-100 mt-1">
                                                Admins
                                            </div>
                                            {users.filter(u => u.role === 'ADMIN').map(user => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedEmployeeId(user.id);
                                                        setIsAssignDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="h-9 w-9 min-w-[2.25rem] rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shadow-sm">
                                                            {user.avatarInitials}
                                                        </div>
                                                        <div className="text-left overflow-hidden">
                                                            <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                                                            <div className="text-xs text-slate-500 font-medium truncate">{user.designation}</div>
                                                        </div>
                                                    </div>
                                                    {selectedEmployeeId === user.id && <Check className="h-5 w-5 text-purple-500 flex-shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                This will allow the selected employee to log time against this category.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 p-6 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={() => setAssignModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignTask}
                                disabled={!selectedEmployeeId}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <UserPlus className="h-4 w-4" />
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskListPage;
