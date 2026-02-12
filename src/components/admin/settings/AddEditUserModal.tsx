import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail } from 'lucide-react';
import type { User } from '../../../services/backendService';

interface AddEditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: any) => void;
    userToEdit?: User | null;
}

const AddEditUserModal: React.FC<AddEditUserModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

    useEffect(() => {
        if (isOpen && userToEdit) {
            setName(userToEdit.name);
            setEmail(userToEdit.email);
            setRole(userToEdit.role);
            setDepartment(userToEdit.department);
            setDesignation(userToEdit.designation);
            setStatus(userToEdit.status);
        } else if (isOpen && !userToEdit) {
            setName('');
            setEmail('');
            setRole('EMPLOYEE');
            setDepartment('');
            setDesignation('');
            setStatus('ACTIVE');
        }
    }, [isOpen, userToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: userToEdit?.id,
            name,
            email,
            role,
            department,
            designation,
            status,
            avatarInitials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{userToEdit ? 'Edit User' : 'Add New User'}</h3>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">User profile details</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Full Name</label>
                        <div className="relative group">
                            <input
                                type="text"
                                required
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-11 pl-11"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <UserIcon className="h-4 w-4 text-slate-400 dark:text-slate-600 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</label>
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-11 pl-11"
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="h-4 w-4 text-slate-400 dark:text-slate-600 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Role</label>
                            <select
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-11 px-4"
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</label>
                            <select
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-11 px-4"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Department</label>
                            <select
                                required
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-11 px-4"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option value="">Select Dept</option>
                                <option value="STRUCTURAL DIVISION">Structural</option>
                                <option value="MANAGEMENT">Management</option>
                                <option value="ENGINEERING">Engineering</option>
                                <option value="HR">HR</option>
                                <option value="SALES">Sales</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Designation</label>
                            <input
                                type="text"
                                required
                                className="w-full text-sm border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium h-11 px-4"
                                placeholder="e.g. Engineer"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                        >
                            {userToEdit ? 'Update User' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditUserModal;

