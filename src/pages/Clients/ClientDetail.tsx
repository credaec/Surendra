import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Phone, Globe, MoreHorizontal, FileText, Briefcase, Receipt, Users, FolderOpen, Save, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { mockBackend } from '../../services/mockBackend';
import type { Client } from '../../types/schema';

const ClientDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [client, setClient] = useState<Client | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Client>>({});

    useEffect(() => {
        if (id) {
            // Find client by ID
            const clients = mockBackend.getClients();
            const found = clients.find(c => c.id === id);
            if (found) {
                setClient(found);
                setFormData(found);
            } else {
                // Fallback or redirect if not found
                // For now, load first or mock if id not matching (demo robustness)
                if (clients.length > 0) {
                    setClient(clients[0]);
                    setFormData(clients[0]);
                }
            }
        }
    }, [id]);

    const handleSave = () => {
        if (client && client.id) {
            const updated = mockBackend.updateClient(client.id, formData);
            if (updated) {
                setClient(updated);
                setIsEditing(false);
            }
        }
    };

    if (!client) return <div className="p-8 text-center">Loading client details...</div>;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'projects', label: 'Projects', icon: Briefcase },
        { id: 'contacts', label: 'Contacts', icon: Users },
        { id: 'billing', label: 'Billing Info', icon: Receipt },
        { id: 'documents', label: 'Documents', icon: FolderOpen },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-2">
                <button onClick={() => navigate('/admin/clients')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    {isEditing ? (
                        <input
                            type="text"
                            className="text-2xl font-bold text-slate-900 border-b border-slate-300 focus:outline-none focus:border-blue-500 bg-transparent w-full"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    ) : (
                        <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
                    )}

                    <div className="flex items-center text-sm text-slate-500 space-x-4 mt-1">
                        <span className="flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            {isEditing ? (
                                <input
                                    className="border-b border-slate-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                    value={formData.companyName || ''}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            ) : client.companyName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">{client.status}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center"
                            >
                                <X className="h-4 w-4 mr-2" /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center"
                            >
                                <Save className="h-4 w-4 mr-2" /> Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                        >
                            Edit Client
                        </button>
                    )}
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><MoreHorizontal className="h-5 w-5 text-slate-500" /></button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
                                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors'
                                )}
                            >
                                <Icon className={cn("h-4 w-4 mr-2", activeTab === tab.id ? "text-blue-500" : "text-slate-400 group-hover:text-slate-500")} />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* KPI Row - Client Dashboard */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Projects</div>
                                <div className="text-2xl font-bold text-slate-900">{client.totalProjects}</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Billable</div>
                                <div className="text-2xl font-bold text-slate-900">$124k</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Hours Logged</div>
                                <div className="text-2xl font-bold text-slate-900">1,240h</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Pending Invoices</div>
                                <div className="text-2xl font-bold text-amber-600">2</div>
                            </div>
                        </div>

                        {/* Client Notes / Address */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4 text-slate-800">Contact & Address</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                                    {isEditing ? (
                                        <input
                                            className="w-full border border-slate-200 rounded-md p-2 text-sm"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-sm text-slate-900 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-slate-400" /> {client.email}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                                    {isEditing ? (
                                        <input
                                            className="w-full border border-slate-200 rounded-md p-2 text-sm"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-sm text-slate-900 flex items-center">
                                            <Phone className="h-4 w-4 mr-2 text-slate-400" /> {client.phone || 'N/A'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Top Employees Worked (Mock for now) */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4 text-slate-800">Top Employees</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Alice Johnson', role: 'Senior Architect', hours: 420, avatar: 'AJ' },
                                    { name: 'Bob Smith', role: 'Structural Engineer', hours: 310, avatar: 'BS' },
                                    { name: 'Charlie Brown', role: 'Drafter', hours: 180, avatar: 'CB' },
                                ].map((emp, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold mr-3">
                                                {emp.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                                                <div className="text-xs text-slate-500">{emp.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-slate-700">{emp.hours}h</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Client Details</h3>
                            <div className="space-y-5">
                                {/* Billing Type - Only Currency in schema */}
                                <div className="flex items-start">
                                    <div className="mt-0.5 mr-3 p-1.5 rounded-md bg-emerald-50 text-emerald-600">
                                        <span className="text-xs font-bold">$</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-slate-500 uppercase">Currency</span>
                                        {isEditing ? (
                                            <select
                                                className="border border-slate-200 rounded text-sm p-1"
                                                value={formData.currency || 'USD'}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                                            >
                                                <option value="USD">USD</option>
                                                <option value="INR">INR</option>
                                            </select>
                                        ) : (
                                            <span className="text-sm font-medium text-slate-900">{client.currency}</span>
                                        )}
                                    </div>
                                </div>

                                <hr className="border-slate-100 my-4" />

                                <div className="flex items-start">
                                    <Globe className="h-4 w-4 text-slate-400 mt-0.5 mr-3" />
                                    <div>
                                        <span className="block text-xs text-slate-500">Status</span>
                                        <span className="text-sm text-slate-900">{client.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'projects' && (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Briefcase className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">Projects List</h3>
                    <p>Projects table will be rendered here.</p>
                </div>
            )}
        </div>
    );
};

export default ClientDetail;
