import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Shield, User as UserIcon } from 'lucide-react';
import { backendService, type User } from '../../services/backendService';
import AddEmployeeModal from '../../components/admin/team/AddEmployeeModal';

const TeamPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'EMPLOYEE'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const refreshUsers = () => {
        setUsers(backendService.getUsers());
        setActiveMenuId(null);
    };

    useEffect(() => {
        refreshUsers();
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to remove this employee?')) {
            backendService.deleteUser(userId);
            refreshUsers();
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const toggleSelectAll = () => {
        if (selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0) {
            setSelectedUserIds(new Set());
        } else {
            setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
        }
    };

    const toggleSelectUser = (id: string) => {
        const newSelected = new Set(selectedUserIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedUserIds(newSelected);
    };

    const getRoleBadge = (role: string) => {
        if (role === 'ADMIN') {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
                    <Shield className="h-3 w-3 mr-1" />
                    ADMIN
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage employees, roles, and access permissions</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 dark:bg-primary text-white dark:text-on-primary text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:opacity-90 transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-elevated rounded-t-xl border border-slate-200 dark:border-border border-b-0 p-4 flex items-center justify-between relative z-10 shadow-sm">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-muted border border-slate-200 dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-primary dark:text-text-primary dark:placeholder-text-muted"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${filterRole !== 'ALL' ? 'bg-blue-50 dark:bg-primary/20 border-blue-200 dark:border-primary/50 text-blue-700 dark:text-primary' : 'bg-white dark:bg-muted border-slate-200 dark:border-border text-slate-600 dark:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <Filter className={`h-4 w-4 mr-2 ${filterRole !== 'ALL' ? 'text-blue-500 dark:text-primary' : 'text-slate-400 dark:text-slate-500'}`} />
                        Filter
                        {filterRole !== 'ALL' && <span className="ml-2 bg-blue-200 dark:bg-primary/30 text-blue-800 dark:text-primary text-[10px] px-1.5 py-0.5 rounded-full">{filterRole}</span>}
                    </button>

                    {isFilterOpen && (
                        <>
                            <div className="fixed inset-0 z-0" onClick={() => setIsFilterOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-elevated rounded-lg shadow-lg border border-slate-100 dark:border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-3 py-2 border-b border-slate-50 dark:border-border text-xs font-semibold text-slate-500 dark:text-text-muted uppercase">
                                    Role
                                </div>
                                <button
                                    onClick={() => { setFilterRole('ALL'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${filterRole === 'ALL' ? 'text-blue-600 dark:text-primary font-medium bg-blue-50/50 dark:bg-primary/10' : 'text-slate-700 dark:text-text-primary'}`}
                                >
                                    All Roles
                                </button>
                                <button
                                    onClick={() => { setFilterRole('ADMIN'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${filterRole === 'ADMIN' ? 'text-blue-600 dark:text-primary font-medium bg-blue-50/50 dark:bg-primary/10' : 'text-slate-700 dark:text-text-primary'}`}
                                >
                                    Admin
                                </button>
                                <button
                                    onClick={() => { setFilterRole('EMPLOYEE'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${filterRole === 'EMPLOYEE' ? 'text-blue-600 dark:text-primary font-medium bg-blue-50/50 dark:bg-primary/10' : 'text-slate-700 dark:text-text-primary'}`}
                                >
                                    Employee
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface border border-slate-200 dark:border-border rounded-b-xl overflow-visible shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-elevated text-slate-500 dark:text-text-muted font-medium border-b border-slate-200 dark:border-border">
                        <tr>
                            <th className="px-6 py-4 w-16">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 dark:border-border text-blue-600 dark:text-primary focus:ring-blue-500 dark:focus:ring-primary bg-white dark:bg-muted"
                                    checked={selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Designation</th>
                            <th className="px-6 py-4">Hourly Rate</th>
                            <th className="px-6 py-4">Role / Access</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-border/50">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 dark:border-border text-blue-600 dark:text-primary focus:ring-blue-500 dark:focus:ring-primary bg-white dark:bg-muted"
                                        checked={selectedUserIds.has(user.id)}
                                        onChange={() => toggleSelectUser(user.id)}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center text-slate-600 dark:text-text-secondary font-bold border border-slate-200 dark:border-border">
                                            {user.avatarInitials}
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                                            <div className="text-slate-500 dark:text-text-muted text-xs mt-0.5 flex items-center">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-text-secondary font-medium">
                                    {user.designation}
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-text-secondary font-medium">
                                    ${user.hourlyCostRate ? Number(user.hourlyCostRate).toFixed(2) : '0.00'}/hr
                                </td>
                                <td className="px-6 py-4">
                                    {getRoleBadge(user.role)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === user.id ? null : user.id);
                                        }}
                                        className="p-2 text-slate-400 dark:text-text-muted hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>

                                    {activeMenuId === user.id && (
                                        <div className="absolute right-8 top-8 w-48 bg-white dark:bg-elevated rounded-lg shadow-lg border border-slate-100 dark:border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setIsAddModalOpen(true);
                                                    setActiveMenuId(null);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
                                            >
                                                Edit Employee
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-red-400 hover:bg-rose-50 dark:hover:bg-red-900/20 flex items-center"
                                            >
                                                Delete Employee
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddEmployeeModal
                isOpen={isAddModalOpen}
                onClose={() => { setIsAddModalOpen(false); setEditingUser(null); }}
                onSuccess={refreshUsers}
                userToEdit={editingUser}
            />

        </div>
    );
};

export default TeamPage;
