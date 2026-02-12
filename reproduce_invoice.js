
const axios = require('axios');

async function testCreateInvoice() {
    const payload = {
        invoiceNo: `INV-TEST-${Date.now()}`,
        status: 'DRAFT',
        clientId: 'cli_123', // Mock ID, might need real one if relation enforcement is on. schema says @relation... so it NEEDS real ID.
        // Wait, schema has relation: client Client @relation(...). So clientId MUST exist in DB.
        // I need to fetch a client first or use one I know exists.
        // Let's first fetch clients to get a valid ID.
        clientName: 'Test Client',
        date: '2023-10-27', // YYYY-MM-DD format (suspected cause of failure)
        dueDate: '2023-11-27',
        amount: 100,
        subtotal: 100,
        taxAmount: 0,
        totalAmount: 100,
        balanceAmount: 100,
        currency: 'USD',
        items: [{ description: 'Test Item', quantity: 1, unitPrice: 100, amount: 100 }]
    };

    try {
        console.log("Fetching clients to get valid ID...");
        const clientsRes = await axios.get('http://localhost:3002/api/clients');
        const clients = clientsRes.data;
        if (clients.length === 0) {
            console.error("No clients found. Cannot test invoice creation without valid clientId.");
            return;
        }
        payload.clientId = clients[0].id;
        console.log(`Using clientId: ${payload.clientId}`);

        console.log("Sending payload:", JSON.stringify(payload, null, 2));
        const res = await axios.post('http://localhost:3002/api/invoices', payload);
        console.log("Success:", res.data);
    } catch (error) {
        if (error.response) {
            console.error("Server Error:", error.response.status, error.response.data);
        } else {
            console.error("Network/Other Error:", error.message);
        }
    }
}

testCreateInvoice();
