
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    const admin = users.find(u => u.name === 'System Admin' || u.role === 'ADMIN');

    if (!admin) {
        console.log("CRITICAL: No Admin user found!");
        return;
    }

    console.log(`Checking entries for Admin: ${admin.name} (${admin.id})`);

    const adminEntries = await prisma.timeEntry.findMany({
        where: { userId: admin.id }
    });

    console.log(`Found ${adminEntries.length} entries for this admin.`);

    if (adminEntries.length > 0) {
        adminEntries.forEach(e => {
            console.log(`- ID: ${e.id}, Date: ${e.date}, Status: ${e.status}, Duration: ${e.durationMinutes}`);
        });
    }

    console.log("\nChecking Approval Requests (if separate table exists - checking schema...)");
    // Based on server/index.js, approvals are derived from TimeEntries status=SUBMITTED.
    // So if status is not SUBMITTED, it won't show up.
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
