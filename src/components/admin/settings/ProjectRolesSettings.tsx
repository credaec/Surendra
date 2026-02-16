import React, { useState, useEffect } from 'react';
import { backendService } from '../../../services/backendService';
import { Plus, Trash2, Shield, AlertCircle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const ProjectRolesSettings: React.FC = () => {
    const { showToast } = useToast();
    const [roles, setRoles] = useState<string[]>([]);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = () => {
        setRoles(backendService.getProjectRoles());
    };

    const handleAddRole = async () => {
        if (!newRole.trim()) return;
        if (roles.includes(newRole.trim())) {
            showToast('Role already exists', 'error');
            return;
        }
        const updated = await backendService.addProjectRole(newRole.trim());
        setRoles(updated);
        setNewRole('');
        showToast('Role added successfully', 'success');
    };

    const handleDeleteRole = async (role: string) => {
        if (confirm(`Are you sure you want to delete the role "${role}"?`)) {
            const updated = await backendService.deleteProjectRole(role);
            setRoles(updated);
            showToast('Role deleted', 'info');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Project Roles</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Define the roles that can be assigned to team members on projects.
                    </p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="Enter new role name (e.g. Senior Architect)..."
                        className="flex-1 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                    />
                    <button
                        onClick={handleAddRole}
                        disabled={!newRole.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Role
                    </button>
                </div>

                <div className="space-y-3">
                    {roles.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No roles defined. Add one above.</p>
                        </div>
                    ) : (
                        roles.map((role) => (
                            <div key={role} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg group hover:shadow-sm transition-all">
                                <span className="font-medium text-slate-700 dark:text-slate-200">{role}</span>
                                <button
                                    onClick={() => handleDeleteRole(role)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Role"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectRolesSettings;
