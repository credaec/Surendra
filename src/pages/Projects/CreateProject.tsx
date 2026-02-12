import React, { useState, useEffect } from 'react';
import {
    Calendar, Folder, Users, DollarSign, Settings, CheckCircle2, AlertCircle, FileText, UploadCloud, ChevronRight, Flag, Trash2, Plus, ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Project, User } from '../../types/schema';
import { backendService } from '../../services/backendService';
import { useNavigate, useParams } from 'react-router-dom';

// Basic mock data call for clients


// Tabs Configuration
const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Folder },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'rules', label: 'Rules & Alerts', icon: Settings },
    { id: 'documents', label: 'Documents', icon: FileText },
];

const CreateProjectPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('basic');
    const [availableEmployees, setAvailableEmployees] = useState<User[]>([]);
    const [clients, setClients] = useState<any[]>(backendService.getClients()); // Initialize with cache, but likely need effect

    useEffect(() => {
        // Fetch users who are EMPLOYEEs
        const users = backendService.getUsers().filter(u => u.role === 'EMPLOYEE');
        setAvailableEmployees(users);

        // Fetch clients
        setClients(backendService.getClients());
    }, []);

    // Comprehensive Form State
    const [formData, setFormData] = useState<Partial<Project>>({
        name: '',
        code: '',
        type: 'HOURLY',
        status: 'ACTIVE',
        priority: 'MEDIUM',

        startDate: '',
        endDate: '',
        deliveryDate: '',

        billingMode: 'HOURLY_RATE',
        rateLogic: 'GLOBAL_PROJECT_RATE',
        currency: 'USD',
        budgetAmount: 0,
        estimatedHours: 0,
        entryRules: {
            notesRequired: false,
            proofRequired: false,
            minTimeUnit: 15,
            allowFutureEntry: false,
            allowBackdatedEntry: true
        },
        teamMembers: [],
        alerts: {
            budgetThresholdPct: 80,
            deadlineAlertDays: 7
        }
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    useEffect(() => {
        if (id) {
            const project = backendService.getProjectById(id);
            if (project) {
                setFormData(project);
            } else {
                alert('Project not found');
                navigate('/admin/projects');
            }
        }
    }, [id, navigate]);

    const handleNext = () => {
        const index = tabs.findIndex(t => t.id === activeTab);
        if (index < tabs.length - 1) setActiveTab(tabs[index + 1].id);
    };

    const handleBack = () => {
        const index = tabs.findIndex(t => t.id === activeTab);
        if (index > 0) setActiveTab(tabs[index - 1].id);
    };

    const handleAddTeamMember = () => {
        setFormData(prev => ({
            ...prev,
            teamMembers: [
                ...(prev.teamMembers || []),
                {
                    userId: '',
                    role: 'ENGINEER',
                    accessLevel: { canLogTime: true, canEditEntries: true, canApproveTime: false },
                    billableRate: 0,
                    costRate: 0
                }
            ]
        }));
    };

    const updateTeamMember = (index: number, field: string, value: any) => {
        const updatedMembers = [...(formData.teamMembers || [])];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setFormData({ ...formData, teamMembers: updatedMembers });
    };

    const removeTeamMember = (index: number) => {
        const updatedMembers = [...(formData.teamMembers || [])];
        updatedMembers.splice(index, 1);
        setFormData({ ...formData, teamMembers: updatedMembers });
    };

    const handleCreateProject = async () => {
        try {
            // Basic validation
            if (!formData.name || !formData.clientId) {
                alert('Please fill in Project Name and Client.');
                return;
            }

            // Find client name for denormalization
            const selectedClient = clients.find(c => c.id === formData.clientId);

            // Check required fields for type safety, though interface allows optional
            const projectToSave = {
                ...formData,
                clientName: selectedClient?.name || 'Unknown Client',
                // Set any missing required fields with defaults if necessary
                status: formData.status || 'PLANNED',
                billingMode: formData.billingMode || 'HOURLY_RATE',
                currency: formData.currency || 'USD',
                entryRules: formData.entryRules || {
                    notesRequired: false,
                    proofRequired: false,
                    minTimeUnit: 15,
                    allowFutureEntry: false,
                    allowBackdatedEntry: true
                },
                alerts: formData.alerts || {
                    budgetThresholdPct: 80,
                    deadlineAlertDays: 7
                },
                // Ensure teamMembers is clean (remove empty userIds)
                teamMembers: formData.teamMembers?.filter(m => m.userId) || []
            } as Project;

            if (isEditMode) {
                const updated = await backendService.updateProject(projectToSave);
                console.log('Project Updated:', updated);
                alert(`Project "${updated.name}" updated successfully!`);
            } else {
                const created = await backendService.addProject(projectToSave);
                console.log('Project Created:', created);
                alert(`Project "${created.name}" created successfully!\n\nEmail notifications sent to assigned team members.`);
            }
            navigate('/admin/projects');
        } catch (error) {
            console.error(error);
            alert('Failed to save project.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-4 text-sm font-medium"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </button>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Edit Project' : 'Create New Project'}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Configure project details, budget, team, and rules.</p>
            </div>

            {/* Stepper / Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
                <div className="flex overflow-x-auto scrollbar-hide">
                    {tabs.map((tab, idx) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const isPast = tabs.findIndex(t => t.id === activeTab) > idx;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-1 flex items-center justify-center py-4 px-6 min-w-[140px] border-b-2 transition-all text-sm font-medium",
                                    isActive ? "border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-900/20" :
                                        isPast ? "border-emerald-500 text-emerald-600 dark:text-emerald-500" : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}>

                                <Icon className={cn("h-4 w-4 mr-2", isActive ? "text-blue-600" : isPast ? "text-emerald-500" : "text-slate-400")} />
                                {tab.label}
                                {isPast && <CheckCircle2 className="h-4 w-4 ml-2 text-emerald-500" />}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 min-h-[400px]">

                {/* 1. Basic Info */}
                {activeTab === 'basic' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name *</label>
                                <input type="text" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500" placeholder="e.g. Skyline Tower Design"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Code</label>
                                <input type="text" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500" placeholder="e.g. PRJ-2024-001"
                                    value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client *</label>
                                <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                    value={formData.clientId} onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                                >
                                    <option value="">Select a client...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Type</label>
                                <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                    value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="HOURLY">Hourly Rate</option>
                                    <option value="FIXED">Fixed Fee</option>
                                    <option value="RETAINER">Retainer</option>
                                    <option value="INTERNAL">Internal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                                <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                    value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description / Scope Notes</label>
                                <textarea rows={4} className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500" placeholder="Detailed scope of work..."
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Timeline */}
                {activeTab === 'timeline' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date *</label>
                                <input type="date" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                    value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Delivery Date</label>
                                <input type="date" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                    value={formData.deliveryDate} onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date (Contract)</label>
                                <input type="date" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                    value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-3" />
                            <div>
                                <strong className="block text-sm font-medium text-amber-900 dark:text-amber-200">Timeline Impact</strong>
                                <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">Setting a Target Delivery Date will enable countdown alerts on the dashboard 7 days prior.</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* 3. Financials */}
                {activeTab === 'financials' && (
                    <div className="space-y-8 max-w-3xl">

                        {/* Billing Setup */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Settings className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> Billing Settings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Mode</label>
                                    <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                        value={formData.billingMode} onChange={e => setFormData({ ...formData, billingMode: e.target.value as any })}
                                    >
                                        <option value="HOURLY_RATE">Hourly Rate</option>
                                        <option value="FIXED_FEE">Fixed Fee</option>
                                        <option value="RETAINER">Retainer Monthly</option>
                                    </select>
                                </div>

                                {formData.billingMode === 'HOURLY_RATE' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rate Logic</label>
                                        <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                            value={formData.rateLogic} onChange={e => setFormData({ ...formData, rateLogic: e.target.value as any })}
                                        >
                                            <option value="GLOBAL_PROJECT_RATE">Global Project Rate</option>
                                            <option value="CATEGORY_BASED_RATE">Category-based Rates</option>
                                            <option value="EMPLOYEE_BASED_RATE">Employee-based Rates</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {formData.rateLogic === 'GLOBAL_PROJECT_RATE' && formData.billingMode === 'HOURLY_RATE' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Global Rate (per hour)</label>
                                    <div className="relative max-w-xs">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input type="number" className="w-full pl-8 rounded-lg border-slate-200 focus:ring-blue-500" placeholder="0.00"
                                            value={formData.globalRate} onChange={e => setFormData({ ...formData, globalRate: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Budget & Estimation */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <DollarSign className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> Budget & Estimation
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Budget Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input type="number" className="w-full pl-8 rounded-lg border-slate-200 focus:ring-blue-500" placeholder="0.00"
                                            value={formData.budgetAmount} onChange={e => setFormData({ ...formData, budgetAmount: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                                    <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                                        value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value as any })}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="INR">INR (₹)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estimated Hours</label>
                                    <input type="number" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500" placeholder="e.g 500"
                                        value={formData.estimatedHours} onChange={e => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Hour Cap (Optional)</label>
                                    <input type="number" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500" placeholder="e.g 160"
                                        value={formData.monthlyHourCap} onChange={e => setFormData({ ...formData, monthlyHourCap: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* 4. Team Assignment */}
                {activeTab === 'team' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Project Team</h3>
                            <button
                                onClick={handleAddTeamMember}
                                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Team Member
                            </button>
                        </div>

                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hourly Rate</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                                    {formData.teamMembers?.map((member, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                                <select
                                                    className="w-full rounded border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm"
                                                    value={member.userId}
                                                    onChange={(e) => updateTeamMember(idx, 'userId', e.target.value)}
                                                >
                                                    <option value="">Select Employee...</option>
                                                    {availableEmployees.map(emp => (
                                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                <select
                                                    className="rounded border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm py-1"
                                                    value={member.role}
                                                    onChange={(e) => updateTeamMember(idx, 'role', e.target.value)}
                                                >
                                                    <option value="PROJECT_MANAGER">Project Manager</option>
                                                    <option value="ENGINEER">Engineer</option>
                                                    <option value="DRAFTER">Drafter</option>
                                                    <option value="REVIEWER">Reviewer</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                <input
                                                    type="number"
                                                    className="w-24 rounded border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm py-1"
                                                    placeholder="Rate"
                                                    value={member.billableRate}
                                                    onChange={(e) => updateTeamMember(idx, 'billableRate', Number(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => removeTeamMember(idx)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!formData.teamMembers || formData.teamMembers.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                                                No team members added yet. Click "+ Add Team Member" to assign users.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 5. Rules & Alerts */}
                {activeTab === 'rules' && (
                    <div className="space-y-8 max-w-3xl">

                        {/* Task Rules */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <CheckCircle2 className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> Time Entry Rules
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                                    <input type="checkbox" checked={formData.entryRules?.notesRequired}
                                        onChange={e => setFormData({ ...formData, entryRules: { ...formData.entryRules as any, notesRequired: e.target.checked } })}
                                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Require Notes on Entry</span>
                                </label>
                                <label className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                                    <input type="checkbox" checked={formData.entryRules?.proofRequired}
                                        onChange={e => setFormData({ ...formData, entryRules: { ...formData.entryRules as any, proofRequired: e.target.checked } })}
                                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Require Attachment / Proof</span>
                                </label>
                                <label className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                                    <input type="checkbox" checked={formData.entryRules?.allowBackdatedEntry}
                                        onChange={e => setFormData({ ...formData, entryRules: { ...formData.entryRules as any, allowBackdatedEntry: e.target.checked } })}
                                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Allow Backdated Entries</span>
                                </label>
                                <label className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                                    <input type="checkbox" checked={formData.entryRules?.allowFutureEntry}
                                        onChange={e => setFormData({ ...formData, entryRules: { ...formData.entryRules as any, allowFutureEntry: e.target.checked } })}
                                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Allow Future Entries</span>
                                </label>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Minimum Time Unit (Minutes)</label>
                                <select className="w-full max-w-xs rounded-lg border-slate-200 focus:ring-blue-500"
                                    value={formData.entryRules?.minTimeUnit} onChange={e => setFormData({ ...formData, entryRules: { ...formData.entryRules as any, minTimeUnit: Number(e.target.value) } })}
                                >
                                    <option value="5">5 Minutes</option>
                                    <option value="10">10 Minutes</option>
                                    <option value="15">15 Minutes</option>
                                </select>
                            </div>
                        </div>

                        {/* Alerts */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> Notifications & Alerts
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget Alert Threshold (%)</label>
                                    <input type="number" className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500" placeholder="e.g 80"
                                        value={formData.alerts?.budgetThresholdPct} onChange={e => setFormData({ ...formData, alerts: { ...formData.alerts as any, budgetThresholdPct: Number(e.target.value) } })}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Notify admins when budget usage crosses 80%</p>
                                </div>
                                <div className="opacity-50">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upcoming Deadline Alert (Days)</label>
                                    <input type="number" disabled className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500" value="7" />
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* 6. Documents */}
                {activeTab === 'documents' && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer group">
                        <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Upload Project Documents</h3>
                        <p className="text-slate-500 mt-1 mb-6">Drag and drop files here, or click to browse</p>
                        <button className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Browse Files
                        </button>
                        <p className="text-xs text-slate-400 mt-4">Supported: PDF, DWG, DOCX, ZIP</p>
                    </div>
                )}

                {/* Footer Controls */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={activeTab === 'basic'}
                        className="px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                        Back
                    </button>

                    {activeTab !== 'documents' ? (
                        <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center shadow-sm shadow-blue-200">
                            Next Step <ChevronRight className="h-4 w-4 ml-2" />
                        </button>
                    ) : (
                        <button
                            onClick={handleCreateProject}
                            className="px-8 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center shadow-sm shadow-emerald-200"
                        >
                            {isEditMode ? 'Update Project' : 'Create Project'} <Flag className="h-4 w-4 ml-2" />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CreateProjectPage;

