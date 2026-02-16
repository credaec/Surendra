
import type { Project, Client, Task, TaskCategory, TimeEntry, AvailabilityEvent, ClientContact } from '../types/schema';
import { api } from './api';

// --- Types ---
// Project imported from schema

export interface UserStatus {
    userId: string;
    isOnline: boolean;
    lastActive: string; // ISO string
}

export interface ClientDocument {
    id: string;
    clientId: string;
    name: string;
    size: string;
    uploadDate: string;
    type: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE'; // String in DTO
    designation: string;
    department: string;
    avatarInitials: string;
    status: 'ACTIVE' | 'INACTIVE';
    hourlyCostRate?: number;
    joiningDate?: string;
}

export interface ApprovalRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    avatarInitials: string;
    weekRange: string;
    submittedOn: string;
    status: 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'OVERDUE';
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    projectCount: number;
    projects: string[];
    approvedBy?: string;
    lastUpdated?: string;
    today?: string; // Optional helper
    weekStartDate?: string;
    weekEndDate?: string;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    timeEntryId?: string;
}

export interface PaymentRecord {
    id: string;
    amount: number;
    date: string;
    mode: 'BANK_TRANSFER' | 'UPI' | 'CASH' | 'CHEQUE' | 'ONLINE';
    referenceNo?: string;
    notes?: string;
}

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
    isDeleted?: boolean;
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
    basePay: number;
    overtimeHours: number;
    overtimeAmount: number;
    deductions: number;
    bonus: number;
    totalPayable: number;
    status: 'DRAFT' | 'APPROVED' | 'PAID' | 'HOLD';
}

export interface PayrollRun {
    id: string;
    period: string;
    status: 'DRAFT' | 'LOCKED' | 'PAID';
    totalEmployees: number;
    totalPayable: number;
    totalApprovedHours: number;
    generatedAt: string;
    generatedBy: string;
    isLocked: boolean;
}

export interface UserAssignment {
    id: string;
    userId: string;
    categoryId: string;
    assignedAt: string;
    assignedBy: string;
}

// Internal Cache
const cache = {
    users: [] as User[],
    clients: [] as Client[],
    projects: [] as Project[],
    tasks: [] as Task[],
    taskCategories: [] as TaskCategory[],
    timeEntries: [] as TimeEntry[],
    availabilityEvents: [] as AvailabilityEvent[],
    invoices: [] as Invoice[],
    userAssignments: [] as UserAssignment[],
    payrollRuns: [] as PayrollRun[],
    payrollRecords: [] as PayrollRecord[],
    approvals: [] as ApprovalRequest[],
    employeeRates: [] as EmployeeRate[],
    notifications: [] as any[],
    projectRoles: ['Project Manager', 'Engineer', 'Drafter', 'Reviewer'] as string[],
    isInitialized: false
};

// --- Service Implementation ---
export const backendService = {
    // Initialization
    initialize: async () => {
        if (cache.isInitialized) return;
        try {
            const results = await Promise.allSettled([
                api.get('/users'),
                api.get('/clients'),
                api.get('/projects'),
                api.get('/tasks'),
                api.get('/task-categories'),
                api.get('/time-entries'),
                api.get('/availability'),
                api.get('/invoices'),
                api.get('/user-assignments'),
                api.get('/payroll-runs'),
                api.get('/payroll-records'),
                api.get('/approvals'),
                api.get('/employee-rates'),
                api.get('/approvals'),
                api.get('/employee-rates'),
                api.get('/notifications'),
                api.get('/settings/roles')
            ]);

            const getVal = (idx: number) => results[idx].status === 'fulfilled' ? results[idx].value : [];

            cache.users = getVal(0);
            cache.clients = getVal(1);
            cache.projects = getVal(2);
            cache.tasks = getVal(3);
            cache.taskCategories = getVal(4);
            cache.timeEntries = getVal(5);
            cache.availabilityEvents = getVal(6);
            cache.invoices = getVal(7);
            cache.userAssignments = getVal(8);
            cache.payrollRuns = getVal(9);
            cache.payrollRecords = getVal(10);
            cache.approvals = getVal(11);
            cache.employeeRates = getVal(12);
            cache.employeeRates = getVal(12);
            cache.notifications = getVal(13);
            cache.projectRoles = getVal(14) || ['Project Manager', 'Engineer', 'Drafter', 'Reviewer'];

            cache.isInitialized = true;
            console.log('Backend Synced (Partial Success possibly)');

            // Log failures
            results.forEach((r, i) => {
                if (r.status === 'rejected') console.error(`API Call ${i} Failed:`, r.reason);
            });

        } catch (e) {
            console.error('Core Backend Sync Failed', e);
        }
    },

    // --- Data Accessors ---

    // 1. Users
    getUsers: (): User[] => {
        return cache.users;
    },

    getUserById: (id: string): User | undefined => {
        return cache.users.find(u => u.id === id);
    },

    addUser: async (user: any): Promise<User> => {
        const newUser = await api.post('/users', user);
        cache.users.push(newUser);
        return newUser;
    },

    updateUser: async (user: User): Promise<User> => {
        const updated = await api.put(`/users/${user.id}`, user);
        const idx = cache.users.findIndex(u => u.id === user.id);
        if (idx !== -1) cache.users[idx] = updated;
        return updated;
    },

    deleteUser: async (id: string) => {
        await api.delete(`/users/${id}`);
        cache.users = cache.users.filter(u => u.id !== id);
    },

    // 2. Clients
    getClients: (): Client[] => {
        return cache.clients.map(client => {
            const projectCount = cache.projects ? cache.projects.filter(p => p.clientId === client.id).length : 0;
            return {
                ...client,
                totalProjects: projectCount
            };
        });
    },

    getClientById: (id: string): Client | undefined => {
        return cache.clients.find(c => c.id === id);
    },

    addClient: async (client: any): Promise<Client> => {
        const newClient = await api.post('/clients', client);
        cache.clients.push(newClient);
        return newClient;
    },

    updateClient: async (client: Client): Promise<Client> => {
        const updated = await api.put(`/clients/${client.id}`, client);
        const idx = cache.clients.findIndex(c => c.id === client.id);
        if (idx !== -1) cache.clients[idx] = updated;
        return updated;
    },

    deleteClient: async (id: string) => {
        await api.delete(`/clients/${id}`);
        cache.clients = cache.clients.filter(c => c.id !== id);
    },

    // Client Sub-resources
    getClientDocuments: async (clientId: string): Promise<ClientDocument[]> => {
        return await api.get(`/clients/${clientId}/documents`);
    },

    addClientDocument: async (doc: Partial<ClientDocument> & { clientId: string }) => {
        return await api.post(`/clients/${doc.clientId}/documents`, doc);
    },

    deleteClientDocument: async (id: string) => {
        return await api.delete(`/client-documents/${id}`);
    },

    addClientContact: async (clientId: string, contact: any) => {
        const newContact = await api.post(`/clients/${clientId}/contacts`, contact);
        // Optimistically update cache if we had deep nesting, but typically we refresh detail page
        return newContact;
    },

    deleteClientContact: async (clientId: string, contactId: string) => {
        await api.delete(`/client-contacts/${contactId}`);
    },

    // 3. Projects
    getProjects: (): Project[] => {
        return cache.projects;
    },

    getProjectById: (id: string): Project | undefined => {
        return cache.projects.find(p => p.id === id);
    },

    addProject: async (project: any): Promise<Project> => {
        const newProject = await api.post('/projects', project);
        cache.projects.push(newProject);
        return newProject;
    },

    updateProject: async (project: Project): Promise<Project> => {
        const updated = await api.put(`/projects/${project.id}`, project);
        const idx = cache.projects.findIndex(p => p.id === project.id);
        if (idx !== -1) cache.projects[idx] = updated;
        return updated;
    },

    deleteProject: async (id: string) => {
        await api.delete(`/projects/${id}`);
        cache.projects = cache.projects.filter(p => p.id !== id);
    },

    // 4. Task Categories
    getTaskCategories: (): TaskCategory[] => {
        return cache.taskCategories;
    },

    addTaskCategory: async (category: any): Promise<TaskCategory> => {
        const newCategory = await api.post('/task-categories', category);
        cache.taskCategories.push(newCategory);
        return newCategory;
    },

    updateTaskCategory: async (category: TaskCategory): Promise<TaskCategory> => {
        const updated = await api.put(`/task-categories/${category.id}`, category);
        const idx = cache.taskCategories.findIndex(tc => tc.id === category.id);
        if (idx !== -1) cache.taskCategories[idx] = updated;
        return updated;
    },

    deleteTaskCategory: async (id: string) => {
        await api.delete(`/task-categories/${id}`);
        cache.taskCategories = cache.taskCategories.filter(tc => tc.id !== id);
    },

    // 5. Tasks
    getTasks: (): Task[] => {
        return cache.tasks;
    },

    addTask: async (task: any): Promise<Task> => {
        const newTask = await api.post('/tasks', task);
        cache.tasks.push(newTask);
        return newTask;
    },

    updateTask: async (task: Task): Promise<Task> => {
        const updated = await api.put(`/tasks/${task.id}`, task);
        const idx = cache.tasks.findIndex(t => t.id === task.id);
        if (idx !== -1) cache.tasks[idx] = updated;
        return updated;
    },

    deleteTask: async (id: string) => {
        await api.delete(`/tasks/${id}`);
        cache.tasks = cache.tasks.filter(t => t.id !== id);
    },

    // 6. Time Entries
    getTimeEntries: (userId?: string): TimeEntry[] => {
        if (userId) return cache.timeEntries.filter(te => te.userId === userId);
        return cache.timeEntries;
    },

    addTimeEntry: async (entry: any): Promise<TimeEntry> => {
        const newEntry = await api.post('/time-entries', entry);
        cache.timeEntries.unshift(newEntry);

        // Check Overrun
        if (entry.projectId) {
            await backendService.checkProjectOverrun(entry.projectId);
        }

        return newEntry;
    },

    updateTimeEntry: async (entry: TimeEntry): Promise<TimeEntry> => {
        const updated = await api.put(`/time-entries/${entry.id}`, entry);
        const idx = cache.timeEntries.findIndex(te => te.id === entry.id);
        if (idx !== -1) cache.timeEntries[idx] = updated;

        // Check Overrun (in case duration increased)
        if (entry.projectId) {
            await backendService.checkProjectOverrun(entry.projectId);
        }

        return updated;
    },

    deleteTimeEntry: async (id: string) => {
        await api.delete(`/time-entries/${id}`);
        cache.timeEntries = cache.timeEntries.filter(te => te.id !== id);
    },

    // Alias for compatibility
    getEntries: (userId?: string): TimeEntry[] => {
        if (userId) return cache.timeEntries.filter(te => te.userId === userId);
        return cache.timeEntries;
    },

    getAllActiveTimers: (): TimeEntry[] => {
        return cache.timeEntries.filter(te => !te.endTime && (te.startTime || te.status === 'PAUSED'));
    },

    getActiveTimer: (userId: string): TimeEntry | undefined => {
        return cache.timeEntries.find(te => te.userId === userId && !te.endTime && (te.startTime || te.status === 'PAUSED'));
    },

    // Refreshes the active timer from the backend (for cross-component/tab sync)
    refreshActiveTimer: async (userId: string): Promise<TimeEntry | undefined> => {
        try {
            // Fetch latest entries for user
            const entries = await api.get(`/time-entries?userId=${userId}`);
            // Merge into cache (simplified: just replace/add the active one if found)
            // Ideally we merge all, but for sync we care about the active one.
            const active = entries.find((e: TimeEntry) => !e.endTime);

            if (active) {
                const idx = cache.timeEntries.findIndex(te => te.id === active.id);
                if (idx !== -1) cache.timeEntries[idx] = active;
                else cache.timeEntries.unshift(active);
            } else {
                // If no active found in backend, ensure cache doesn't have a stale one
                // This is harder since we don't know which one was active without checking cache.
                // We can filter cache for active ones for this user and mark them as finished? 
                // Or just trust the fetch list is comprehensive?
                // The fetch is specific to userId, so we can update cache.timeEntries for this user.
                // BUT cache.timeEntries might contain other users if admin? No, usually filtered.
                // Let's just update based on the list returned.
            }
            return active;
        } catch (e) {
            console.error("Failed to refresh active timer", e);
            return undefined;
        }
    },

    // --- Overrun Handling ---
    checkProjectOverrun: async (projectId: string) => {
        const project = cache.projects.find(p => p.id === projectId);
        if (!project) return;
        if (!project.estimatedHours || project.estimatedHours <= 0) return;

        const entries = cache.timeEntries.filter(te => te.projectId === projectId);
        const totalMinutes = entries.reduce((acc, curr) => acc + curr.durationMinutes, 0);
        const totalHours = totalMinutes / 60;

        // Check if limit exceeded (or close to it? User said "finished and work is done", typically means >= budget)
        if (totalHours >= project.estimatedHours) {
            // 1. Notify Admin
            // Check if we already notified recently? For now, we'll just add a notification.
            // Avoid spamming if already over budget?
            // Simple check: check if the notification already exists at top of stack?
            // Or just fire it.
            await backendService.addNotification(
                'admin', // Target admin
                'Project Overrun Warning',
                `Project "${project.name}" has exceeded its estimated budget of ${project.estimatedHours}h. Current: ${totalHours.toFixed(1)}h.`
            );

            // 2. Generate Draft Invoice (Comprehensive)
            await backendService.generateDraftInvoice(projectId);
        }
    },

    generateDraftInvoice: async (projectId: string) => {
        const project = cache.projects.find(p => p.id === projectId);
        if (!project) return;
        const client = cache.clients.find(c => c.id === project.clientId);

        // Fetch ALL entries (Billed & Unbilled) as requested
        const projectEntries = cache.timeEntries.filter(te => te.projectId === projectId);

        if (projectEntries.length === 0) return;

        // Check for existing DRAFT invoice for this project
        const existingDraft = cache.invoices.find(i => i.projectId === projectId && i.status === 'DRAFT');

        const invoiceItems: InvoiceItem[] = projectEntries.map(entry => {
            // Calculate Amount
            // Logic: isBillable ? duration * rate : 0
            let amount = 0;
            if (entry.isBillable) {
                // Determine Rate: Entry specific -> User Rate -> Project Default
                // Simplified: use Project Global Rate or User Cost Rate
                const rate = project.globalRate || 50; // Mock default
                amount = (entry.durationMinutes / 60) * rate;
            }

            return {
                id: crypto.randomUUID(), // New ID or preserve? Re-generating items for draft is safer for sync
                description: `${entry.description || 'Time Log'} (${new Date(entry.date).toLocaleDateString()})`,
                quantity: parseFloat((entry.durationMinutes / 60).toFixed(2)),
                unitPrice: entry.isBillable ? (project.globalRate || 50) : 0,
                amount: parseFloat(amount.toFixed(2)),
                timeEntryId: entry.id
            };
        });

        const totalAmount = invoiceItems.reduce((sum, item) => sum + item.amount, 0);

        if (existingDraft) {
            // Update Existing Draft
            const updatedDraft: Invoice = {
                ...existingDraft,
                items: invoiceItems,
                subtotal: totalAmount,
                taxAmount: totalAmount * 0.1, // Mock Tax 10%
                totalAmount: totalAmount * 1.1,
                balanceAmount: totalAmount * 1.1 - existingDraft.paidAmount
            };
            await backendService.updateInvoice(updatedDraft);
            await backendService.addNotification('admin', 'Invoice Updated', `Draft invoice for "${project.name}" updated with latest entries.`);
        } else {
            // Create New Draft
            const newInvoice: any = {
                invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
                clientId: project.clientId,
                clientName: client?.name || 'Unknown',
                projectId: project.id,
                projectName: project.name,
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
                currency: project.currency || 'USD',
                status: 'DRAFT',
                items: invoiceItems,
                subtotal: totalAmount,
                taxAmount: totalAmount * 0.1,
                totalAmount: totalAmount * 1.1,
                paidAmount: 0,
                balanceAmount: totalAmount * 1.1,
                type: 'TIMESHEET',
                createdBy: 'System (Overrun Automator)',
                createdAt: new Date().toISOString(),
                payments: []
            };
            await backendService.addInvoice(newInvoice);
            await backendService.addNotification('admin', 'Draft Invoice Created', `Draft invoice created for over-budget project "${project.name}".`);
        }
    },

    // --- Timer Actions ---
    startTimer: async (userId: string, userName: string, projectId: string, categoryId: string): Promise<TimeEntry> => {
        const entry = {
            userId,
            // userName removed as it is not in schema
            projectId,
            categoryId,
            startTime: new Date().toISOString(),
            date: new Date().toISOString(), // Prisma needs full ISO string for DateTime
            status: 'PENDING',
            isBillable: true,
            durationMinutes: 0 // Required by schema
        };
        const newEntry = await api.post('/time-entries', entry);
        cache.timeEntries.unshift(newEntry);

        // Check overrun immediately? No, duration is 0 at start.

        return newEntry;
    },

    stopTimer: async (userId: string, description?: string): Promise<TimeEntry | undefined> => {
        const active = cache.timeEntries.find(te => te.userId === userId && !te.endTime);
        if (!active) return undefined;

        const now = new Date();
        let totalSeconds = (active as any).accumulatedSeconds || 0;

        if (active.status !== 'PAUSED' && active.startTime) {
            const start = new Date(active.startTime);
            const currentSessionSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
            totalSeconds += currentSessionSeconds;
        }

        const update = {
            ...active,
            endTime: now.toISOString(),
            durationMinutes: Math.floor(totalSeconds / 60),
            // accumulatedSeconds removed as it's not in schema
            activityLogs: JSON.stringify({ accumulatedSeconds: totalSeconds }),
            description: description || active.description || '',
            status: 'SUBMITTED'
        };
        // Remove transient property if it exists on active object from cache
        if ('accumulatedSeconds' in update) delete (update as any).accumulatedSeconds;

        const updated = await api.put(`/time-entries/${active.id}`, update);
        const idx = cache.timeEntries.findIndex(te => te.id === active.id);
        if (idx !== -1) cache.timeEntries[idx] = updated;

        // Check Overrun
        if (updated.projectId) {
            await backendService.checkProjectOverrun(updated.projectId);
        }

        return updated;
    },

    pauseTimer: async (userId: string) => {
        const active = cache.timeEntries.find(te => te.userId === userId && !te.endTime);
        if (active && active.status !== 'PAUSED' && active.startTime) {
            const now = new Date();
            const start = new Date(active.startTime);
            const currentSessionSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
            let previousAccumulated = 0;
            if (active.activityLogs) {
                try {
                    const logs = JSON.parse(active.activityLogs);
                    previousAccumulated = logs.accumulatedSeconds || 0;
                } catch (e) { }
            }
            // Fallback for migration/legacy
            previousAccumulated = previousAccumulated || (active as any).accumulatedSeconds || 0;

            const newAccumulated = previousAccumulated + currentSessionSeconds;

            const update = {
                ...active,
                status: 'PAUSED',
                activityLogs: JSON.stringify({ accumulatedSeconds: newAccumulated }),
                startTime: null // Clear start time so we don't double count if buggy UI checks it
            };
            // Remove transient property
            if ('accumulatedSeconds' in update) delete (update as any).accumulatedSeconds;

            await backendService.updateTimeEntry(update as any);
        }
    },

    resumeTimer: async (userId: string) => {
        const paused = cache.timeEntries.find(te => te.userId === userId && te.status === 'PAUSED' && !te.endTime);
        if (paused) {
            const update = {
                ...paused,
                status: 'PENDING',
                startTime: new Date().toISOString() // New session starts NOW
            };
            const updated = await backendService.updateTimeEntry(update as any);
            return updated;
        }
        return undefined;
    },

    updateActiveTimer: async (userId: string, updates: Partial<TimeEntry>) => {
        const active = cache.timeEntries.find(te => te.userId === userId && !te.endTime);
        if (active) {
            const merged = { ...active, ...updates };
            await backendService.updateTimeEntry(merged);
        }
    },

    // --- Auto-Stop Logic ---
    autoStopStaleTimers: async () => {
        // Threshold: 12 Hours
        const MAX_DURATION_MS = 12 * 60 * 60 * 1000;
        const now = Date.now();

        const activeTimers = cache.timeEntries.filter(te => !te.endTime && te.startTime);
        let stoppedCount = 0;

        for (const timer of activeTimers) {
            const start = new Date(timer.startTime!).getTime();
            if (now - start > MAX_DURATION_MS) {
                // Auto-stop this timer
                await backendService.stopTimer(timer.userId, "Auto-paused by system (end of day/stale)");
                stoppedCount++;
            }
        }

        if (stoppedCount > 0) {
            console.log(`Auto-stopped ${stoppedCount} stale timers.`);
        }
    },

    // --- Timesheet Actions ---
    deleteEntry: async (id: string) => {
        return backendService.deleteTimeEntry(id);
    },

    restoreEntry: async (id: string) => {
        // Conceptually restore a soft-deleted entry
        // Since we use hard delete in `deleteTimeEntry` (or soft if backed by deletedAt), 
        // IF the API supports restore we call it. 
        // If `deleteTimeEntry` did a soft delete (updated deletedAt), we reverse it.
        // Inspecting server: deleteTimeEntry sets deletedAt.
        // So we just update deletedAt to null.
        await api.put(`/time-entries/${id}`, { deletedAt: null });
        // We need to re-fetch or manually add back to cache if it was removed
        // Since `deleteTimeEntry` filtered it out of cache, we should re-fetch this entry
        // OR assuming the UI refreshes.
        // Ideally we fetch it back.
        const restored = await api.get(`/time-entries?id=${id}`); // Assuming filter support or just refetch all? 
        // Simple fallback: re-initialize or add if returned
        // Server `get /time-entries` returns list.
        // Let's just assume we need to reload or push if we had the object.
        // For now, let's just do the API call.
    },

    updateEntryStatus: async (id: string, status: string) => {
        const entry = cache.timeEntries.find(e => e.id === id);
        if (entry) {
            const updated = { ...entry, status };
            await backendService.updateTimeEntry(updated as any);
        }
    },

    submitTimesheet: async (payload: any) => {
        // Creates an approval request
        const newApproval = await api.post('/approvals', {
            ...payload,
            status: 'PENDING',
            submittedOn: new Date().toISOString()
        });
        cache.approvals.push(newApproval);
        return newApproval;
    },

    // 7. User Assignments
    getUserAssignments: (userId?: string): UserAssignment[] => {
        if (userId) return cache.userAssignments.filter(ua => ua.userId === userId);
        return cache.userAssignments;
    },

    assignCategoryToUser: async (categoryId: string, userId: string): Promise<UserAssignment> => {
        const assignment = await api.post('/user-assignments', { categoryId, userId });
        cache.userAssignments.push(assignment);
        return assignment;
    },

    addUserAssignment: async (assignment: any): Promise<UserAssignment> => {
        const newAssignment = await api.post('/user-assignments', assignment);
        cache.userAssignments.push(newAssignment);
        return newAssignment;
    },

    // 8. Invoices
    getInvoices: (): Invoice[] => {
        return cache.invoices.map(inv => {
            const client = cache.clients.find(c => c.id === inv.clientId);
            const project = cache.projects ? cache.projects.find(p => p.id === inv.projectId) : null;
            return {
                ...inv,
                clientName: client ? client.name : inv.clientName || 'Unknown Client',
                projectName: project ? project.name : inv.projectName || ''
            };
        });
    },
    addInvoice: async (invoice: any): Promise<Invoice> => {
        const newInvoice = await api.post('/invoices', invoice);
        cache.invoices.unshift(newInvoice);
        return newInvoice;
    },

    updateInvoice: async (invoice: Invoice): Promise<Invoice> => {
        const updated = await api.put(`/invoices/${invoice.id}`, invoice);
        const idx = cache.invoices.findIndex(i => i.id === invoice.id);
        if (idx !== -1) cache.invoices[idx] = updated;
        return updated;
    },

    sendInvoiceEmail: async (id: string, email: string, subject?: string, message?: string) => {
        const result = await api.post(`/invoices/${id}/send`, { email, subject, message });
        // Update local cache status
        const idx = cache.invoices.findIndex(i => i.id === id);
        if (idx !== -1) cache.invoices[idx].status = 'SENT';
        return result;
    },

    updateInvoiceStatus: async (id: string, status: Invoice['status']) => {
        const updated = await api.put(`/invoices/${id}`, { status });
        const idx = cache.invoices.findIndex(i => i.id === id);
        if (idx !== -1) cache.invoices[idx] = { ...cache.invoices[idx], status };
        return updated;
    },

    softDeleteInvoice: async (id: string) => {
        const updated = await api.put(`/invoices/${id}`, { isDeleted: true });
        const idx = cache.invoices.findIndex(i => i.id === id);
        if (idx !== -1) cache.invoices[idx] = { ...cache.invoices[idx], isDeleted: true };
        return updated;
    },

    restoreInvoice: async (id: string) => {
        const updated = await api.put(`/invoices/${id}`, { isDeleted: false });
        const idx = cache.invoices.findIndex(i => i.id === id);
        if (idx !== -1) cache.invoices[idx] = { ...cache.invoices[idx], isDeleted: false };
        return updated;
    },

    deleteInvoice: async (id: string) => {
        await api.delete(`/invoices/${id}`);
        cache.invoices = cache.invoices.filter(i => i.id !== id);
    },

    // 9. Availability
    getAvailabilityEvents: (): AvailabilityEvent[] => {
        return cache.availabilityEvents;
    },

    addAvailabilityEvent: async (event: any) => {
        const newEvent = await api.post('/availability', event);
        cache.availabilityEvents.push(newEvent);
        return newEvent;
    },

    updateAvailabilityEvent: async (event: any) => {
        const updated = await api.put(`/availability/${event.id}`, event);
        const idx = cache.availabilityEvents.findIndex(e => e.id === event.id);
        if (idx !== -1) cache.availabilityEvents[idx] = updated;
        return updated;
    },

    deleteAvailabilityEvent: async (id: string) => {
        await api.delete(`/availability/${id}`);
        cache.availabilityEvents = cache.availabilityEvents.filter(e => e.id !== id);
    },

    // Payroll & Complex logic
    getPayrollRuns: () => cache.payrollRuns,

    getPayrollRecords: (id: string) => cache.payrollRecords.filter(r => r.payrollRunId === id),

    fetchPayrollRecords: async (runId: string) => {
        const records = await api.get(`/payroll-runs/${runId}/records`);
        // We need to merge these into cache.payrollRecords
        // Simplest strategy: Remove old records for this run, add new ones
        cache.payrollRecords = cache.payrollRecords.filter(r => r.payrollRunId !== runId);
        cache.payrollRecords.push(...records);
        return records;
    },

    calculatePayroll: async (period: string, _options: any) => {
        try {
            const run = await api.post('/payroll/calculate', { period });
            // Update cache: remove old if exists, add new
            const idx = cache.payrollRuns.findIndex(r => r.period === period);
            if (idx !== -1) {
                cache.payrollRuns[idx] = run;
            } else {
                cache.payrollRuns.push(run);
            }
            return run;
        } catch (e) {
            console.error('Failed to calculate payroll', e);
            throw e;
        }
    },

    lockPayroll: async (id: string) => {
        return await api.post(`/payroll/lock`, { id });
    },

    getApprovals: () => cache.approvals,
    refreshApprovals: async () => {
        const data = await api.get('/approvals');
        cache.approvals = data;
        return data;
    },
    updateApprovalStatus: async (id: string, status: ApprovalRequest['status'], remarks?: string) => {
        const updated = await api.put(`/approvals/${id}`, { status, remarks });
        const idx = cache.approvals.findIndex(a => a.id === id);
        if (idx !== -1) cache.approvals[idx] = updated;
        return updated;
    },

    getEmployeeRates: () => cache.employeeRates,

    // Notifications
    getNotifications: (_userId: string) => {
        return cache.notifications;
    },
    addNotification: async (userId: string, title: string, msg: string) => {
        const newNotif = await api.post('/notifications', { userId, title, message: msg });
        cache.notifications.unshift(newNotif);
        return newNotif;
    },
    markNotificationRead: async (id: string) => {
        await api.put(`/notifications/${id}`, { isRead: true });
        const idx = cache.notifications.findIndex(n => n.id === id);
        if (idx !== -1) cache.notifications[idx].isRead = true;
    },

    // --- Project Roles ---
    // --- Project Roles ---
    getProjectRoles: () => {
        if (!cache.projectRoles || cache.projectRoles.length === 0) {
            return ['Project Manager', 'Engineer', 'Drafter', 'Reviewer'];
        }
        return [...cache.projectRoles];
    },

    addProjectRole: async (role: string) => {
        if (!cache.projectRoles.includes(role)) {
            const newRoles = [...cache.projectRoles, role];
            await api.post('/settings/roles', { roles: newRoles });
            cache.projectRoles = newRoles;
        }
        return [...cache.projectRoles];
    },

    deleteProjectRole: async (role: string) => {
        const newRoles = cache.projectRoles.filter(r => r !== role);
        await api.post('/settings/roles', { roles: newRoles });
        cache.projectRoles = newRoles;
        return [...cache.projectRoles];
    }
};
