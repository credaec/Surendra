import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/layout/EmployeeSidebar';
import Header from '../components/layout/Header';

const EmployeeLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 relative z-50 hidden md:block">
                <EmployeeSidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-0 h-full overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth no-scrollbar">
                    <div className="max-w-[1920px] mx-auto w-full h-full pb-20">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EmployeeLayout;
