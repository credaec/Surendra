
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("--- Users ---");
    const users = await prisma.user.findMany();
    users.forEach(u => console.log(`${u.id}: ${u.name} (${u.role})`));

    console.log("\n--- Submitted Time Entries ---");
    const entries = await prisma.timeEntry.findMany({
        where: { status: 'SUBMITTED' },
        include: { user: true }
    });

    if (entries.length === 0) {
        console.log("No SUBMITTED entries found.");
    } else {
        entries.forEach(e => {
            console.log(`Entry ID: ${e.id}, User: ${e.user.name} (${e.userId}), Status: ${e.status}, Duration: ${e.durationMinutes}m`);
        });
    }

    console.log("\n--- All Time Entries for 'System Admin' ---");
    const admin = users.find(u => u.name === 'System Admin' || u.role === 'ADMIN');
    if (admin) {
        const adminEntries = await prisma.timeEntry.findMany({
            where: { userId: admin.id }
        });
        adminEntries.forEach(e => {
            console.log(`Entry ID: ${e.id}, Status: ${e.status}, Date: ${e.date}`);
        });
    } else {
        console.log("Could not find System Admin user to check specific entries.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
