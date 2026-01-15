import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddHolidayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const AddHolidayModal: React.FC<AddHolidayModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('NATIONAL');
    const [repeat, setRepeat] = useState(false);
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title: name,
            startDate: date,
            endDate: date,
            type: 'HOLIDAY',
            subType: type,
            notes: notes
        });
        // Reset and close
        setName('');
        setDate('');
        setNotes('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900">Add New Holiday</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200/50 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Holiday Name <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            required
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Republic Day"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date <span className="text-rose-500">*</span></label>
                            <input
                                type="date"
                                required
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select
                                className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="NATIONAL">National Holiday</option>
                                <option value="COMPANY">Company Holiday</option>
                                <option value="OPTIONAL">Optional/Regional</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="repeat"
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            checked={repeat}
                            onChange={(e) => setRepeat(e.target.checked)}
                        />
                        <label htmlFor="repeat" className="text-sm text-slate-600">Repeat Annually</label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                        <textarea
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                            placeholder="Additional details..."
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
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Save Holiday
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHolidayModal;
