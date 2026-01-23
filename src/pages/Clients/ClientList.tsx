import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, MapPin, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { mockBackend } from '../../services/mockBackend';
import type { Client } from '../../types/schema';

const ClientListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState<Client[]>(mockBackend.getClients());
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // Add Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newClient, setNewClient] = useState<Partial<Client>>({
        name: '',
        companyName: '',
        email: '',
        currency: 'USD',
        status: 'ACTIVE'
    });

    const handleDeleteClient = (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            mockBackend.deleteClient(id);
            setClients(mockBackend.getClients());
            setActiveMenuId(null);
        }
    };

    const handleOpenAddModal = () => {
        setNewClient({
            name: '',
            companyName: '',
            email: '',
            currency: 'USD',
            status: 'ACTIVE'
        });
        setShowAddModal(true);
    };

    const handleSaveClient = () => {
        if (!newClient.name || !newClient.companyName) {
            alert("Please fill in Name and Company Name");
            return;
        }

        mockBackend.addClient({
            name: newClient.name,
            companyName: newClient.companyName,
            email: newClient.email,
            status: newClient.status || 'ACTIVE',
            currency: newClient.currency || 'USD'
        });

        // Refresh list
        setClients(mockBackend.getClients());
        setShowAddModal(false);
    };

    const filteredClients = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Clients</h1>
                    <p className="text-slate-500 mt-1">Manage your client base and billing details.</p>
                </div>

                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm ring-offset-2 focus:ring-2 ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative z-10">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        className="w-full pl-10 pr-4 py-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center px-3 py-2 border rounded-lg text-sm transition-colors ${filterStatus !== 'ALL' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {filterStatus !== 'ALL' && <span className="ml-2 bg-blue-200 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full">{filterStatus}</span>}
                    </button>

                    {isFilterOpen && (
                        <>
                            <div className="fixed inset-0 z-0" onClick={() => setIsFilterOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-3 py-2 border-b border-slate-50 text-xs font-semibold text-slate-500 uppercase">
                                    Status
                                </div>
                                <button
                                    onClick={() => { setFilterStatus('ALL'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filterStatus === 'ALL' ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-slate-700'}`}
                                >
                                    All Clients
                                </button>
                                <button
                                    onClick={() => { setFilterStatus('ACTIVE'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filterStatus === 'ACTIVE' ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-slate-700'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => { setFilterStatus('INACTIVE'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${filterStatus === 'INACTIVE' ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-slate-700'}`}
                                >
                                    Inactive
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-visible">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Currency</th>
                            <th className="px-6 py-4">Total Projects</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredClients.map((client) => (
                            <tr
                                key={client.id}
                                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                onClick={() => navigate(`/admin/clients/${client.id}`)}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{client.name}</div>
                                            <div className="text-slate-500 text-xs">{client.companyName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                                        USA
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">{client.currency}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-900 font-medium">
                                    {client.totalProjects} Projects
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium",
                                        client.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === client.id ? null : client.id);
                                            }}
                                            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>

                                        {activeMenuId === client.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuId(null);
                                                    }}
                                                />
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/admin/clients/${client.id}`);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                                                    >
                                                        Edit Client
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteClient(e, client.id, client.name)}
                                                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center"
                                                    >
                                                        Delete Client
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Add New Client</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Client Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. John Doe / Tech Corp"
                                    value={newClient.name}
                                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Acme Industries"
                                    value={newClient.companyName}
                                    onChange={e => setNewClient({ ...newClient, companyName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1"> Email </label>
                                <input
                                    type="email"
                                    className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500"
                                    placeholder="contact@acme.com"
                                    value={newClient.email}
                                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1"> Currency </label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500"
                                        value={newClient.currency}
                                        onChange={e => setNewClient({ ...newClient, currency: e.target.value as any })}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="INR">INR (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1"> Status </label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 focus:ring-2 focus:ring-blue-500"
                                        value={newClient.status}
                                        onChange={e => setNewClient({ ...newClient, status: e.target.value as any })}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveClient}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm"
                            >
                                Create Client
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientListPage;
