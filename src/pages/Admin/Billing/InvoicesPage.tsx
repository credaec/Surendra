import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InvoiceKPICards from '../../../components/admin/billing/InvoiceKPICards';
import InvoiceFilters, { type InvoiceFilterState } from '../../../components/admin/billing/InvoiceFilters';
import InvoicesTable from '../../../components/admin/billing/InvoicesTable';
import { mockBackend, type Invoice } from '../../../services/mockBackend';

const InvoicesPage: React.FC = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Filter State
    const [filters, setFilters] = useState<InvoiceFilterState>({
        dateRange: 'this_month',
        clientIds: [],
        projectIds: [],
        status: 'ALL',
        paymentStatus: 'ALL',
        currency: 'ALL',
        type: 'ALL',
        searchQuery: ''
    });

    useEffect(() => {
        // Load initial data
        const data = mockBackend.getInvoices();
        setInvoices(data);
    }, []);

    useEffect(() => {
        // Apply filters
        let result = invoices;

        if (filters.status !== 'ALL') {
            result = result.filter(inv => inv.status === filters.status);
        }

        if (filters.paymentStatus !== 'ALL') {
            if (filters.paymentStatus === 'UNPAID') {
                result = result.filter(inv => inv.status !== 'PAID');
            } else if (filters.paymentStatus === 'PAID') {
                result = result.filter(inv => inv.status === 'PAID');
            } else {
                result = result.filter(inv => inv.status === 'PARTIAL');
            }
        }

        if (filters.currency !== 'ALL') {
            result = result.filter(inv => inv.currency === filters.currency);
        }

        if (filters.type !== 'ALL') {
            result = result.filter(inv => inv.type === filters.type);
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(inv =>
                inv.invoiceNo.toLowerCase().includes(query) ||
                inv.clientName.toLowerCase().includes(query) ||
                inv.projectName.toLowerCase().includes(query)
            );
        }

        // Date range logic (simplified for mock)
        if (filters.dateRange === 'this_month') {
            // Mock: just filter strictly by string match for now or real date logic
            // For simplicity in mock, skipping precise date logic
        }

        setFilteredInvoices(result);
    }, [invoices, filters]);

    const handleCreateInvoice = () => {
        navigate('/admin/billing/invoices/create');
    };

    const handleViewInvoice = (id: string) => {
        navigate(`/admin/billing/invoices/${id}`);
    };

    const handleEditInvoice = (id: string) => {
        // In real app, check status first
        navigate(`/admin/billing/invoices/${id}`); // Reuse detail page for editing for now
    };

    const handleSendInvoice = (id: string) => {
        mockBackend.updateInvoiceStatus(id, 'SENT');
        const updated = mockBackend.getInvoices();
        setInvoices(updated);
        // Toast notification
    };

    const handleMarkPayment = (id: string) => {
        // Open payment modal or navigate to payment tab
        navigate(`/admin/billing/invoices/${id}?tab=payments`);
    };

    const handleDeleteInvoice = () => {
        // Logic to delete using mockBackend (not implemented in mockBackend yet, assuming just frontend remove for demo)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Invoices & Billing</h1>
                    <p className="text-slate-500 mt-1">Manage client invoicing, track payments, and monitor revenue.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 shadow-sm transition-colors text-sm font-medium">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </button>
                    <button
                        onClick={handleCreateInvoice}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm font-medium"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Invoice
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <InvoiceKPICards
                invoices={invoices}
                activeFilter={filters.status}
                onFilterStatus={(status) => setFilters(prev => ({ ...prev, status }))}
            />

            {/* Filters */}
            <InvoiceFilters
                filters={filters}
                onFilterChange={setFilters}
            />

            {/* Table */}
            <InvoicesTable
                data={filteredInvoices}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onView={handleViewInvoice}
                onEdit={handleEditInvoice}
                onSend={handleSendInvoice}
                onMarkPayment={handleMarkPayment}
                onDelete={handleDeleteInvoice}
            />
        </div>
    );
};

export default InvoicesPage;
