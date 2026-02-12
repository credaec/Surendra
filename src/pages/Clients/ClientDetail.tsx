import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, Mail, Phone, Globe, MoreHorizontal, FileText, Briefcase, Receipt, Users, FolderOpen, Save, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { backendService } from '../../services/backendService';
import type { Client, ClientContact } from '../../types/schema';

const ClientDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [client, setClient] = useState<Client | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Client>>({});

    // Derived State for KPIs
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalBillable: 0,
        hoursLogged: 0,
        pendingInvoices: 0,
        totalInvoiced: 0,
        totalPaid: 0,
        totalOutstanding: 0
    });

    // Contact Modal State
    const [documents, setDocuments] = useState<any[]>([]);

    // Contact Modal State
    const [showContactModal, setShowContactModal] = useState(false);
    const [newContact, setNewContact] = useState<Partial<ClientContact>>({
        name: '',
        role: '',
        email: '',
        phone: ''
    });

    const refreshData = async () => {
        if (!id) return;

        // Clients are cached sync for now, but usually should be async. 
        // Assuming getClients() is sync as per backendService implementation.
        const clients = backendService.getClients();
        const found = clients.find(c => c.id === id);
        if (found) {
            setClient(found);
            setFormData(found);

            // Fetch specific async data
            const docs = await backendService.getClientDocuments(found.id);
            setDocuments(docs);

            // Calculate KPIs
            const projects = backendService.getProjects().filter(p => p.clientId === id);
            const invoices = backendService.getInvoices().filter(i => i.clientId === id);

            const totalBillable = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
            const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((sum, inv) => sum + inv.totalAmount, 0);
            const totalOutstanding = invoices.filter(i => i.status !== 'PAID').reduce((sum, inv) => sum + inv.balanceAmount, 0);
            const pendingCount = invoices.filter(i => i.status === 'SENT' || i.status === 'PARTIAL' || i.status === 'OVERDUE').length;

            const hoursLogged = projects.reduce((total, project) => {
                const projectEntries = backendService.getEntries().filter(e => e.projectId === project.id);
                const projectHours = projectEntries.reduce((sum, e) => sum + (e.durationMinutes / 60), 0);
                return total + projectHours;
            }, 0);

            setStats({
                totalProjects: projects.length,
                totalBillable,
                hoursLogged: Math.round(hoursLogged * 10) / 10,
                pendingInvoices: pendingCount,
                totalInvoiced: totalBillable,
                totalPaid,
                totalOutstanding
            });
        }
    };

    useEffect(() => {
        refreshData();
    }, [id]);

    const handleDelete = async () => {
        if (!client) return;
        if (confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
            await backendService.deleteClient(client.id);
            navigate('/admin/clients');
        }
    };

    const handleSave = async () => {
        if (client && client.id) {
            const updated = await backendService.updateClient({ ...client, ...formData } as Client);
            if (updated) {
                setClient(updated);
                setIsEditing(false);
            }
        }
    };

    const handleAddContact = async () => {
        if (!client || !newContact.name || !newContact.email) return;
        await backendService.addClientContact(client.id, {
            name: newContact.name,
            role: newContact.role || 'Contact',
            email: newContact.email,
            phone: newContact.phone,
            isPrimary: false
        });
        setShowContactModal(false);
        setNewContact({ name: '', role: '', email: '', phone: '' });
        refreshData();
    };

    const handleDeleteContact = async (contactId: string) => {
        if (!client) return;
        if (confirm("Remove this contact?")) {
            await backendService.deleteClientContact(client.id, contactId);
            refreshData();
        }
    };

    const handleCreateInvoice = () => {
        if (client) {
            navigate(`/admin/billing/invoices/create?clientId=${client.id}`);
        }
    };

    const handleDownloadPDF = (invoice: any) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Invoice ${invoice.invoiceNo}</title>
                        <style>
                            body { font-family: sans-serif; padding: 40px; }
                            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                            .title { font-size: 24px; font-weight: bold; }
                            .meta { text-align: right; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                            th { background-color: #f8f9fa; }
                            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <div>
                                <div class="title">INVOICE</div>
                                <p>Credence Tracking</p>
                            </div>
                            <div class="meta">
                                <p>Invoice #: ${invoice.invoiceNo}</p>
                                <p>Date: ${invoice.date}</p>
                                <p>Due: ${invoice.dueDate}</p>
                            </div>
                        </div>
                        
                        <p><strong>Bill To:</strong> ${client?.name || invoice.clientName}</p>
                        <p><strong>Project:</strong> ${invoice.projectName || 'N/A'}</p>
                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoice.items ? invoice.items.map((item: any) => `
                                    <tr>
                                        <td>${item.description || 'Service'}</td>
                                        <td>$${(item.amount || 0).toFixed(2)}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td>Professional Services</td>
                                        <td>$${invoice.totalAmount.toFixed(2)}</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                        
                        <div class="total">
                            Total: $${invoice.totalAmount.toFixed(2)}
                        </div>
                        
                        <script>
                            window.onload = function() { window.print(); }
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            alert('Please allow popups to download PDF');
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
                            className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 bg-transparent w-full"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    ) : (
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{client.name}</h1>
                    )}

                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-4 mt-1">
                        <span className="flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            {isEditing ? (
                                <input
                                    className="border-b border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 bg-transparent text-slate-900 dark:text-white"
                                    value={formData.companyName || ''}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            ) : client.companyName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-100 dark:border-emerald-800">{client.status}</span>
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
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                        >
                            <MoreHorizontal className="h-5 w-5 text-slate-500" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center"
                                    >
                                        Delete Client
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
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
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Total Projects</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalProjects}</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Total Billable</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">${stats.totalBillable.toLocaleString()}</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Hours Logged</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.hoursLogged}h</div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">Pending Invoices</div>
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{stats.pendingInvoices}</div>
                            </div>
                        </div>

                        {/* Client Notes / Address */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Contact & Address</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
                                    {isEditing ? (
                                        <input
                                            className="w-full border border-slate-200 dark:border-slate-600 bg-transparent dark:text-white rounded-md p-2 text-sm"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-sm text-slate-900 dark:text-slate-200 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-slate-400" /> {client.email}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Phone</label>
                                    {isEditing ? (
                                        <input
                                            className="w-full border border-slate-200 dark:border-slate-600 bg-transparent dark:text-white rounded-md p-2 text-sm"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-sm text-slate-900 dark:text-slate-200 flex items-center">
                                            <Phone className="h-4 w-4 mr-2 text-slate-400" /> {client.phone || 'N/A'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">Client Details</h3>
                            <div className="space-y-5">
                                {/* Billing Type - Only Currency in schema */}
                                <div className="flex items-start">
                                    <div className="mt-0.5 mr-3 p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                        <span className="text-xs font-bold">$</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Currency</span>
                                        {isEditing ? (
                                            <select
                                                className="border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded text-sm p-1"
                                                value={formData.currency || 'USD'}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                                            >
                                                <option value="USD">USD</option>
                                                <option value="INR">INR</option>
                                            </select>
                                        ) : (
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{client.currency}</span>
                                        )}
                                    </div>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-700 my-4" />

                                <div className="flex items-start">
                                    <Globe className="h-4 w-4 text-slate-400 mt-0.5 mr-3" />
                                    <div>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400">Status</span>
                                        <span className="text-sm text-slate-900 dark:text-white">{client.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'projects' && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Project Name</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Code</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Priority</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Key Date</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {backendService.getProjects().filter(p => p.clientId === client.id).map((project) => (
                                    <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-slate-900">{project.name}</div>
                                            <div className="text-xs text-slate-400">{project.type}</div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-500 font-mono">{project.code}</td>
                                        <td className="py-3 px-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-xs font-medium border",
                                                project.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                    project.status === 'COMPLETED' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                        "bg-slate-100 text-slate-600 border-slate-200"
                                            )}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={cn(
                                                "text-xs font-bold px-2 py-0.5 rounded",
                                                project.priority === 'HIGH' || project.priority === 'CRITICAL' ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {project.priority}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-500">
                                            {project.startDate}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                // navigate to project edit/view if available, for now just log
                                                onClick={() => navigate(`/admin/tasks`)} // Assuming Tasks page or Project list page
                                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-all"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {backendService.getProjects().filter(p => p.clientId === client.id).length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center">
                                                <Briefcase className="h-8 w-8 mb-2 opacity-50" />
                                                <p>No projects found for this client.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'contacts' && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {client.contacts?.map((contact) => (
                            <div key={contact.id} className="group relative flex flex-col p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-slate-50/50">
                                <button
                                    onClick={() => handleDeleteContact(contact.id)}
                                    className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                        {contact.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{contact.name}</h4>
                                        <p className="text-sm text-slate-500">{contact.role}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-auto">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Mail className="h-4 w-4 mr-2 text-slate-400" />
                                        {contact.email}
                                    </div>
                                    {contact.phone && (
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Phone className="h-4 w-4 mr-2 text-slate-400" />
                                            {contact.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowContactModal(true)}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group"
                        >
                            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 flex items-center justify-center mb-3 transition-colors">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className="font-medium text-slate-600 group-hover:text-blue-600">Add New Contact</span>
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'billing' && (
                <div className="space-y-6">
                    {/* Billing Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Invoiced</div>
                            <div className="text-2xl font-bold text-slate-900">${stats.totalInvoiced.toLocaleString()}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Paid</div>
                            <div className="text-2xl font-bold text-emerald-600">${stats.totalPaid.toLocaleString()}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Outstanding</div>
                            <div className="text-2xl font-bold text-amber-600">${stats.totalOutstanding.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Invoices List */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Invoices</h3>
                            <button onClick={handleCreateInvoice} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">Create Invoice</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Invoice #</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                        <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {backendService.getInvoices().filter(inv => inv.clientId === client.id).length > 0 ? (
                                        backendService.getInvoices().filter(inv => inv.clientId === client.id).map(invoice => (
                                            <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-6 font-medium text-slate-900">{invoice.invoiceNo}</td>
                                                <td className="py-3 px-6 text-sm text-slate-500">{invoice.date}</td>
                                                <td className="py-3 px-6 font-medium text-slate-900">${invoice.totalAmount.toLocaleString()}</td>
                                                <td className="py-3 px-6">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                                                        invoice.status === 'PAID' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                            invoice.status === 'OVERDUE' ? "bg-rose-50 text-rose-700 border-rose-100" :
                                                                "bg-amber-50 text-amber-700 border-amber-100"
                                                    )}>
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6 text-right">
                                                    <button onClick={() => handleDownloadPDF(invoice)} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Download</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-slate-400">No invoices found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'documents' && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {documents.map((doc) => (
                            <div key={doc.id} className="group relative border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all bg-white hover:border-blue-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (confirm('Delete this document?')) {
                                                await backendService.deleteClientDocument(doc.id);
                                                refreshData(); // Triggers re-render
                                            }
                                        }}
                                        className="text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <h4 className="font-semibold text-slate-900 truncate mb-1">{doc.name}</h4>
                                <p className="text-xs text-slate-500">{doc.size} • Uploaded {doc.uploadDate}</p>
                            </div>
                        ))}
                        <button
                            onClick={async () => {
                                const name = prompt("Enter document name (Mock Upload):", "New_Contract.pdf");
                                if (name) {
                                    await backendService.addClientDocument({
                                        clientId: client.id,
                                        name: name,
                                        size: '1.5 MB',
                                        uploadDate: new Date().toISOString().split('T')[0],
                                        type: 'PDF'
                                    });
                                    refreshData();
                                }
                            }}
                            className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer text-slate-400 hover:text-blue-600 hover:border-blue-300"
                        >
                            <div className="mb-2">
                                <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <FolderOpen className="h-5 w-5" />
                                </div>
                            </div>
                            <span className="text-sm font-medium">Upload Document</span>
                        </button>
                    </div>
                </div>
            )}


            {/* Contact Modal */}
            {
                showContactModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Contact</h2>
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="e.g. Jane Doe"
                                        value={newContact.name}
                                        onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="e.g. Project Manager"
                                        value={newContact.role}
                                        onChange={e => setNewContact({ ...newContact, role: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="jane@example.com"
                                        value={newContact.email}
                                        onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder="+1 (555) 000-0000"
                                        value={newContact.phone}
                                        onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddContact}
                                    className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white dark:text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700 shadow-sm transition-colors"
                                >
                                    Add Contact
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ClientDetail;

