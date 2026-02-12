import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, User as UserIcon, Briefcase } from 'lucide-react';
import { backendService, type User } from '../../../services/backendService';
import { settingsService } from '../../../services/settingsService';
import AddEditUserModal from './AddEditUserModal';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../lib/utils';

const UserManagement: React.FC = () => {
    const { showToast } = useToast();
    // Fetch initial users from backend
    const [users, setUsers] = useState<User[]>(backendService.getUsers());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Role Permission State
    const [allowAdminSwitch, setAllowAdminSwitch] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await settingsService.getSettings();
                if (settings?.security) {
                    setAllowAdminSwitch(settings.security.allowAdminRoleSwitch);
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        };
        loadSettings();
    }, []);

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 shadow-sm"><Shield className="w-3 h-3 mr-2" /> Admin</span>;
            case 'PROJECT_MANAGER':
                return <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm"><Briefcase className="w-3 h-3 mr-2" /> Manager</span>;
            default:
                return <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm"><UserIcon className="w-3 h-3 mr-2" /> Employee</span>;
        }
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await backendService.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            showToast('User deleted successfully', 'info');
        }
    };

    const handleSaveUser = async (userData: any) => {
        if (userData.id) {
            const updated = await backendService.updateUser(userData);
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
            showToast('User updated successfully', 'success');
        } else {
            const newUser = await backendService.addUser(userData);
            setUsers(prev => [...prev, newUser]);
            showToast('User added successfully', 'success');
        }
        setIsModalOpen(false);
    };

    const handleToggleAdminSwitch = () => {
        const newValue = !allowAdminSwitch;
        setAllowAdminSwitch(newValue);
        settingsService.updateSection('security', { allowAdminRoleSwitch: newValue });
        showToast(`Admin Switch ${newValue ? 'Enabled' : 'Disabled'}`, 'success');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header / Add User */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h3>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 mt-2 uppercase tracking-widest">Manage access and permissions for your team.</p>
                </div>
                <button
                    onClick={handleAddUser}
                    className="flex items-center px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 shadow-xl shadow-blue-600/20 transition-all text-xs font-black uppercase tracking-widest active:scale-95"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-300 p-2">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-8 py-6 uppercase tracking-widest text-[10px] font-black pl-10">Name</th>
                            <th className="px-8 py-6 uppercase tracking-widest text-[10px] font-black">Role</th>
                            <th className="px-8 py-6 uppercase tracking-widest text-[10px] font-black">Status</th>
                            <th className="px-8 py-6 uppercase tracking-widest text-[10px] font-black text-right pr-10">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {users.map((user) => (
                            <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-200">
                                <td className="px-8 py-6 pl-10">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-black mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1 opacity-70">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    {getRoleBadge(user.role)}
                                </td>
                                <td className="px-8 py-6">
                                    <span className={cn(
                                        "inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                        user.status === 'ACTIVE'
                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                                    )}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right pr-10">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Role Permissions Matrix */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm transition-all duration-300">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Security Permissions</h3>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-1">Role capabilities</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-6 px-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors">
                        <div>
                            <span className="font-black text-slate-900 dark:text-white block mb-1">Allow Admin to Switch Views</span>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Admins can toggle between Portal and Dashboard interfaces.</p>
                        </div>
                        <button
                            onClick={handleToggleAdminSwitch}
                            className={cn(
                                "relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                                allowAdminSwitch ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-800"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300",
                                allowAdminSwitch ? "translate-x-7" : "translate-x-1"
                            )} />
                        </button>
                    </div>
                </div>
            </div>

            <AddEditUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                userToEdit={editingUser}
            />

        </div>
    );
};

export default UserManagement;
