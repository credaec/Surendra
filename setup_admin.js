import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up database...');

    // Delete all existing users to start fresh as requested
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    console.log('Creating fresh admin user...');
    const admin = await prisma.user.create({
        data: {
            id: 'admin_01',
            name: 'System Admin',
            email: 'admin@localhost.com',
            password: hashedPassword,
            role: 'ADMIN',
            designation: 'Administrator',
            department: 'IT',
            avatarInitials: 'SA',
            status: 'ACTIVE'
        }
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@localhost.com');
    console.log('Password: admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
