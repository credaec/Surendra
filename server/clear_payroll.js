
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearPayroll() {
    try {
        const deleted = await prisma.payrollRun.deleteMany({});
        console.log(`Deleted ${deleted.count} payroll runs.`);
        const deletedRecs = await prisma.payrollRecord.deleteMany({});
        console.log(`Deleted ${deletedRecs.count} payroll records.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

clearPayroll();
