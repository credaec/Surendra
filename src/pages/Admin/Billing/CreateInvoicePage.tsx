import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Building2, MapPin } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { backendService } from '../../../services/backendService';
import { settingsService } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';
import type { Client, Project } from '../../../types/schema';

const CreateInvoicePage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isEditMode = !!id;

    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);

    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        // Invoice Meta
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'DRAFT',

        // Sender Info
        senderName: '',
        senderAddress: '',
        senderCityState: '',
        senderEmail: '',

        // Client/Project
        clientId: '',
        projectId: '',

        // Financials
        items: [] as { id: string, description: string; quantity: number; unitPrice: number; amount: number }[],
        notes: '',
        terms: '',
        paymentTerms: 'NET30', // Default
        taxRate: 0,
        discount: 0
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [loadedClients, loadedProjects, appSettings, allInvoices] = await Promise.all([
                    backendService.getClients(),
                    backendService.getProjects(),
                    settingsService.getSettings(),
                    backendService.getInvoices()
                ]);

                setClients(loadedClients);
                setProjects(loadedProjects);

                let initialData: any = {
                    invoiceNo: `${appSettings.billing.invoicePrefix}${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                    invoiceDate: new Date().toISOString().split('T')[0],
                    dueDate: '',
                    status: 'DRAFT',
                    senderName: appSettings.company.name,
                    senderAddress: appSettings.company.address,
                    senderCityState: `${appSettings.company.city}, ${appSettings.company.state}`,
                    senderEmail: 'billing@localhost.com',
                    clientId: searchParams.get('clientId') || '',
                    projectId: '',
                    items: [],
                    notes: appSettings.billing.invoiceNotesTemplate,
                    terms: 'Payment is due within 15 days.',
                    paymentTerms: appSettings.billing.defaultPaymentTerms,
                    taxRate: appSettings.billing.defaultTaxPercentage,
                    discount: 0
                };

                if (id) {
                    const invoice = allInvoices.find(i => i.id === id);
                    if (invoice) {
                        const client = loadedClients.find(c => c.id === invoice.clientId);
                        setSelectedClient(client);
                        initialData = {
                            ...initialData,
                            invoiceNo: invoice.invoiceNo,
                            invoiceDate: invoice.date,
                            dueDate: invoice.dueDate,
                            status: invoice.status,
                            clientId: invoice.clientId,
                            projectId: invoice.projectId || '',
                            items: invoice.items || [],
                            taxRate: 10,
                            // paymentTerms: invoice.paymentTerms || appSettings.billing.defaultPaymentTerms // if invoice has it
                        };
                    }
                }

                setFormData(prev => ({ ...prev, ...initialData }));
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id]);

    // ... (rest of code)

    // In JSX (I will manually replace the JSX part in a separate block if needed, but replace_file_content handles contiguous blocks)
    // Wait, I need to check where the JSX is. It is far down.
    // I can't do this in one `replace_file_content` if they are far apart.
    // The previous `replace_file_content` showed lines 14-83 being replaced.
    // The JSX is around line 342.
    // So I need TWO MULTI_REPLACE chunks.


    if (isLoading) {
        return <div className="p-8 flex justify-center text-slate-500">Loading invoice details...</div>;
    }

    const handleClientChange = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        setSelectedClient(client);
        setFormData(prev => ({ ...prev, clientId, projectId: '' }));
    };

    const clientProjects = projects.filter(p => p.clientId === formData.clientId);

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { id: `temp-${Date.now()}`, description: '', quantity: 0, unitPrice: 0, amount: 0 }
            ]
        }));
    };

    const handleProjectChange = (projectId: string) => {
        setFormData(prev => ({ ...prev, projectId }));
    };

    const updateItem = (id: string, field: 'description' | 'quantity' | 'unitPrice', value: string | number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id === id) {
                    const updates = { [field]: value };
                    // Recalculate amount if hours/rate changes
                    let quantity = field === 'quantity' ? Number(value) : item.quantity;
                    let unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice;
                    const amount = quantity * unitPrice;
                    return { ...item, ...updates, amount };
                }
                return item;
            })
        }));
    };

    const removeItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(i => i.id !== id)
        }));
    };

    const calculateSubtotal = () => formData.items.reduce((sum, item) => sum + item.amount, 0);
    const calculateTax = () => calculateSubtotal() * (formData.taxRate / 100);
    const calculateTotal = () => calculateSubtotal() + calculateTax() - formData.discount;

    const handleSave = async (status: 'DRAFT' | 'SENT') => {
        if (!formData.clientId) {
            showToast('Please select a client to bill.', 'error');
            return;
        }
        if (!formData.invoiceDate) {
            showToast('Please select an invoice date.', 'error');
            return;
        }
        if (!formData.dueDate) {
            showToast('Please select a due date.', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const project = projects.find(p => p.id === formData.projectId);
            const subtotal = calculateSubtotal();
            const taxAmount = calculateTax();
            const total = calculateTotal();

            // Sanitize payload: Only include fields present in Prisma Schema
            const invoiceData = {
                // Fields mapped from formData
                invoiceNo: formData.invoiceNo,
                clientId: selectedClient?.id || formData.clientId,
                clientName: selectedClient?.companyName || 'Unknown Client',
                projectId: formData.projectId || null,
                projectName: project?.name || null,
                date: new Date(formData.invoiceDate).toISOString(),
                dueDate: new Date(formData.dueDate).toISOString(),
                status,
                items: formData.items, // Will be stringified by server
                notes: formData.notes,

                // Calculated fields
                subtotal,
                taxAmount,
                totalAmount: total,
                balanceAmount: total,
                currency: 'USD',

                // Exclude: sender*, terms, paymentTerms, discount, taxRate (unless stored in items or notes)
            };

            console.log("Sending Invoice Payload:", invoiceData);

            if (isEditMode && id) {
                await backendService.updateInvoice({ ...invoiceData, id } as any);
                showToast('Invoice updated successfully', 'success');
            } else {
                await backendService.addInvoice(invoiceData as any);
                showToast('Invoice created successfully', 'success');
            }

            navigate('/admin/billing/invoices');
        } catch (error) {
            console.error("Save failed", error);
            showToast('Failed to save invoice. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !formData.clientId && !formData.items.length) { // Only show full loader on initial load
        return <div className="p-8 flex justify-center text-slate-500">Loading invoice details...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500 pb-24">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/admin/billing/invoices')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Edit Invoice' : 'New Invoice'}</h1>
                        <p className="text-slate-500 text-sm dark:text-slate-400">{isEditMode ? 'Update invoice details' : 'Create and send a new invoice'}</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => handleSave('DRAFT')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 text-sm disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button
                        onClick={() => handleSave('SENT')}
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 text-sm flex items-center disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center">Saving...</span>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save & Send
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Document Container */}
            <div className="bg-white rounded-none shadow-xl border border-slate-200 min-h-[800px] relative">
                {/* Decorative Top Border */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full"></div>

                <div className="p-12">

                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-12">
                        {/* Company Info - Now Editable */}
                        <div className="w-1/2">
                            <div className="flex items-center space-x-2 mb-4 group">
                                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                                    {formData.senderName.charAt(0)}
                                </div>
                                <input
                                    type="text"
                                    className="text-xl font-bold text-slate-900 tracking-tight bg-transparent border-none hover:bg-slate-50 focus:bg-slate-50 rounded px-2 w-full transition-colors"
                                    value={formData.senderName}
                                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                    placeholder="Company Name"
                                />
                            </div>
                            <div className="text-sm text-slate-500 space-y-1">
                                <input
                                    type="text"
                                    className="block w-full bg-transparent border-none p-0 text-slate-500 hover:text-slate-700 focus:ring-0 placeholder:text-slate-300"
                                    value={formData.senderAddress}
                                    onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                                    placeholder="Street Address"
                                />
                                <input
                                    type="text"
                                    className="block w-full bg-transparent border-none p-0 text-slate-500 hover:text-slate-700 focus:ring-0 placeholder:text-slate-300"
                                    value={formData.senderCityState}
                                    onChange={(e) => setFormData({ ...formData, senderCityState: e.target.value })}
                                    placeholder="City, State Zip"
                                />
                                <input
                                    type="email"
                                    className="block w-full bg-transparent border-none p-0 text-slate-500 hover:text-slate-700 focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-400"
                                    value={formData.senderEmail}
                                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                                    placeholder="Email Address"
                                />
                            </div>
                        </div>

                        {/* Invoice Meta */}
                        <div className="text-right">
                            <h2 className="text-4xl font-light text-slate-900 mb-2">INVOICE</h2>
                            <div className="flex items-center justify-end text-slate-500 mb-1">
                                <span className="mr-4 font-medium">Invoice #</span>
                                <input
                                    type="text"
                                    value={formData.invoiceNo}
                                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                                    className="text-right font-mono text-slate-900 bg-slate-50 border-none rounded focus:ring-1 focus:ring-blue-500 w-32 px-2 py-1"
                                />
                            </div>
                            <div className="flex items-center justify-end text-slate-500">
                                <span className="mr-4 font-medium">Date</span>
                                <input
                                    type="date"
                                    value={formData.invoiceDate}
                                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                                    className="text-right font-mono text-slate-900 bg-white border-b border-slate-200 focus:outline-none focus:border-blue-500 w-32 py-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bill To & Details Grid */}
                    <div className="grid grid-cols-12 gap-12 mb-12">
                        <div className="col-span-12 md:col-span-5">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bill To</h3>
                            <select
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 text-slate-900"
                                value={formData.clientId}
                                onChange={(e) => handleClientChange(e.target.value)}
                            >
                                <option value="">Select Client...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>

                            {selectedClient && (
                                <div className="p-4 border border-slate-100 rounded-lg bg-white shadow-sm space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="font-semibold text-slate-900">{selectedClient.companyName}</h4>
                                    <div className="flex items-start text-sm text-slate-500">
                                        <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-slate-400" />
                                        <span>
                                            PO Box {Math.floor(Math.random() * 9000) + 1000}<br />
                                            {selectedClient.name.split(' ')[0]}'s City<br />
                                            USA
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500">
                                        <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                                        <span>{selectedClient.email}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-span-12 md:col-span-7">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project</h3>
                                    <select
                                        className="w-full p-2 bg-white border-b border-slate-200 focus:outline-none focus:border-blue-500 text-slate-900"
                                        value={formData.projectId}
                                        onChange={(e) => handleProjectChange(e.target.value)}
                                        disabled={!formData.clientId}
                                    >
                                        <option value="">Select Project Reference...</option>
                                        {clientProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Terms</h3>
                                    <select
                                        className="w-full p-2 bg-white border-b border-slate-200 text-slate-700 focus:outline-none focus:border-blue-500"
                                        value={formData.paymentTerms}
                                        disabled
                                    >
                                        <option value="NET7">Net 7</option>
                                        <option value="NET15">Net 15</option>
                                        <option value="NET30">Net 30</option>
                                    </select>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Due Date</h3>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full p-2 bg-white border-b border-slate-200 focus:outline-none focus:border-blue-500 text-slate-900"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notice</h3>
                                    <p className="text-sm text-slate-500 mt-2 italic">Automated Billing</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="mb-12">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-900">
                                    <th className="text-left py-3 text-sm font-bold text-slate-900 uppercase">Description</th>
                                    <th className="text-right py-3 text-sm font-bold text-slate-900 uppercase w-24">Quantity</th>
                                    <th className="text-right py-3 text-sm font-bold text-slate-900 uppercase w-32">Unit Price</th>
                                    <th className="text-right py-3 text-sm font-bold text-slate-900 uppercase w-32">Amount</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {formData.items.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-3">
                                            <input
                                                type="text"
                                                placeholder="e.g. Support"
                                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-700 placeholder:text-slate-300"
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 text-right">
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-right text-slate-700"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                            />
                                        </td>
                                        <td className="py-3 text-right">
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-right text-slate-700"
                                                value={item.unitPrice}
                                                onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                                            />
                                        </td>
                                        <td className="py-3 text-right font-medium text-slate-900">
                                            ${item.amount.toFixed(2)}
                                        </td>
                                        <td className="py-3 text-center">
                                            <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4">
                            <button
                                onClick={addItem}
                                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Line Item
                            </button>
                        </div>
                    </div>

                    {/* Footer / Results */}
                    <div className="flex flex-col md:flex-row justify-between gap-12">
                        {/* Notes Section */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                <textarea
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                    rows={3}
                                    placeholder="Thank you for your business..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Terms & Conditions</label>
                                <textarea
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                                    rows={2}
                                    value={formData.terms}
                                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="w-full md:w-80 space-y-3">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 items-center">
                                <span>Tax Rate (%)</span>
                                <input
                                    type="number"
                                    className="w-16 text-right rounded border-slate-200 text-xs py-1"
                                    value={formData.taxRate}
                                    onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Tax Amount</span>
                                <span>${calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 items-center">
                                <span>Discount</span>
                                <input
                                    type="number"
                                    className="w-20 text-right rounded border-slate-200 text-xs py-1"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                                />
                            </div>
                            <div className="h-px bg-slate-200 my-2"></div>
                            <div className="flex justify-between text-xl font-bold text-slate-900">
                                <span>Total</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateInvoicePage;

