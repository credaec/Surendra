import React, { useState, useEffect } from 'react';
import SettingsSidebar, { type SettingsSection } from '../../../components/admin/settings/SettingsSidebar';
import { Save, RotateCcw, History } from 'lucide-react';
import { settingsService, type AppSettings } from '../../../services/settingsService';

// Imported components
import CompanySetup from '../../../components/admin/settings/CompanySetup';
import UserManagement from '../../../components/admin/settings/UserManagement';
import ProjectClientSettings from '../../../components/admin/settings/ProjectClientSettings';
import TimesheetRules from '../../../components/admin/settings/TimesheetRules';
import BillingSettings from '../../../components/admin/settings/BillingSettings';
import PayrollSettings from '../../../components/admin/settings/PayrollSettings';
import CategoriesSetup from '../../../components/admin/settings/CategoriesSetup';
import NotificationSettings from '../../../components/admin/settings/NotificationSettings';
import SecuritySettings from '../../../components/admin/settings/SecuritySettings';
import AuditLogsSettings from '../../../components/admin/settings/AuditLogsSettings';
import IntegrationsSettings from '../../../components/admin/settings/IntegrationsSettings';

const SettingsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SettingsSection>('COMPANY');
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Load settings
        const loaded = settingsService.getSettings();
        setSettings(loaded);
    }, []);

    const handleSave = () => {
        if (settings) {
            settingsService.updateSettings(settings);
        }
        alert('Settings saved successfully!');
        setHasChanges(false);
    };

    const handleUpdateSection = <K extends keyof AppSettings>(section: K, data: Partial<AppSettings[K]>) => {
        if (!settings) return;
        setSettings(prev => prev ? {
            ...prev,
            [section]: { ...prev[section], ...data }
        } : null);
        setHasChanges(true);
    };

    const renderContent = () => {
        if (!settings) return <div>Loading...</div>;

        switch (activeSection) {
            case 'COMPANY':
                return <CompanySetup data={settings.company} onChange={(d) => handleUpdateSection('company', d)} />;
            case 'USERS':
                return <UserManagement />;
            case 'PROJECTS':
                return <ProjectClientSettings />;
            case 'TIMESHEETS':
                return <TimesheetRules data={settings.timesheet} onChange={(d) => handleUpdateSection('timesheet', d)} />;
            case 'BILLING':
                return <BillingSettings data={settings.billing} onChange={(d) => handleUpdateSection('billing', d)} />;
            case 'PAYROLL':
                return <PayrollSettings data={settings.payroll} onChange={(d) => handleUpdateSection('payroll', d)} />;
            case 'CATEGORIES':
                return <CategoriesSetup />;
            case 'NOTIFICATIONS':
                return <NotificationSettings data={settings.notifications} onChange={(d) => handleUpdateSection('notifications', d)} />;
            case 'SECURITY':
                return <SecuritySettings data={settings.security} onChange={(d) => handleUpdateSection('security', d)} />;
            case 'DATA':
                return <AuditLogsSettings />;
            case 'INTEGRATIONS':
                return <IntegrationsSettings />;
            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                        <span>Admin</span>
                        <span className="mx-2">/</span>
                        <span className="text-blue-600 font-medium">System Configuration</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                        <History className="h-4 w-4 mr-2" />
                        Audit History
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={`flex items-center px-5 py-2 rounded-lg shadow-md transition-all text-sm font-medium ${hasChanges
                                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                            }`}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar */}
                <SettingsSidebar activeSection={activeSection} onSelectSection={setActiveSection} />

                {/* Right Content */}
                <div className="flex-1 min-w-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
