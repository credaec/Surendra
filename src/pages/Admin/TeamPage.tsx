import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Shield, User as UserIcon } from 'lucide-react';
import { mockBackend, type User } from '../../services/mockBackend';
import AddEmployeeModal from '../../components/admin/team/AddEmployeeModal';

const TeamPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const refreshUsers = () => {
        setUsers(mockBackend.getUsers());
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    const getRoleBadge = (role: string) => {
        if (role === 'ADMIN') {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                    <Shield className="h-3 w-3 mr-1" />
                    ADMIN
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <UserIcon className="h-3 w-3 mr-1" />
                EMPLOYEE
            </span>
        );
    };

    return (
        <div className="max-w-[1600px] mx-auto p-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage employees, roles, and access permissions</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 p-4 flex items-center justify-between">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 w-16">
                                <div className="h-4 w-4 rounded border border-slate-300 bg-white"></div>
                            </th>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Designation</th>
                            <th className="px-6 py-4">Role / Access</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="h-4 w-4 rounded border border-slate-300 bg-white"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                            {user.avatarInitials}
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold text-slate-900">{user.name}</div>
                                            <div className="text-slate-500 text-xs mt-0.5 flex items-center">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">
                                    {user.designation}
                                </td>
                                <td className="px-6 py-4">
                                    {getRoleBadge(user.role)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddEmployeeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={refreshUsers}
            />

        </div>
    );
};

export default TeamPage;
