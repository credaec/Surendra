import React, { useState } from 'react';
import { X, User, Mail, Briefcase, Shield } from 'lucide-react';
import { mockBackend } from '../../../services/mockBackend';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        designation: '',
        role: 'EMPLOYEE' as 'ADMIN' | 'EMPLOYEE'
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mockBackend.addUser({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            designation: formData.designation,
            role: formData.role
        } as any);

        onSuccess();
        onClose();
        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            designation: '',
            role: 'EMPLOYEE'
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Add New Team Member</h2>
                        <p className="text-sm text-slate-500">Create account and assign role</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">First Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">Last Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="email"
                                required
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="john.doe@company.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Designation */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-700">Designation</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="e.g. Senior Developer"
                                value={formData.designation}
                                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-medium text-slate-700 block mb-2">Access Role</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`
                                relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${formData.role === 'EMPLOYEE'
                                    ? 'border-blue-500 bg-blue-50/50'
                                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}
                            `}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="EMPLOYEE"
                                    checked={formData.role === 'EMPLOYEE'}
                                    onChange={() => setFormData({ ...formData, role: 'EMPLOYEE' })}
                                    className="absolute opacity-0"
                                />
                                <User className={`h-6 w-6 mb-2 ${formData.role === 'EMPLOYEE' ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span className={`text-sm font-semibold ${formData.role === 'EMPLOYEE' ? 'text-blue-700' : 'text-slate-600'}`}>Employee</span>
                                <span className="text-[10px] text-slate-400 mt-1">Standard Access</span>
                            </label>

                            <label className={`
                                relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${formData.role === 'ADMIN'
                                    ? 'border-purple-500 bg-purple-50/50'
                                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}
                            `}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="ADMIN"
                                    checked={formData.role === 'ADMIN'}
                                    onChange={() => setFormData({ ...formData, role: 'ADMIN' })}
                                    className="absolute opacity-0"
                                />
                                <Shield className={`h-6 w-6 mb-2 ${formData.role === 'ADMIN' ? 'text-purple-600' : 'text-slate-400'}`} />
                                <span className={`text-sm font-semibold ${formData.role === 'ADMIN' ? 'text-purple-700' : 'text-slate-600'}`}>Admin</span>
                                <span className="text-[10px] text-slate-400 mt-1">Full Control</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                        >
                            Create Account
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
