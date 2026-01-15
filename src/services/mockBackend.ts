import type { Project, Client, Task, TaskCategory, TimeEntry, AvailabilityEvent } from '../types/schema';

// --- Types ---
// Project imported from schema

export interface UserStatus {
    userId: string;
    isOnline: boolean;
    lastActive: string; // ISO string
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
    designation: string;
    department: string;
    avatarInitials: string;
    status: 'ACTIVE' | 'INACTIVE';
    hourlyCostRate?: number;
}

export interface ApprovalRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    avatarInitials: string;
    weekRange: string; // e.g., "Jan 01 - Jan 07, 2024"
    submittedOn: string;
    status: 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'OVERDUE';
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    projectCount: number;
    projects: string[]; // List of project names involved
    approvedBy?: string;
    lastUpdated?: string;
    remarks?: string; // Rejection reason or approval note
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number; // Hours or Qty
    unitPrice: number; // Rate
    amount: number;
    timeEntryId?: string; // Link to time entry if timesheet based
}

export interface PaymentRecord {
    id: string;
    amount: number;
    date: string;
    mode: 'BANK_TRANSFER' | 'UPI' | 'CASH' | 'CHEQUE' | 'ONLINE';
    referenceNo?: string;
    notes?: string;
}

// AvailabilityEvent imported from schema

export interface Invoice {
    id: string;
    invoiceNo: string;
    clientId: string;
    clientName: string;
    projectId: string;
    projectName: string;
    date: string;
    dueDate: string;
    currency: 'USD' | 'INR';
    status: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
    items: InvoiceItem[];
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    notes?: string;
    createdBy: string;
    createdAt: string;
    payments: PaymentRecord[];
    type: 'TIMESHEET' | 'FIXED';
}

export interface EmployeeRate {
    id: string;
    employeeId: string;
    employeeName: string;
    hourlyRate: number;
    currency: 'USD' | 'INR';
    effectiveFrom: string;
}

export interface PayrollRecord {
    id: string;
    payrollRunId: string;
    employeeId: string;
    employeeName: string;
    designation: string;
    department: string;
    joinDate: string;
    totalHours: number;
    approvedHours: number;
    billableHours: number;
    nonBillableHours: number;
    rateType: 'HOURLY' | 'MONTHLY';
    hourlyRate: number;
    basePay: number; // approvedHours * hourlyRate
    overtimeHours: number;
    overtimeAmount: number;
    deductions: number;
    bonus: number;
    totalPayable: number;
    status: 'DRAFT' | 'APPROVED' | 'PAID' | 'HOLD';
}

export interface PayrollRun {
    id: string;
    period: string; // "Jan 2026"
    status: 'DRAFT' | 'LOCKED' | 'PAID';
    totalEmployees: number;
    totalPayable: number;
    totalApprovedHours: number;
    generatedAt: string;
    generatedBy: string;
    isLocked: boolean;
}



// --- Mock Data Constants ---

const MOCK_AVAILABILITY_EVENTS: AvailabilityEvent[] = [
    {
        id: 'h1',
        type: 'HOLIDAY',
        subType: 'NATIONAL',
        title: 'Republic Day',
        startDate: '2026-01-26',
        endDate: '2026-01-26',
        notes: 'National Holiday',
        createdBy: 'Admin',
        createdAt: '2025-12-01'
    },
    {
        id: 'l1',
        type: 'LEAVE',
        subType: 'CASUAL',
        title: 'Rahul Sharma', // In real app, derived from resourceId
        resourceId: 'emp_rahul',
        startDate: '2026-01-22',
        endDate: '2026-01-24',
        notes: 'Personal work',
        createdBy: 'Admin',
        createdAt: '2026-01-10'
    },
    {
        id: 'l2',
        type: 'LEAVE',
        subType: 'SICK',
        title: 'Sarah Jenkins',
        resourceId: 'emp_sarah',
        startDate: '2026-01-28',
        endDate: '2026-01-28',
        notes: 'Doctor appointment',
        createdBy: 'System',
        createdAt: '2026-01-12'
    }
];

const MOCK_EMPLOYEE_RATES: EmployeeRate[] = [
    { id: 'rate_1', employeeId: 'CRED001', employeeName: 'John Doe', hourlyRate: 50, currency: 'USD', effectiveFrom: '2025-01-01' },
    { id: 'rate_2', employeeId: 'CRED002', employeeName: 'Jane Smith', hourlyRate: 45, currency: 'USD', effectiveFrom: '2025-01-01' },
    { id: 'rate_3', employeeId: 'CRED023', employeeName: 'Ajith Ravirekhala', hourlyRate: 2000, currency: 'INR', effectiveFrom: '2025-01-01' }
];

const MOCK_PAYROLL_RUNS: PayrollRun[] = [
    {
        id: 'run_jan_2026',
        period: 'Jan 2026',
        status: 'DRAFT',
        totalEmployees: 12,
        totalPayable: 45000,
        totalApprovedHours: 1200,
        generatedAt: '2026-02-01T10:00:00Z',
        generatedBy: 'Admin',
        isLocked: false
    }
];

const MOCK_PAYROLL_RECORDS: PayrollRecord[] = [
    {
        id: 'pr_001',
        payrollRunId: 'run_jan_2026',
        employeeId: 'CRED001',
        employeeName: 'John Doe',
        designation: 'Senior Engineer',
        department: 'Engineering',
        joinDate: '2024-03-15',
        totalHours: 168,
        approvedHours: 160,
        billableHours: 120,
        nonBillableHours: 40,
        rateType: 'HOURLY',
        hourlyRate: 50,
        basePay: 8000,
        overtimeHours: 8,
        overtimeAmount: 600, // 1.5x
        deductions: 0,
        bonus: 0,
        totalPayable: 8600,
        status: 'DRAFT'
    },
    {
        id: 'pr_002',
        payrollRunId: 'run_jan_2026',
        employeeId: 'CRED023',
        employeeName: 'Ajith Ravirekhala',
        designation: 'Architect',
        department: 'Design',
        joinDate: '2023-01-10',
        totalHours: 150,
        approvedHours: 140,
        billableHours: 100,
        nonBillableHours: 40,
        rateType: 'HOURLY',
        hourlyRate: 2000,
        basePay: 280000,
        overtimeHours: 0,
        overtimeAmount: 0,
        deductions: 5000, // Tax example
        bonus: 10000,
        totalPayable: 285000,
        status: 'DRAFT'
    }
];

const DEFAULT_ENTRY_RULES = {
    notesRequired: false,
    proofRequired: false,
    minTimeUnit: 15 as const,
    allowFutureEntry: false,
    allowBackdatedEntry: true
};

const DEFAULT_ALERTS = {
    budgetThresholdPct: 80,
    deadlineAlertDays: 7
};

const MOCK_PROJECTS: Project[] = [
    {
        id: 'p1',
        code: 'PRJ-001',
        name: 'BCS Skylights',
        clientId: 'c1',
        clientName: 'Boston Construction Services',
        status: 'ACTIVE',
        type: 'HOURLY',
        priority: 'MEDIUM',
        startDate: '2026-01-01',
        currency: 'USD',
        estimatedHours: 500,
        billingMode: 'HOURLY_RATE',
        rateLogic: 'GLOBAL_PROJECT_RATE',
        globalRate: 85,
        teamMembers: [],
        entryRules: DEFAULT_ENTRY_RULES,
        alerts: DEFAULT_ALERTS,
        usedHours: 120,
        billableHours: 100
    },
    {
        id: 'p2',
        code: 'PRJ-002',
        name: 'Dr. Wade Residence',
        clientId: 'c2',
        clientName: 'Dr. Emily Wade',
        status: 'ACTIVE',
        type: 'FIXED',
        priority: 'HIGH',
        startDate: '2025-11-15',
        currency: 'USD',
        estimatedHours: 200,
        billingMode: 'FIXED_FEE',
        budgetAmount: 15000,
        rateLogic: 'GLOBAL_PROJECT_RATE',
        teamMembers: [],
        entryRules: DEFAULT_ENTRY_RULES,
        alerts: DEFAULT_ALERTS,
        usedHours: 45,
        billableHours: 45
    },
    {
        id: 'p3',
        code: 'INT-001',
        name: 'Internal Training',
        clientId: 'internal',
        clientName: 'Credence Internal',
        status: 'ACTIVE',
        type: 'INTERNAL',
        priority: 'LOW',
        startDate: '2025-01-01',
        currency: 'USD',
        estimatedHours: 1000,
        billingMode: 'HOURLY_RATE',
        rateLogic: 'CATEGORY_BASED_RATE',
        teamMembers: [],
        entryRules: DEFAULT_ENTRY_RULES,
        alerts: DEFAULT_ALERTS,
        usedHours: 350,
        billableHours: 0
    },
    {
        id: 'p4',
        code: 'PRJ-003',
        name: 'City Mall Expansion',
        clientId: 'c3',
        clientName: 'Urban Developers',
        status: 'COMPLETED',
        type: 'HOURLY',
        priority: 'CRITICAL',
        startDate: '2025-06-01',
        endDate: '2025-12-31',
        currency: 'INR',
        estimatedHours: 2000,
        billingMode: 'HOURLY_RATE',
        rateLogic: 'EMPLOYEE_BASED_RATE',
        teamMembers: [],
        entryRules: DEFAULT_ENTRY_RULES,
        alerts: DEFAULT_ALERTS,
        usedHours: 1980,
        billableHours: 1900
    },
];

const STORAGE_KEYS = {
    ENTRIES: 'credence_entries_v1',
    ACTIVE_TIMER: 'credence_active_timer_v1', // Simple single active timer per user for MVP
    USERS: 'credence_users_v2',
    PROJECTS: 'credence_projects_v1',
    CLIENTS: 'credence_clients_v1',
    TASKS: 'credence_tasks_v1',
};

// --- Mock Data Constants ---
const MOCK_CLIENTS: Client[] = [
    {
        id: 'c1',
        name: 'Boston Construction Services',
        companyName: 'Boston Construction Services',
        email: 'contact@bcs.com',
        status: 'ACTIVE',
        currency: 'USD',
        totalProjects: 2
    },
    {
        id: 'c2',
        name: 'Dr. Emily Wade',
        companyName: 'Wade Residence',
        email: 'emily@wade.com',
        status: 'ACTIVE',
        currency: 'USD',
        totalProjects: 1
    }
];

const MOCK_TASKS: Task[] = [
    {
        id: 't1',
        projectId: 'p1',
        title: 'Initial Structural Analysis',
        categoryId: 'cat_eng',
        status: 'COMPLETED',
        priority: 'HIGH'
    },
    {
        id: 't2',
        projectId: 'p1',
        title: 'Drafting Foundation Details',
        categoryId: 'cat_draft',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM'
    }
];

const MOCK_TASK_CATEGORIES: TaskCategory[] = [
    { id: '1', name: 'Engineering Design', isBillable: true, isProofRequired: false, isNotesRequired: true, restrictedToProjects: [] },
    { id: '2', name: 'Drafting', isBillable: true, isProofRequired: true, isNotesRequired: true, restrictedToProjects: [] },
    { id: '3', name: 'Modelling (RISA/ETABS)', isBillable: true, isProofRequired: true, isNotesRequired: true, restrictedToProjects: [] },
    { id: '4', name: 'Review & Coordination', isBillable: true, isProofRequired: false, isNotesRequired: true, restrictedToProjects: [] },
    { id: '5', name: 'Client Calls', isBillable: true, isProofRequired: false, isNotesRequired: true, restrictedToProjects: [] },
    { id: '6', name: 'Internal Meeting', isBillable: false, isProofRequired: false, isNotesRequired: false, restrictedToProjects: [] },
    { id: '7', name: 'Training', isBillable: false, isProofRequired: false, isNotesRequired: false, restrictedToProjects: [] },
    { id: '8', name: 'Rework / Revisions', isBillable: false, defaultRate: 0, isProofRequired: true, isNotesRequired: true, restrictedToProjects: [] },
];
const MOCK_USERS: User[] = [
    {
        id: 'CRED001/06-22',
        name: 'DHIRAJ VASU',
        email: 'dhiraj@credaec.in',
        role: 'ADMIN',
        department: 'TOP MANAGEMENT',
        designation: 'CO-FOUNDER & CEO',
        avatarInitials: 'DV',
        status: 'ACTIVE'
    },
    {
        id: 'CRED002/06-22',
        name: 'GAURAV KUMAR',
        email: 'gaurav@credaec.in',
        role: 'ADMIN',
        department: 'TOP MANAGEMENT',
        designation: 'CO-FOUNDER & COO',
        avatarInitials: 'GK',
        status: 'ACTIVE'
    },
    {
        id: 'CRED003/02-24',
        name: 'YOGESH DABHOLE',
        email: 'yogesh@credaec.in',
        role: 'ADMIN',
        department: 'TOP MANAGEMENT',
        designation: 'CO-FOUNDER & MD',
        avatarInitials: 'YD',
        status: 'ACTIVE'
    },
    {
        id: 'CRED004/08-22',
        name: 'NARESH PRAJAPATI',
        email: 'naresh@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'SR. STRUCTURAL DESIGN ENGINEER',
        avatarInitials: 'NP',
        status: 'ACTIVE'
    },
    {
        id: 'CRED006/02-24',
        name: 'ABHISHEK JONDHALEKAR',
        email: 'abhishek@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'SR. STRUCTURAL CAD ENGINEER',
        avatarInitials: 'AJ',
        status: 'ACTIVE'
    },
    {
        id: 'CRED007/05-24',
        name: 'RAJNANDINI LAD',
        email: 'rajnandini@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. STRUCTURAL CAD ENGINEER',
        avatarInitials: 'RL',
        status: 'ACTIVE'
    },
    {
        id: 'CRED008/10-24',
        name: 'SWANAND PATIL',
        email: 'swanand@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. BIM ENGINEER',
        avatarInitials: 'SP',
        status: 'ACTIVE'
    },
    {
        id: 'CRED009/12-24',
        name: 'PALLAVI SHENAVI',
        email: 'pallavi@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'SR. STRUCTURAL ENGINEER',
        avatarInitials: 'PS',
        status: 'ACTIVE'
    },
    {
        id: 'CRED010/01-25',
        name: 'SOHEL NADAF',
        email: 'sohel@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'SR. STRUCTURAL ENGINEER',
        avatarInitials: 'SN',
        status: 'ACTIVE'
    },
    {
        id: 'CRED011/03-25',
        name: 'SHRIPAD MIRAJKAR',
        email: 'shripad@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'SR. STRUCTURAL CAD ENGINEER',
        avatarInitials: 'SM',
        status: 'ACTIVE'
    },
    {
        id: 'CRED012/06-25',
        name: 'DISHA PATIL',
        email: 'disha@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. STRUCTURAL ENGINEER',
        avatarInitials: 'DP',
        status: 'ACTIVE'
    },
    {
        id: 'CRED013/06-25',
        name: 'PRERANA SHINDE',
        email: 'prerana@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. STRUCTURAL ENGINEER',
        avatarInitials: 'PS',
        status: 'ACTIVE'
    },
    {
        id: 'CRED014/06-25',
        name: 'PRANALI PATIL',
        email: 'pranali@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. STRUCTURAL ENGINEER',
        avatarInitials: 'PP',
        status: 'ACTIVE'
    },
    {
        id: 'CRED015/06-25',
        name: 'ROHIT MORE',
        email: 'rohit@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. STRUCTURAL CAD ENGINEER',
        avatarInitials: 'RM',
        status: 'ACTIVE'
    },
    {
        id: 'CRED019/07-25',
        name: 'MOHAMMED RATLAMWALA',
        email: 'mohammed@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. STRUCTURAL ENGINEER',
        avatarInitials: 'MR',
        status: 'ACTIVE'
    },
    {
        id: 'CRED020/08-25',
        name: 'KAILAS MIRAJKAR',
        email: 'kailas@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. STRUCTURAL CAD ENGINEER',
        avatarInitials: 'KM',
        status: 'ACTIVE'
    },
    {
        id: 'CRED022/01-26',
        name: 'SURENDRA CHAUHAN',
        email: 'surendra@credaec.in',
        role: 'ADMIN',
        department: 'MANAGEMENT',
        designation: 'JR. BUSINESS OPERATION EXECUTIVE',
        avatarInitials: 'SC',
        status: 'ACTIVE'
    },
    {
        id: 'CRED023/02-26',
        name: 'AJITH RAVIREKHALA',
        email: 'ajith@credaec.in',
        role: 'EMPLOYEE',
        department: 'STRUCTURAL DIVISION',
        designation: 'JR. STRUCTURAL ENGINEER',
        avatarInitials: 'AR',
        status: 'ACTIVE'
    }
];

// --- Service Implementation ---
export const mockBackend = {
    // 0. Users
    // 0. Users (Moved to User Management section below)


    // 1. Projects
    getProjects: (): Project[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        if (stored) return JSON.parse(stored);

        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_PROJECTS));
        return MOCK_PROJECTS;
    },

    addProject: (project: Omit<Project, 'id' | 'usedHours' | 'billableHours'>): Project => {
        const projects = mockBackend.getProjects();
        const newProject: Project = {
            ...project as Project,
            id: `PROJ-${Date.now()}`,
            usedHours: 0,
            billableHours: 0
        };
        projects.push(newProject);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

        // NOTIFICATION LOGIC: Notify assigned members
        if (newProject.teamMembers && newProject.teamMembers.length > 0) {
            newProject.teamMembers.forEach(member => {
                const user = mockBackend.getUsers().find(u => u.id === member.userId);
                if (user) {
                    console.log(`[Representing Email Service] Sending email to ${user.email}: You have been assigned to project "${newProject.name}"`);
                    if (mockBackend.addNotification) {
                        mockBackend.addNotification(member.userId, 'Project Assigned', `You have been assigned to project: ${newProject.name}`);
                    }
                }
            });
        }
        return newProject;
    },

    getProjectById: (id: string): Project | undefined => {
        return mockBackend.getProjects().find(p => p.id === id);
    },

    // 1.d Notifications (New)
    getNotifications: (userId: string) => {
        const stored = localStorage.getItem('credence_notifications');
        const all: any[] = stored ? JSON.parse(stored) : [];
        return all.filter(n => n.userId === userId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    addNotification: (userId: string, title: string, message: string) => {
        const stored = localStorage.getItem('credence_notifications');
        const all: any[] = stored ? JSON.parse(stored) : [];

        const newNotification = {
            id: `notif_${Date.now()}_${Math.random()}`,
            userId,
            title,
            message,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        all.push(newNotification);
        localStorage.setItem('credence_notifications', JSON.stringify(all));
        return newNotification;
    },

    markNotificationRead: (id: string) => {
        const stored = localStorage.getItem('credence_notifications');
        if (!stored) return;
        const all: any[] = JSON.parse(stored);
        const index = all.findIndex((n: any) => n.id === id);
        if (index > -1) {
            all[index].isRead = true;
            localStorage.setItem('credence_notifications', JSON.stringify(all));
        }
    },

    // 1.0.1 Invoices (New)
    getInvoices: (): Invoice[] => {
        const stored = localStorage.getItem('credence_invoices_v1');
        if (stored) return JSON.parse(stored);

        // Mock Invoices
        const MOCK_INVOICES: Invoice[] = [
            {
                id: 'inv_001',
                invoiceNo: 'INV-2026-001',
                clientId: 'c1',
                clientName: 'Boston Construction Services',
                projectId: 'p1',
                projectName: 'BCS Skylights',
                date: '2026-01-10',
                dueDate: '2026-01-25',
                currency: 'USD',
                status: 'SENT',
                items: [
                    { id: '1', description: 'Structural Analysis', quantity: 40, unitPrice: 85, amount: 3400 },
                    { id: '2', description: 'CAD Modeling', quantity: 10, unitPrice: 80, amount: 800 }
                ],
                subtotal: 4200,
                taxAmount: 0,
                totalAmount: 4200,
                paidAmount: 0,
                balanceAmount: 4200,
                createdBy: 'Admin',
                createdAt: '2026-01-10',
                payments: [],
                type: 'TIMESHEET'
            },
            {
                id: 'inv_002',
                invoiceNo: 'INV-2026-002',
                clientId: 'c2',
                clientName: 'Dr. Emily Wade',
                projectId: 'p2',
                projectName: 'Dr. Wade Residence',
                date: '2025-12-28',
                dueDate: '2026-01-12',
                currency: 'USD',
                status: 'PARTIAL',
                items: [
                    { id: '1', description: 'Phase 1 Completion', quantity: 1, unitPrice: 1500, amount: 1500 }
                ],
                subtotal: 1500,
                taxAmount: 0,
                totalAmount: 1500,
                paidAmount: 500,
                balanceAmount: 1000,
                createdBy: 'Admin',
                createdAt: '2025-12-28',
                payments: [{ id: 'pay_1', amount: 500, date: '2026-01-05', mode: 'ONLINE' }],
                type: 'FIXED'
            }
        ];

        localStorage.setItem('credence_invoices_v1', JSON.stringify(MOCK_INVOICES));
        return MOCK_INVOICES;
    },

    addInvoice: (invoice: Partial<Invoice> & { amount: number, items: any[] }): Invoice => {
        const invoices = mockBackend.getInvoices();
        const newInvoice: Invoice = {
            id: `inv_${Date.now()}`,
            invoiceNo: invoice.invoiceNo || 'INV-DRAFT',
            clientId: invoice.clientId || '',
            clientName: invoice.clientName || '',
            projectId: invoice.projectId || '',
            projectName: invoice.projectName || '',
            date: invoice.date || new Date().toISOString(),
            dueDate: invoice.dueDate || '',
            currency: invoice.currency || 'USD',
            status: invoice.status || 'DRAFT',
            items: invoice.items.map((i: any, idx: number) => ({
                id: i.id || `item_${Date.now()}_${idx}`,
                description: i.description,
                quantity: i.quantity || 1,
                unitPrice: i.unitPrice || 0,
                amount: i.amount
            })),
            subtotal: invoice.amount,
            taxAmount: 0,
            totalAmount: invoice.amount,
            paidAmount: 0,
            balanceAmount: invoice.amount,
            createdBy: 'Admin',
            createdAt: new Date().toISOString(),
            payments: [],
            type: 'FIXED',
            notes: invoice.notes
        };
        invoices.unshift(newInvoice);
        localStorage.setItem('credence_invoices_v1', JSON.stringify(invoices));
        return newInvoice;
    },

    updateInvoiceStatus: (id: string, status: Invoice['status']) => {
        const invoices = mockBackend.getInvoices();
        const index = invoices.findIndex(i => i.id === id);
        if (index > -1) {
            invoices[index].status = status;
            localStorage.setItem('credence_invoices_v1', JSON.stringify(invoices));
        }
    },

    // 1.a Clients (New)
    getClients: (): Client[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
        if (stored) return JSON.parse(stored);

        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(MOCK_CLIENTS));
        return MOCK_CLIENTS;
    },

    addClient: (client: Omit<Client, 'id' | 'totalProjects'>): Client => {
        const clients = mockBackend.getClients();
        const newClient: Client = {
            ...client,
            id: `c_${Date.now()}`,
            totalProjects: 0
        };
        clients.push(newClient);
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        return newClient;
    },

    updateClient: (id: string, updates: Partial<Client>): Client | null => {
        const clients = mockBackend.getClients();
        const index = clients.findIndex(c => c.id === id);
        if (index === -1) return null;

        clients[index] = { ...clients[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        return clients[index];
    },

    // 1.b Tasks (New)
    getTasks: (): Task[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
        if (stored) return JSON.parse(stored);

        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(MOCK_TASKS));
        return MOCK_TASKS;
    },

    addTask: (task: Omit<Task, 'id'>): Task => {
        const tasks = mockBackend.getTasks();
        const newTask: Task = {
            ...task,
            id: `t_${Date.now()}`
        };
        tasks.push(newTask);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        return newTask;
    },

    // 1.c Task Categories (New)
    getTaskCategories: (): TaskCategory[] => {
        const stored = localStorage.getItem('credence_task_categories_v1');
        if (stored) return JSON.parse(stored);

        localStorage.setItem('credence_task_categories_v1', JSON.stringify(MOCK_TASK_CATEGORIES));
        return MOCK_TASK_CATEGORIES;
    },

    addTaskCategory: (category: Omit<TaskCategory, 'id'>): TaskCategory => {
        const categories = mockBackend.getTaskCategories();
        const newCategory: TaskCategory = {
            ...category,
            id: `cat_${Date.now()}`
        };
        categories.push(newCategory);
        localStorage.setItem('credence_task_categories_v1', JSON.stringify(categories));
        return newCategory;
    },

    // 2. Time Entries (History)
    getEntries: (userId?: string): TimeEntry[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.ENTRIES);
        const entries: TimeEntry[] = stored ? JSON.parse(stored) : [];
        if (userId) {
            return entries.filter(e => e.userId === userId);
        }
        return entries;
    },

    getPendingEntries: (): TimeEntry[] => {
        const entries = mockBackend.getEntries();
        return entries.filter(e => e.status === 'SUBMITTED');
    },

    addEntry: (entry: Omit<TimeEntry, 'id' | 'status'> & { status?: TimeEntry['status'] }) => {
        const entries = mockBackend.getEntries();
        const newEntry: TimeEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 9),
            status: entry.status || 'SUBMITTED',
        };
        entries.unshift(newEntry); // Add to top
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
        return newEntry;
    },

    updateEntryStatus: (entryId: string, status: 'APPROVED' | 'REJECTED') => {
        const entries = mockBackend.getEntries();
        const index = entries.findIndex(e => e.id === entryId);
        if (index !== -1) {
            entries[index].status = status;
            localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
            return true;
        }
        return false;
    },

    deleteEntry: (entryId: string) => {
        const entries = mockBackend.getEntries();
        const newEntries = entries.filter(e => e.id !== entryId);
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(newEntries));
    },

    // 3. Active Timer (Live State)
    startTimer: (userId: string, userName: string, projectId: string, taskCategory: string) => {
        const project = mockBackend.getProjectById(projectId);
        // We really need a full TimeEntry object, but for active timer we might store partial or custom?
        // Schema says TimeEntry has 'status' as 'DRAFT' | ... but here we use 'RUNNING'.
        // This 'RUNNING' status might be active-timer specific or we need to update schema.
        // For now, let's coerce status to any or extend schema if possible.
        // Actually, TimeEntryStatus in schema is 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'LOCKED'.
        // 'RUNNING' is missing. I will assume 'DRAFT' for now and handle 'RUNNING' in active-timer logic check.
        // OR better: use 'DRAFT' for active timer storage context.

        const newTimer: TimeEntry = {
            id: 'current',
            userId,
            // userName: userName, // Schema doesn't have userName?
            projectId,
            // projectName: project?.name || 'Unknown', // Schema doesn't have projectName?
            categoryId: taskCategory, // Schema uses categoryId
            startTime: new Date().toISOString(),
            durationMinutes: 0,
            status: 'DRAFT', // Using DRAFT as placeholder for running
            date: new Date().toISOString().split('T')[0],
            isBillable: true, // Defaulting
            description: '',
        } as any; // Casting because schema might differ slightly (userName etc missing from schema)

        // Store custom object that mimics TimeEntry + extra fields for UI if needed
        localStorage.setItem(`${STORAGE_KEYS.ACTIVE_TIMER}_${userId}`, JSON.stringify({
            ...newTimer,
            userName,
            projectName: project?.name,
            status: 'RUNNING', // Override for local storage usage
            accumulatedSeconds: 0 // New field for pause logic
        }));
        return newTimer;
    },

    pauseTimer: (userId: string) => {
        const timerJson = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_TIMER}_${userId}`);
        if (!timerJson) return null;

        const activeTimer = JSON.parse(timerJson);
        if (activeTimer.status !== 'RUNNING' || !activeTimer.startTime) return activeTimer;

        const now = new Date();
        const start = new Date(activeTimer.startTime);
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000); // Seconds

        activeTimer.accumulatedSeconds = (activeTimer.accumulatedSeconds || 0) + elapsed;
        activeTimer.startTime = null; // Clear start time as it's paused
        activeTimer.status = 'PAUSED';
        activeTimer.durationMinutes = Math.floor(activeTimer.accumulatedSeconds / 60);

        localStorage.setItem(`${STORAGE_KEYS.ACTIVE_TIMER}_${userId}`, JSON.stringify(activeTimer));
        return activeTimer;
    },

    resumeTimer: (userId: string) => {
        const timerJson = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_TIMER}_${userId}`);
        if (!timerJson) return null;

        const activeTimer = JSON.parse(timerJson);
        if (activeTimer.status === 'RUNNING') return activeTimer; // Already running

        activeTimer.startTime = new Date().toISOString();
        activeTimer.status = 'RUNNING';

        localStorage.setItem(`${STORAGE_KEYS.ACTIVE_TIMER}_${userId}`, JSON.stringify(activeTimer));
        return activeTimer;
    },

    stopTimer: (userId: string, notes?: string) => {
        const timerJson = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_TIMER}_${userId}`);
        if (!timerJson) return null;

        const activeTimer = JSON.parse(timerJson);

        // Calculate final total duration
        let totalSeconds = activeTimer.accumulatedSeconds || 0;
        if (activeTimer.status === 'RUNNING' && activeTimer.startTime) {
            const now = new Date();
            const start = new Date(activeTimer.startTime);
            totalSeconds += Math.floor((now.getTime() - start.getTime()) / 1000);
        }

        const endTime = new Date();
        const durationMinutes = Math.floor(totalSeconds / 60);

        // Create completed entry
        mockBackend.addEntry({
            ...activeTimer,
            endTime: endTime.toISOString(),
            durationMinutes,
            description: notes || activeTimer.description,
            status: 'SUBMITTED',
            isBillable: activeTimer.isBillable !== undefined ? activeTimer.isBillable : true
        });

        // Clear active timer
        localStorage.removeItem(`${STORAGE_KEYS.ACTIVE_TIMER}_${userId}`);
        return true;
    },

    getActiveTimer: (userId: string): TimeEntry | null => {
        const timerJson = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_TIMER}_${userId}`);
        if (timerJson) {
            const timer = JSON.parse(timerJson);

            let totalSeconds = timer.accumulatedSeconds || 0;
            if (timer.status === 'RUNNING' && timer.startTime) {
                const now = new Date();
                const start = new Date(timer.startTime);
                totalSeconds += Math.floor((now.getTime() - start.getTime()) / 1000);
            }

            const durationMinutes = Math.floor(totalSeconds / 60);

            // Return enriched object with 'status' potentially being PAUSED for UI to check
            return {
                ...timer,
                durationMinutes,
                accumulatedSeconds: totalSeconds // Passing loose prop for precise UI
            } as TimeEntry;
        }
        return null; // Return null if nothing stored
    },

    // 4. Admin Live View (Polls all known users)
    getAllActiveTimers: (): TimeEntry[] => {
        const users = mockBackend.getUsers();
        const activeTimers: TimeEntry[] = [];

        users.forEach(u => {
            const timer = mockBackend.getActiveTimer(u.id);
            if (timer) activeTimers.push(timer);
        });

        return activeTimers;
    },

    // 5. User Management
    getUsers: (): User[] => {
        const stored = localStorage.getItem(STORAGE_KEYS.USERS);
        if (stored) return JSON.parse(stored);

        // Initialize with default mock users if empty
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
        return MOCK_USERS;
    },

    addUser: (user: Omit<User, 'id' | 'status' | 'avatarInitials'>): User => {
        const users = mockBackend.getUsers();
        const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

        const newUser: User = {
            ...user,
            id: `emp_${Date.now()}`, // Simple ID generation
            status: 'ACTIVE',
            avatarInitials: initials,
        };

        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return newUser;
    },

    updateUserRole: (userId: string, role: 'ADMIN' | 'EMPLOYEE') => {
        const users = mockBackend.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].role = role;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            return true;
        }
        return false;
    },

    // 6. Approval Workflow (New)
    getApprovals: (): ApprovalRequest[] => {
        // Read from storage or initialize with defaults
        const stored = localStorage.getItem('credence_approvals_v1');
        if (stored) return JSON.parse(stored);

        // Default Data
        const defaults = [
            {
                id: 'apr_001',
                employeeId: 'CRED004/08-22',
                employeeName: 'Naresh Prajapati',
                avatarInitials: 'NP',
                weekRange: 'Jan 08 - Jan 14, 2026',
                submittedOn: '2026-01-15',
                status: 'PENDING',
                totalHours: 42.5,
                billableHours: 38,
                nonBillableHours: 4.5,
                projectCount: 2,
                projects: ['BCS Skylights', 'City Mall Expansion'],
            },
            {
                id: 'apr_002',
                employeeId: 'CRED006/02-24',
                employeeName: 'Abhishek Jondhalekar',
                avatarInitials: 'AJ',
                weekRange: 'Jan 08 - Jan 14, 2026',
                submittedOn: '2026-01-12',
                status: 'APPROVED',
                totalHours: 40,
                billableHours: 40,
                nonBillableHours: 0,
                projectCount: 1,
                projects: ['Dr. Wade Residence'],
                approvedBy: 'Dhiraj Vasu',
                lastUpdated: '2026-01-13'
            },
            {
                id: 'apr_003',
                employeeId: 'CRED007/05-24',
                employeeName: 'Rajnandini Lad',
                avatarInitials: 'RL',
                weekRange: 'Jan 01 - Jan 07, 2026',
                submittedOn: '2026-01-08',
                status: 'REJECTED',
                totalHours: 35,
                billableHours: 30,
                nonBillableHours: 5,
                projectCount: 3,
                projects: ['Internal Training', 'BCS Skylights'],
                remarks: 'Missing descriptions for internal training tasks.',
                lastUpdated: '2026-01-09'
            },
            {
                id: 'apr_004',
                employeeId: 'CRED008/10-24',
                employeeName: 'Swanand Patil',
                avatarInitials: 'SP',
                weekRange: 'Dec 25 - Dec 31, 2025',
                submittedOn: '2025-12-28', // Long time ago
                status: 'OVERDUE', // System rule: Pending > 3 days
                totalHours: 45,
                billableHours: 40,
                nonBillableHours: 5,
                projectCount: 1,
                projects: ['City Mall Expansion'],
            },
            {
                id: 'apr_005',
                employeeId: 'CRED009/12-24',
                employeeName: 'Pallavi Shenavi',
                avatarInitials: 'PS',
                weekRange: 'Jan 08 - Jan 14, 2026',
                submittedOn: '2026-01-15',
                status: 'SUBMITTED', // Freshly submitted
                totalHours: 40,
                billableHours: 35,
                nonBillableHours: 5,
                projectCount: 2,
                projects: ['Dr. Wade Residence', 'Internal Training'],
            },
            {
                id: 'apr_006',
                employeeId: 'CRED023/02-26',
                employeeName: 'Ajith Ravirekhala',
                avatarInitials: 'AR',
                weekRange: 'Jan 08 - Jan 14, 2026',
                submittedOn: '2026-01-14',
                status: 'PENDING',
                totalHours: 20,
                billableHours: 10,
                nonBillableHours: 10,
                projectCount: 1,
                projects: ['Internal Training'],
            }
        ] as ApprovalRequest[];

        localStorage.setItem('credence_approvals_v1', JSON.stringify(defaults));
        return defaults;
    },

    updateApprovalStatus: (id: string, status: ApprovalRequest['status']) => {
        const approvals = mockBackend.getApprovals();
        const index = approvals.findIndex(a => a.id === id);
        if (index !== -1) {
            approvals[index].status = status;
            approvals[index].lastUpdated = new Date().toISOString();
            localStorage.setItem('credence_approvals_v1', JSON.stringify(approvals));
            return approvals[index];
        }
        return null;
    },


    // 7. Billing & Invoices (New)
    getUnbilledApprovedHours: (clientId: string): TimeEntry[] => {
        // Mocking: Return some approved entries for the client that aren't linked to an invoice yet
        const entries = mockBackend.getEntries();
        // Use clientId to filter (mock logic)
        return entries.filter(e => {
            const project = mockBackend.getProjectById(e.projectId);
            return e.status === 'APPROVED' && project?.name.startsWith('BCS') && clientId.length > 0;
        });
    },

    // getInvoices is already defined above at line 610. Reusing that.

    // getInvoiceById already defined above.

    createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'payments' | 'status' | 'paidAmount' | 'balanceAmount'>): Invoice => {
        const invoices = mockBackend.getInvoices();
        const newInvoice: Invoice = {
            ...invoice,
            id: `inv_${Date.now()}`,
            status: 'DRAFT',
            paidAmount: 0,
            balanceAmount: invoice.totalAmount,
            payments: [],
            createdAt: new Date().toISOString()
        };
        invoices.unshift(newInvoice);
        localStorage.setItem('credence_invoices_v1', JSON.stringify(invoices));
        return newInvoice;
    },



    recordPayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => {
        const invoices = mockBackend.getInvoices();
        const index = invoices.findIndex(i => i.id === invoiceId);
        if (index !== -1) {
            const invoice = invoices[index];
            const newPayment: PaymentRecord = {
                ...payment,
                id: `pay_${Date.now()}`
            };

            invoice.payments.unshift(newPayment);
            invoice.paidAmount += payment.amount;
            invoice.balanceAmount = invoice.totalAmount - invoice.paidAmount;

            if (invoice.balanceAmount <= 0) {
                invoice.status = 'PAID';
                invoice.balanceAmount = 0; // Prevent negative
            } else {
                invoice.status = 'PARTIAL';
            }

            localStorage.setItem('credence_invoices_v1', JSON.stringify(invoices));
            return invoice;
        }
        return null;
    },

    // 8. Payroll & Costing (New)
    getPayrollRuns: (): PayrollRun[] => {
        const stored = localStorage.getItem('credence_payroll_runs_v1');
        return stored ? JSON.parse(stored) : MOCK_PAYROLL_RUNS;
    },

    getPayrollRecords: (runId: string): PayrollRecord[] => {
        // In real app, fetch from DB where runId matches
        // For mock, just return static list if runId is match, else empty or generate dynamic
        return MOCK_PAYROLL_RECORDS.filter(r => r.payrollRunId === runId || runId === 'current');
    },

    getEmployeeRates: (): EmployeeRate[] => {
        return MOCK_EMPLOYEE_RATES;
    },

    calculatePayroll: (period: string, _options: any): PayrollRun => {
        // Mock calculation logic
        // 1. Fetch all approved time entries for the period
        // 2. Map to employees and apply rates
        // 3. Generate records
        const runId = `run_${period.replace(/\s/g, '_').toLowerCase()}`;
        const newRun: PayrollRun = {
            id: runId,
            period: period,
            status: 'DRAFT',
            totalEmployees: 2,
            totalPayable: 293600, // Sum of mock records
            totalApprovedHours: 300,
            generatedAt: new Date().toISOString(),
            generatedBy: 'Admin',
            isLocked: false
        };
        return newRun;
    },

    lockPayroll: (_runId: string) => {
        // Find run and set status = LOCKED
        return true;
    },

    // 9. Team Availability (New)
    getAvailabilityEvents: (): AvailabilityEvent[] => {
        const stored = localStorage.getItem('credence_availability_v1');
        return stored ? JSON.parse(stored) : MOCK_AVAILABILITY_EVENTS;
    },

    addAvailabilityEvent: (event: Omit<AvailabilityEvent, 'id' | 'createdAt'>): AvailabilityEvent => {
        const newEvent: AvailabilityEvent = {
            ...event,
            id: `av_${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        const current = mockBackend.getAvailabilityEvents();
        const updated = [...current, newEvent];
        localStorage.setItem('credence_availability_v1', JSON.stringify(updated));

        return newEvent;
    },

    deleteAvailabilityEvent: (id: string) => {
        const current = mockBackend.getAvailabilityEvents();
        const updated = current.filter(e => e.id !== id);
        localStorage.setItem('credence_availability_v1', JSON.stringify(updated));
    }
};
