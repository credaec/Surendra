import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    isBillable: boolean;
    status: 'ACTIVE' | 'INACTIVE';
}

const MOCK_CATEGORIES: Category[] = [
    { id: '1', name: 'Engineering', isBillable: true, status: 'ACTIVE' },
    { id: '2', name: 'Drafting', isBillable: true, status: 'ACTIVE' },
    { id: '3', name: 'Meetings', isBillable: true, status: 'ACTIVE' },
    { id: '4', name: 'Rework', isBillable: false, status: 'ACTIVE' },
    { id: '5', name: 'Internal Training', isBillable: false, status: 'INACTIVE' },
];

const CategoriesSetup: React.FC = () => {
    const [categories] = useState<Category[]>(MOCK_CATEGORIES);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Task Categories</h3>
                    <p className="text-sm text-slate-500">Define the types of work employees can select in timesheets.</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Category Name</th>
                            <th className="px-6 py-4">Billable Allowed</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{cat.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${cat.isBillable
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {cat.isBillable ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cat.status === 'ACTIVE'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {cat.status}
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

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                <p><strong>Note:</strong> Employees cannot create categories. Only Admins can manage this list to ensure data consistency.</p>
            </div>
        </div>
    );
};

export default CategoriesSetup;
