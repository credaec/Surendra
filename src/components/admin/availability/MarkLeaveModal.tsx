import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface MarkLeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const MarkLeaveModal: React.FC<MarkLeaveModalProps> = ({ isOpen, onClose, onSave }) => {
    const [employeeName, setEmployeeName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [type, setType] = useState('LEAVE');
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title: employeeName, // Ideally resourceId would be linked here
            startDate,
            endDate: endDate || startDate,
            type: 'LEAVE',
            subType: type,
            notes
        });
        setEmployeeName('');
        setStartDate('');
        setEndDate('');
        setNotes('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900">Mark Employee Leave</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200/50 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Employee Name <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-9"
                                placeholder="Search employee..."
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                            />
                            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
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

                    <div className="flex justify-end space-x-3 pt-2">
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
                            Save Leave
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MarkLeaveModal;
