import prisma from './db.js';

async function main() {
    console.log('Seeding database...');

    // 1. Users
    const users = [
        { id: 'CRED001/06-22', name: 'DHIRAJ VASU', email: 'dhiraj@credaec.in', role: 'ADMIN', department: 'TOP MANAGEMENT', designation: 'CO-FOUNDER & CEO', avatarInitials: 'DV', status: 'ACTIVE' },
        { id: 'CRED002/06-22', name: 'GAURAV KUMAR', email: 'gaurav@credaec.in', role: 'ADMIN', department: 'TOP MANAGEMENT', designation: 'CO-FOUNDER & COO', avatarInitials: 'GK', status: 'ACTIVE' },
        { id: 'CRED003/02-24', name: 'YOGESH DABHOLE', email: 'yogesh@credaec.in', role: 'ADMIN', department: 'TOP MANAGEMENT', designation: 'CO-FOUNDER & MD', avatarInitials: 'YD', status: 'ACTIVE' },
        { id: 'CRED004/08-22', name: 'NARESH PRAJAPATI', email: 'naresh@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'SR. STRUCTURAL DESIGN ENGINEER', avatarInitials: 'NP', status: 'ACTIVE' },
        { id: 'CRED006/02-24', name: 'ABHISHEK JONDHALEKAR', email: 'abhishek@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'SR. STRUCTURAL CAD ENGINEER', avatarInitials: 'AJ', status: 'ACTIVE' },
        { id: 'CRED007/05-24', name: 'RAJNANDINI LAD', email: 'rajnandini@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. STRUCTURAL CAD ENGINEER', avatarInitials: 'RL', status: 'ACTIVE' },
        { id: 'CRED008/10-24', name: 'SWANAND PATIL', email: 'swanand@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. BIM ENGINEER', avatarInitials: 'SP', status: 'ACTIVE' },
        { id: 'CRED009/12-24', name: 'PALLAVI SHENAVI', email: 'pallavi@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'SR. STRUCTURAL ENGINEER', avatarInitials: 'PS', status: 'ACTIVE' },
        { id: 'CRED010/01-25', name: 'SOHEL NADAF', email: 'sohel@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'SR. STRUCTURAL ENGINEER', avatarInitials: 'SN', status: 'ACTIVE', hourlyCostRate: 8 },
        { id: 'CRED011/03-25', name: 'SHRIPAD MIRAJKAR', email: 'shripad@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'SR. STRUCTURAL CAD ENGINEER', avatarInitials: 'SM', status: 'ACTIVE' },
        { id: 'CRED012/06-25', name: 'DISHA PATIL', email: 'disha@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. STRUCTURAL ENGINEER', avatarInitials: 'DP', status: 'ACTIVE' },
        { id: 'CRED013/06-25', name: 'PRERANA SHINDE', email: 'prerana@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. STRUCTURAL ENGINEER', avatarInitials: 'PS', status: 'ACTIVE' },
        { id: 'CRED014/06-25', name: 'PRANALI PATIL', email: 'pranali@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. STRUCTURAL ENGINEER', avatarInitials: 'PP', status: 'ACTIVE' },
        { id: 'CRED015/06-25', name: 'ROHIT MORE', email: 'rohit@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. STRUCTURAL CAD ENGINEER', avatarInitials: 'RM', status: 'ACTIVE' },
        { id: 'CRED019/07-25', name: 'MOHAMMED RATLAMWALA', email: 'mohammed@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. STRUCTURAL ENGINEER', avatarInitials: 'MR', status: 'ACTIVE' },
        { id: 'CRED020/08-25', name: 'KAILAS MIRAJKAR', email: 'kailas@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. STRUCTURAL CAD ENGINEER', avatarInitials: 'KM', status: 'ACTIVE' },
        { id: 'CRED022/01-26', name: 'SURENDRA CHAUHAN', email: 'surendra@credaec.in', role: 'ADMIN', department: 'MANAGEMENT', designation: 'JR. BUSINESS OPERATION EXECUTIVE', avatarInitials: 'SC', status: 'ACTIVE' },
        { id: 'CRED023/02-26', name: 'AJITH RAVIREKHALA', email: 'ajith@credaec.in', role: 'EMPLOYEE', department: 'STRUCTURAL DIVISION', designation: 'JR. STRUCTURAL ENGINEER', avatarInitials: 'AR', status: 'ACTIVE' }
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user
        });
    }

    // 2. Clients
    const clients = [
        { id: 'c1', name: 'Boston Construction Services', companyName: 'Boston Construction Services', email: 'contact@bcs.com', status: 'ACTIVE', currency: 'USD', totalProjects: 2 },
        { id: 'c2', name: 'Dr. Emily Wade', companyName: 'Wade Residence', email: 'emily@wade.com', status: 'ACTIVE', currency: 'USD', totalProjects: 1 }
    ];

    for (const client of clients) {
        await prisma.client.upsert({
            where: { id: client.id },
            update: {},
            create: client
        });
    }

    // 3. Projects
    const projects = [
        {
            id: 'p1', code: 'PRJ-001', name: 'BCS Skylights', clientId: 'c1', clientName: 'Boston Construction Services', status: 'ACTIVE', type: 'HOURLY', priority: 'MEDIUM',
            startDate: new Date('2026-01-01'), currency: 'USD', estimatedHours: 500, billingMode: 'HOURLY_RATE', rateLogic: 'GLOBAL_PROJECT_RATE', globalRate: 85,
            teamMembers: JSON.stringify([]), entryRules: JSON.stringify({ notesRequired: false, proofRequired: false, minTimeUnit: 15, allowFutureEntry: false, allowBackdatedEntry: true }),
            alerts: JSON.stringify({ budgetThresholdPct: 80, deadlineAlertDays: 7 }), usedHours: 120, billableHours: 100
        },
        {
            id: 'p2', code: 'PRJ-002', name: 'Dr. Wade Residence', clientId: 'c2', clientName: 'Dr. Emily Wade', status: 'ACTIVE', type: 'FIXED', priority: 'HIGH',
            startDate: new Date('2025-11-15'), currency: 'USD', estimatedHours: 200, billingMode: 'FIXED_FEE', budgetAmount: 15000, rateLogic: 'GLOBAL_PROJECT_RATE',
            teamMembers: JSON.stringify([]), entryRules: JSON.stringify({ notesRequired: false, proofRequired: false, minTimeUnit: 15, allowFutureEntry: false, allowBackdatedEntry: true }),
            alerts: JSON.stringify({ budgetThresholdPct: 80, deadlineAlertDays: 7 }), usedHours: 45, billableHours: 45
        },
        {
            id: 'p3', code: 'INT-001', name: 'Internal Training', clientId: 'c1', clientName: 'Credence Internal', status: 'ACTIVE', type: 'INTERNAL', priority: 'LOW',
            startDate: new Date('2025-01-01'), currency: 'USD', estimatedHours: 1000, billingMode: 'HOURLY_RATE', rateLogic: 'CATEGORY_BASED_RATE',
            teamMembers: JSON.stringify([]), entryRules: JSON.stringify({ notesRequired: false, proofRequired: false, minTimeUnit: 15, allowFutureEntry: false, allowBackdatedEntry: true }),
            alerts: JSON.stringify({ budgetThresholdPct: 80, deadlineAlertDays: 7 }), usedHours: 350, billableHours: 0
        }
    ];

    for (const project of projects) {
        await prisma.project.upsert({
            where: { id: project.id },
            update: {},
            create: project
        });
    }

    // 4. Task Categories
    const categories = [
        { id: '1', name: 'Engineering Design', isBillable: true, isProofRequired: false, isNotesRequired: true, status: 'ACTIVE' },
        { id: '2', name: 'Drafting', isBillable: true, isProofRequired: true, isNotesRequired: true, status: 'ACTIVE' },
        { id: '3', name: 'Modelling (RISA/ETABS)', isBillable: true, isProofRequired: true, isNotesRequired: true, status: 'ACTIVE' },
        { id: '4', name: 'Review & Coordination', isBillable: true, isProofRequired: false, isNotesRequired: true, status: 'ACTIVE' },
        { id: '5', name: 'Client Calls', isBillable: true, isProofRequired: false, isNotesRequired: true, status: 'ACTIVE' },
        { id: '6', name: 'Internal Meeting', isBillable: false, isProofRequired: false, isNotesRequired: false, status: 'ACTIVE' },
        { id: '7', name: 'Training', isBillable: false, isProofRequired: false, isNotesRequired: false, status: 'ACTIVE' },
        { id: '8', name: 'Rework / Revisions', isBillable: false, defaultRate: 0, isProofRequired: true, isNotesRequired: true, status: 'ACTIVE' },
    ];

    for (const cat of categories) {
        await prisma.taskCategory.upsert({
            where: { id: cat.id },
            update: {},
            create: cat
        });
    }

    // 5. Tasks
    const tasks = [
        { id: 't1', projectId: 'p1', title: 'Initial Structural Analysis', categoryId: '1', status: 'COMPLETED', priority: 'HIGH' },
        { id: 't2', projectId: 'p1', title: 'Drafting Foundation Details', categoryId: '2', status: 'IN_PROGRESS', priority: 'MEDIUM' }
    ];

    for (const task of tasks) {
        await prisma.task.upsert({
            where: { id: task.id },
            update: {},
            create: task
        });
    }

    // 6. Availability Events (Holidays)
    const events = [
        { id: 'h1', type: 'HOLIDAY', subType: 'NATIONAL', title: 'Republic Day', startDate: new Date('2026-01-26'), endDate: new Date('2026-01-26'), notes: 'National Holiday', createdBy: 'Admin' }
    ];
    for (const evt of events) {
        await prisma.availabilityEvent.upsert({ where: { id: evt.id }, update: {}, create: evt });
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
