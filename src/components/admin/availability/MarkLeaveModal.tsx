import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Trash2 } from 'lucide-react';
import type { AvailabilityEvent, User } from '../../../types/schema';
import { backendService } from '../../../services/backendService';
import { cn } from '../../../lib/utils';

interface MarkLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    onDelete?: () => void;
    eventToEdit?: AvailabilityEvent | null;
}

const MarkLeaveModal: React.FC<MarkLeaveModalProps> = ({ isOpen, onClose, onSave, onDelete, eventToEdit }) => {
    const [employeeName, setEmployeeName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [type, setType] = useState('LEAVE');
    const [notes, setNotes] = useState('');

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Initialize data
    useEffect(() => {
        if (isOpen) {
            const allUsers = backendService.getUsers();
            setUsers(allUsers);
        }
    }, [isOpen]);

    // Handle click outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    useEffect(() => {
        if (isOpen && eventToEdit) {
            setEmployeeName(eventToEdit.title);
            setStartDate(eventToEdit.startDate);
            setEndDate(eventToEdit.endDate);
            setType(eventToEdit.subType || 'LEAVE');
            setNotes(eventToEdit.notes || '');
        } else if (isOpen && !eventToEdit) {
            setEmployeeName('');
            setStartDate('');
            setEndDate('');
            setType('LEAVE');
            setNotes('');
        }
    }, [isOpen, eventToEdit]);

    if (!isOpen) return null;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEmployeeName(val);

        if (val.length > 0) {
            const matches = users.filter(u =>
                u.name.toLowerCase().includes(val.toLowerCase()) ||
                u.email.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredUsers(matches);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectUser = (user: User) => {
        setEmployeeName(user.name);
        setShowSuggestions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: eventToEdit?.id, // Pass ID if editing
            title: employeeName, // Ideally resourceId would be linked here
            startDate,
            endDate: endDate || startDate,
            type: 'LEAVE',
            subType: type,
            notes
        });
        setShowSuggestions(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900">{eventToEdit ? 'Edit Leave Request' : 'Mark Employee Leave'}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200/50 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div ref={wrapperRef} className="relative">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Employee Name <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10 py-2" // Increased pl and added py
                                placeholder="Search employee..."
                                value={employeeName}
                                onChange={handleNameChange}
                                onFocus={() => {
                                    if (employeeName) setShowSuggestions(true);
                                }}
                            />
                            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /> {/* Centered icon */}
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && filteredUsers.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredUsers.map(user => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 focus:bg-slate-50 transition-colors flex items-center justify-between group"
                                        onClick={() => selectUser(user)}
                                    >
                                        <div>
                                            <div className="font-medium text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.role}</div>
                                        </div>
                                        <div className="text-xs text-slate-400 opacity-0 group-hover:opacity-100">{user.email}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">From Date <span className="text-rose-500">*</span></label>
                            <input
                                type="date"
                                required
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                            <input
                                type="date"
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                        <select
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="LEAVE">Leave (General)</option>
                            <option value="SICK">Sick Leave</option>
                            <option value="WFH">Work From Home</option>
                            <option value="TRAINING">Training</option>
                            <option value="SITE_VISIT">Site Visit</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                        <textarea
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                            placeholder="Reason for leave..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className={cn("flex items-center pt-2", eventToEdit ? "justify-between" : "justify-end")}>
                        {eventToEdit && onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="flex items-center px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </button>
                        )}
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                            >
                                {eventToEdit ? 'Update Leave' : 'Save Leave'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MarkLeaveModal;

