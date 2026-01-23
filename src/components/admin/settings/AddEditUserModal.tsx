import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail } from 'lucide-react';
import type { User } from '../../../services/mockBackend';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900">{userToEdit ? 'Edit User' : 'Add New User'}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200/50 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-9"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <UserIcon className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-9"
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <select
                                required
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                            <input
                                type="text"
                                required
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. Engineer"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
