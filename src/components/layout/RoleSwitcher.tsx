import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockBackend } from '../../services/mockBackend';
import { ArrowLeftRight, ShieldCheck, UserCircle } from 'lucide-react';

interface RoleSwitcherProps {
    currentMode: 'ADMIN' | 'EMPLOYEE';
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentMode }) => {
    const { user } = useAuth();

    // Prevent rendering if no user (shouldn't happen)
    if (!user) return null;

    // Use the explicitly passed currentMode to determine view state, overriding potentially stale auth user state
    const isAdminView = currentMode === 'ADMIN';

    // SECURITY CHECK: 
    // Only show this switcher if the *REAL* user role in backend is ADMIN.
    // This prevents regular employees (like Naresh) from switching to Admin view even if they are in Employee view.
    const realUser = mockBackend.getUsers().find(u => u.id === user.id);

    // If user not found or is strictly an EMPLOYEE, do not show switcher.
    // NOTE: This assumes 'ADMIN' is the only privileged role.
    if (!realUser || realUser.role !== 'ADMIN') {
        return null; // Render nothing for non-admins
    }

    const handleSwitch = () => {
        // Target role is the opposite of the *current mode* we are viewing
        const targetRole = isAdminView ? 'EMPLOYEE' : 'ADMIN';
        const targetUrl = isAdminView ? '/employee/dashboard' : '/admin/dashboard';

        // Create updated user with target role
        const updatedUser = { ...user, role: targetRole };

        // Persist to local storage so AuthContext picks it up on next load
        localStorage.setItem('credence_user', JSON.stringify(updatedUser));

        // Force reload to apply new context
        window.location.href = targetUrl;
    };

    return (
        <div className="p-4 border-t border-slate-800 bg-slate-950">
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
                {/* Header: Current Status */}
                <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg shrink-0 ${isAdminView
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                        {isAdminView ? <ShieldCheck className="w-5 h-5" /> : <UserCircle className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                            Current Mode
                        </p>
                        <h4 className="text-sm font-bold text-slate-200 truncate leading-tight">
                            {isAdminView ? 'Admin Console' : 'Employee Portal'}
                        </h4>
                    </div>
                </div>

                {/* Switch Button */}
                <button
                    onClick={handleSwitch}
                    className="w-full text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white py-2 px-3 rounded-lg flex items-center justify-center transition-all group border border-slate-700"
                >
                    <ArrowLeftRight className="w-3.5 h-3.5 mr-2 group-hover:rotate-180 transition-transform" />
                    Switch to {isAdminView ? 'Employee View' : 'Admin Console'}
                </button>
            </div>
        </div>
    );
};

export default RoleSwitcher;
