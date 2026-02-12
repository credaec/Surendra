import React, { useState, useEffect } from 'react';
import SettingsSidebar, { type SettingsSection } from '../../../components/admin/settings/SettingsSidebar';
import { Save, RotateCcw, History, Settings, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { settingsService, type AppSettings } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';

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
import BackupSettings from '../../../components/admin/settings/BackupSettings';
import AuditLogsSettings from '../../../components/admin/settings/AuditLogsSettings';
import IntegrationsSettings from '../../../components/admin/settings/IntegrationsSettings';
import EmailSettings from '../../../components/admin/settings/EmailSettings';

const SettingsPage: React.FC = () => {
    const { showToast } = useToast();
    const [activeSection, setActiveSection] = useState<SettingsSection>('COMPANY');
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const loaded = await settingsService.getSettings();
            setSettings(loaded);
            setHasChanges(false);
        } catch (error) {
            showToast('Failed to load settings from database', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSave = async () => {
        if (settings) {
            setIsSaving(true);
            try {
                await settingsService.updateSettings(settings);
                showToast('Settings successfully synchronized to database', 'success');
                setHasChanges(false);
            } catch (error) {
                showToast('Persistence failed', 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to discard your changes and reload from the database?')) {
            loadSettings();
            showToast('Changes discarded', 'info');
        }
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
        if (isLoading) return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Retrieving Global Configuration...</p>
            </div>
        );

        if (!settings) return <div className="p-12 text-slate-500 font-medium tracking-tight">Configuration unavailable.</div>;

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
            case 'EMAIL':
                return <EmailSettings data={settings.email} onChange={(d) => handleUpdateSection('email', d)} />;
            case 'SECURITY':
                return <SecuritySettings data={settings.security} onChange={(d) => handleUpdateSection('security', d)} />;
            case 'DATA':
                return <AuditLogsSettings />;
            case 'INTEGRATIONS':
                return <IntegrationsSettings />;
            case 'BACKUP':
                return <BackupSettings />;
            default: return null;
        }
    };

    return (
        <div className="w-full px-6 lg:px-8 py-8 min-h-screen bg-slate-50 dark:bg-slate-950/20 animate-in fade-in duration-700">
            {/* Full Width Clean Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight font-sans tracking-tight">System Settings</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Production Node: Live Database Mode</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reload Live
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={cn(
                            "flex items-center px-8 py-2.5 text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95",
                            hasChanges
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                        )}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        {isSaving ? 'Syncing...' : 'Save to DB'}
                    </button>
                </div>
            </div>

            {/* Layout - Stretching to full width */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar - Fixed Width at Large Screens */}
                <div className="lg:w-72 xl:w-80 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
                        <SettingsSidebar activeSection={activeSection} onSelectSection={setActiveSection} />
                    </div>
                </div>

                {/* Main Content Area - Growing to fill all remaining space */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[800px]">
                    <div className="h-full">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
