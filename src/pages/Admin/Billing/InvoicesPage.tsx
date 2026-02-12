import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, RotateCcw, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InvoiceKPICards from '../../../components/admin/billing/InvoiceKPICards';
import InvoiceFilters, { type InvoiceFilterState } from '../../../components/admin/billing/InvoiceFilters';
import InvoicesTable from '../../../components/admin/billing/InvoicesTable';
import { backendService, type Invoice } from '../../../services/backendService';
import type { Client, Project } from '../../../types/schema';
import SendInvoiceModal from '../../../components/admin/billing/SendInvoiceModal';
import { useToast } from '../../../context/ToastContext';
import { cn } from '../../../lib/utils';

const InvoicesPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Trash State
    const [showTrash, setShowTrash] = useState(false);

    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    // Modal State
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [actionInvoice, setActionInvoice] = useState<Invoice | null>(null);

    // Filter State
    const DEFAULT_FILTERS: InvoiceFilterState = {
        dateRange: 'this_month',
        clientIds: [],
        projectIds: [],
        status: 'ALL',
        paymentStatus: 'ALL',
        currency: 'ALL',
        type: 'ALL',
        searchQuery: ''
    };

    // pendingFilters controls the UI inputs
    // activeFilters controls the actual list data
    const [pendingFilters, setPendingFilters] = useState<InvoiceFilterState>(DEFAULT_FILTERS);
    const [activeFilters, setActiveFilters] = useState<InvoiceFilterState>(DEFAULT_FILTERS);

    useEffect(() => {
        // Load saved view on mount
        const saved = localStorage.getItem('credence_invoice_filters');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPendingFilters(parsed);
                setActiveFilters(parsed); // Apply saved filters immediately on load
            } catch (e) {
                console.error("Failed to parse saved invoice filters", e);
            }
        }
    }, []);

    useEffect(() => {
        // Load initial data
        const data = backendService.getInvoices();
        setInvoices(data);
        setClients(backendService.getClients());
        setProjects(backendService.getProjects());
    }, []);

    useEffect(() => {
        // Apply filters based on ACTIVE filters only
        let result = invoices;

        // Filter by deleted status
        if (showTrash) {
            result = result.filter(inv => inv.isDeleted);
        } else {
            result = result.filter(inv => !inv.isDeleted);
        }

        const f = activeFilters; // shortcut

        if (!showTrash) { // Only apply standard filters on active list
            if (f.status !== 'ALL') {
                result = result.filter(inv => inv.status === f.status);
            }
            if (f.paymentStatus !== 'ALL') {
                if (f.paymentStatus === 'UNPAID') result = result.filter(inv => inv.status !== 'PAID');
                else if (f.paymentStatus === 'PAID') result = result.filter(inv => inv.status === 'PAID');
                else result = result.filter(inv => inv.status === 'PARTIAL');
            }
            if (f.currency !== 'ALL') result = result.filter(inv => inv.currency === f.currency);
            if (f.type !== 'ALL') result = result.filter(inv => inv.type === f.type);
            if (f.clientIds.length > 0) result = result.filter(inv => f.clientIds.includes(inv.clientId));
            if (f.projectIds.length > 0) result = result.filter(inv => inv.projectId && f.projectIds.includes(inv.projectId));
        }

        // Search works in both
        if (f.searchQuery) {
            const query = f.searchQuery.toLowerCase();
            result = result.filter(inv =>
                inv.invoiceNo.toLowerCase().includes(query) ||
                inv.clientName.toLowerCase().includes(query) ||
                inv.projectName.toLowerCase().includes(query)
            );
        }

        setFilteredInvoices(result);
    }, [invoices, activeFilters, showTrash]);

    const handleCreateInvoice = () => {
        navigate('/admin/billing/invoices/create');
    };

    const handleViewInvoice = (id: string) => {
        navigate(`/admin/billing/invoices/${id}`);
    };

    const handleEditInvoice = (id: string) => {
        navigate(`/admin/billing/invoices/${id}`);
    };

    const handleSendInvoice = (id: string) => {
        const inv = invoices.find(i => i.id === id);
        if (inv) {
            setActionInvoice(inv);
            setIsSendModalOpen(true);
        }
    };

    const handleConfirmSend = async (email: string, subject: string, message: string) => {
        if (actionInvoice) {
            try {
                await backendService.sendInvoiceEmail(actionInvoice.id, email, subject, message);
                await backendService.initialize(); // Re-sync to get updated status
                const updated = backendService.getInvoices();
                setInvoices(updated);
                showToast(`Invoice ${actionInvoice.invoiceNo} sent to ${email} successfully!`, 'success');
                setIsSendModalOpen(false);
                setActionInvoice(null);
            } catch (error) {
                console.error(error);
                showToast('Failed to send email. Please check Email Settings.', 'error');
            }
        }
    };

    const handleMarkPayment = (id: string) => {
        navigate(`/admin/billing/invoices/${id}?tab=payments`);
    };

    const handleDeleteInvoice = async (id: string) => {
        if (showTrash) {
            // Permanent Delete
            if (window.confirm('This will permanently delete the invoice. Cannot be undone. Continue?')) {
                await backendService.deleteInvoice(id);
                setInvoices(prev => prev.filter(inv => inv.id !== id));
                showToast('Invoice permanently deleted.', 'success');
            }
        } else {
            // Soft Delete
            if (window.confirm('Move this invoice to Trash?')) {
                await backendService.softDeleteInvoice(id);
                setInvoices(prev => prev.map(inv =>
                    inv.id === id ? { ...inv, isDeleted: true } : inv
                ));
                showToast('Invoice moved to Trash.', 'info');
            }
        }
    };

    const handleRestoreInvoice = async (id: string) => {
        await backendService.restoreInvoice(id);
        setInvoices(prev => prev.map(inv =>
            inv.id === id ? { ...inv, isDeleted: false } : inv
        ));
        showToast('Invoice restored successfully!', 'success');
    };

    const handleExportReport = () => {
        const headers = ['Invoice No', 'Client', 'Project', 'Date', 'Due Date', 'Amount', 'Status'];
        const rows = filteredInvoices.map(inv => [
            inv.invoiceNo,
            inv.clientName,
            inv.projectName,
            inv.date,
            inv.dueDate,
            inv.totalAmount,
            inv.status
        ]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleDownloadPDF = (id: string) => {
        const invoice = invoices.find(inv => inv.id === id);
        if (invoice) {
            // Simplified PDF Generation using Window.print approach
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
                            
                            <p><strong>Bill To:</strong> ${invoice.clientName}</p>
                            <p><strong>Project:</strong> ${invoice.projectName}</p>
                            
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
        }
    };

    const handleResetFilters = () => {
        setPendingFilters(DEFAULT_FILTERS);
        setActiveFilters(DEFAULT_FILTERS);
    };

    const handleSaveView = () => {
        localStorage.setItem('credence_invoice_filters', JSON.stringify(pendingFilters));
        alert('View configuration saved successfully!');
    };

    const handleApplyFilters = () => {
        setActiveFilters(pendingFilters);
    };

    // Helper to get client email
    const getClientEmail = () => {
        if (!actionInvoice) return '';
        const client = clients.find(c => c.id === actionInvoice.clientId);
        return client?.email || '';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {showTrash ? 'Trash Bin' : 'Invoices & Billing'}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                        {showTrash ? 'Manage and restore deleted invoices.' : 'Manage client invoicing, track payments, and monitor revenue.'}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowTrash(!showTrash)}
                        className={cn(
                            "flex items-center px-4 py-2.5 rounded-xl border font-bold text-sm transition-all duration-200",
                            showTrash
                                ? "bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 shadow-lg shadow-slate-500/10"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        )}
                    >
                        {showTrash ? <RotateCcw className="h-4 w-4 mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                        {showTrash ? 'Back to Invoices' : 'Trash Bin'}
                    </button>

                    {!showTrash && (
                        <>
                            <button
                                onClick={handleExportReport}
                                className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm font-bold shadow-sm"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export Report
                            </button>
                            <button
                                onClick={handleCreateInvoice}
                                className="flex items-center px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all text-sm font-bold active:scale-95"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Invoice
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* KPIs - Hide in Trash Mode */}
            {!showTrash && (
                <InvoiceKPICards
                    invoices={invoices.filter(i => !i.isDeleted)}
                    activeFilter={activeFilters.status}
                    onFilterStatus={(status) => {
                        setPendingFilters(prev => ({ ...prev, status }));
                        setActiveFilters(prev => ({ ...prev, status }));
                    }}
                />
            )}

            {/* Filters - Hide in Trash Mode? Or simplified? Let's hide for now to focus on the list */}
            {!showTrash && (
                <InvoiceFilters
                    filters={pendingFilters}
                    clients={clients}
                    projects={projects}
                    onFilterChange={setPendingFilters}
                    onReset={handleResetFilters}
                    onSaveView={handleSaveView}
                    onApply={handleApplyFilters}
                />
            )}

            <InvoicesTable
                data={filteredInvoices}
                selectedIds={selectedIds}
                onSelect={(id) => {
                    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                }}
                onSelectAll={(ids) => setSelectedIds(ids)}
                onView={handleViewInvoice}
                onEdit={handleEditInvoice}
                onSend={handleSendInvoice}
                onMarkPayment={handleMarkPayment}
                onDelete={handleDeleteInvoice} // This handles Permanent Delete in Trash Mode
                onDownload={handleDownloadPDF}

                // New props for trash support
                isTrashMode={showTrash}
                onRestore={handleRestoreInvoice}
            />
            {/* Modal */}
            <SendInvoiceModal
                isOpen={isSendModalOpen}
                onClose={() => setIsSendModalOpen(false)}
                onSend={handleConfirmSend}
                invoiceNo={actionInvoice?.invoiceNo || ''}
                clientEmail={getClientEmail()}
            />
        </div>
    );
};

export default InvoicesPage;

