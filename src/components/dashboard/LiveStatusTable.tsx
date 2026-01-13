import React from 'react';
import { cn } from '../../lib/utils';

// Mock Data
const employees = [
    { id: 1, name: 'Alice Johnson', project: 'Skyline Main', task: 'Frame Analysis', status: 'RUNNING', time: '02:14' },
    { id: 2, name: 'Bob Smith', project: 'Riverside Mall', task: 'Client Meeting', status: 'PAUSED', time: '00:45' },
    { id: 3, name: 'Charlie Davis', project: '-', task: '-', status: 'OFFLINE', time: '-' },
    { id: 4, name: 'Diana Prince', project: 'Skyline Main', task: 'Drafting', status: 'RUNNING', time: '04:20' },
    { id: 5, name: 'Ethan Hunt', project: 'Office Retrofit', task: 'Site Visit', status: 'RUNNING', time: '01:10' },
];

const LiveStatusTable: React.FC = () => {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Live Team Status</h3>
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Employee</th>
                            <th className="px-4 py-3">Current Tracking</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{emp.name}</td>
                                <td className="px-4 py-3 text-slate-500">
                                    {emp.status !== 'OFFLINE' ? (
                                        <div>
                                            <div className="text-slate-900 font-medium">{emp.project}</div>
                                            <div className="text-xs text-slate-400">{emp.task}</div>
                                        </div>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        <span className={cn("px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide",
                                            emp.status === 'RUNNING' ? "bg-emerald-100 text-emerald-700" :
                                                emp.status === 'PAUSED' ? "bg-amber-100 text-amber-700" :
                                                    "bg-slate-100 text-slate-400"
                                        )}>
                                            {emp.status}
                                        </span>
                                        {emp.status === 'RUNNING' && (
                                            <span className="text-xs font-mono font-medium text-slate-600">{emp.time}</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveStatusTable;
