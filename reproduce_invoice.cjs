
async function testCreateInvoice() {
    try {
        // 1. Fetch a valid client
        let clientId = '';
        console.log("Fetching clients...");
        const clientsRes = await fetch('http://localhost:3002/api/clients');
        const clients = await clientsRes.json();

        if (clients.length > 0) {
            clientId = clients[0].id;
            console.log("Using Client ID:", clientId);
        } else {
            console.log("No clients found. Creating one...");
            const newClientRes = await fetch('http://localhost:3002/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test Client',
                    email: 'test@client.com',
                    companyName: 'Test Corp'
                })
            });
            const newClient = await newClientRes.json();
            clientId = newClient.id;
            console.log("Created Client ID:", clientId);
        }

        // 2. Exact sanitized payload structure
        const payload = {
            invoiceNo: `INV-${Date.now()}`,
            clientId: clientId,
            clientName: 'Test Corp',
            projectId: null,
            projectName: null,
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            status: 'DRAFT',
            items: [{ id: '1', description: 'Test Item', quantity: 1, unitPrice: 100, amount: 100 }],
            notes: 'Test notes',

            subtotal: 100,
            taxAmount: 0,
            totalAmount: 100,
            balanceAmount: 100,
            currency: 'USD'
        };

        console.log("Sending payload...", JSON.stringify(payload, null, 2));
        const res = await fetch('http://localhost:3002/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("---------------- ERROR ----------------");
            console.error("Status:", res.status);
            console.error("Response:", errorText);
            console.error("---------------------------------------");
        } else {
            const data = await res.json();
            console.log("Success! Invoice Created:", data);
        }
    } catch (e) {
        console.error("Script failed:", e.message);
    }
}

testCreateInvoice();
