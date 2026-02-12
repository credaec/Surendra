import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cache transport to avoid recreating heavily
let transporter = null;

const getTransporter = async () => {
    // 1. Fetch settings from DB
    const settings = await prisma.systemSettings.findUnique({
        where: { id: 'email-settings' }
    });

    if (!settings) {
        throw new Error('Email settings not configured.');
    }

    const config = JSON.parse(settings.value);

    // 2. Create transporter if not exists or config changed (simplified for now)
    // In a real app we might verify config matches
    transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: parseInt(config.smtpPort),
        secure: config.smtpPort === '465', // true for 465, false for other ports
        auth: {
            user: config.smtpUser,
            pass: config.smtpPass,
        },
    });

    return transporter;
};

export const sendInvoiceEmail = async (invoice, clientEmail, subject, message) => {
    try {
        const transport = await getTransporter();

        // Verify connection configuration
        await transport.verify();

        const mailOptions = {
            from: '"Credence Tracker" <no-reply@credencetracker.com>', // Sender address (mock)
            to: clientEmail,
            subject: subject || `Invoice #${invoice.id} from Credence`,
            text: message || `Dear Client,\n\nPlease find attached invoice #${invoice.id}.\n\nTotal: ${invoice.totalAmount}\n\nThank you.`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Invoice #${invoice.id}</h2>
                    <p>${message ? message.replace(/\n/g, '<br>') : 'Please find your invoice details below.'}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>Amount Due:</strong> $${invoice.totalAmount}</p>
                    <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                    <br />
                    <p>Thank you for your business!</p>
                </div>
            `
        };

        const info = await transport.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return info;

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
