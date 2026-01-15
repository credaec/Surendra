import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { mockBackend } from '../../services/mockBackend';
import type { Client } from '../../types/schema';

const ClientListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState<Client[]>(mockBackend.getClients());

    // Basic Add Client (for now - could be a modal later)
    const handleAddClient = () => {
        const name = prompt("Enter Client Name:");
        if (name) {
            mockBackend.addClient({
                name,
                companyName: name,
                status: 'ACTIVE',
                currency: 'USD'
            });
            // Refresh list
            setClients(mockBackend.getClients());
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Clients</h1>
                    <p className="text-slate-500 mt-1">Manage your client base and billing details.</p>
                </div>

                <button
                    onClick={handleAddClient}
                    className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm ring-offset-2 focus:ring-2 ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
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
                <button className="flex items-center px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </button>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
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
                                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientListPage;
