import React from 'react';
import { ArrowRight } from 'lucide-react';

const QuickStartCard: React.FC = () => {
    const recents = [
        { id: 1, project: 'BCS Skylights', task: 'Engineering' },
        { id: 2, project: 'Dr. Wade Residence', task: 'Drafting' },
        { id: 3, project: 'Internal', task: 'Meeting' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Last Used</h3>
            <div className="space-y-2">
                {recents.map(item => (
                    <button key={item.id} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group text-left">
                        <div>
                            <div className="font-medium text-slate-900 text-sm group-hover:text-blue-700">{item.project}</div>
                            <div className="text-xs text-slate-500">{item.task}</div>
                        </div>
                        <div className="h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-3 w-3 text-blue-600" />
                        </div>
                    </button>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors">
                View All Projects
            </button>
        </div>
    );
};

export default QuickStartCard;
