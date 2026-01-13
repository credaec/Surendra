import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/layout/EmployeeSidebar';
import Header from '../components/layout/Header'; // Reusing Header for now, or simplify if needed

const EmployeeLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-surface">
            {/* Sidebar */}
            <EmployeeSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-surface">
                <Header /> {/* Reused Header */}

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default EmployeeLayout;
