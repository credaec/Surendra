import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, User as UserIcon, Briefcase } from 'lucide-react';

import { mockBackend, type User } from '../../../services/mockBackend';

const UserManagement: React.FC = () => {
    // Fetch initial users from backend
    const [users, setUsers] = useState<User[]>(mockBackend.getUsers());

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700"><Shield className="w-3 h-3 mr-1" /> Admin</span>;
            case 'PROJECT_MANAGER':
                return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700"><Briefcase className="w-3 h-3 mr-1" /> Manager</span>;
            default:
                return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"><UserIcon className="w-3 h-3 mr-1" /> Employee</span>;
        }
    };


    const handleAddUser = () => {
        // In a real app, this would open a modal form.
        // For this demo, we adding a mock user to prove backend connection.
        const newUser = mockBackend.addUser({
            name: `New User ${Math.floor(Math.random() * 1000)}`,
            email: `user${Date.now()}@credaec.in`,
            role: 'EMPLOYEE',
            department: 'ENGINEERING',
            designation: 'TRAINEE'
        });
        setUsers([...users, newUser]);
        alert('New user added to persistent storage!');
    };

    return (
        <div className="space-y-6">

            {/* Header / Add User */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
                    <p className="text-sm text-slate-500">Manage access and permissions for your team.</p>
                </div>
                <button
                    onClick={handleAddUser}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {getRoleBadge(user.role)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button className="p-1 text-slate-400 hover:text-blue-600 rounded">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button className="p-1 text-slate-400 hover:text-rose-600 rounded">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Role Permissions Matrix (Visual Only for now) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Role Permissions</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <div>
                            <span className="font-medium text-slate-900">Allow Admin to Switch to Employee View</span>
                            <p className="text-xs text-slate-500">Admins can toggle between Admin Portal and Employee Dashboard.</p>
                        </div>
                        {/* This would be bound to security settings, checking visual only here */}
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 cursor-pointer">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserManagement;
