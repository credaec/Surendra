
import http from 'http';

const makeRequest = (method, path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3002,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: body });
            });
        });

        req.on('error', (e) => reject(e));
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

const run = async () => {
    try {
        console.log('1. Getting Clients...');
        const clientsRes = await makeRequest('GET', '/api/clients');
        console.log('Clients Status:', clientsRes.status);

        let clients = [];
        try {
            clients = JSON.parse(clientsRes.body);
        } catch (e) {
            console.log('Failed to parse clients:', clientsRes.body);
        }

        let clientId;
        let clientName;

        if (clients.length > 0) {
            clientId = clients[0].id;
            clientName = clients[0].name;
            console.log(`Using existing client: ${clientName} (${clientId})`);
        } else {
            console.log('Creating new client...');
            const newClientRes = await makeRequest('POST', '/api/clients', {
                name: 'Debug Client',
                companyName: 'Debug Co'
            });
            const newClient = JSON.parse(newClientRes.body);
            clientId = newClient.id;
            clientName = newClient.name;
            console.log(`Created client: ${clientName} (${clientId})`);
        }

        console.log('2. Creating Project...');
        const projectPayload = {
            name: "Debug Project " + Date.now(),
            clientId: clientId,
            clientName: clientName,
            startDate: "2024-01-01",
            status: "PLANNED",
            billingMode: "HOURLY_RATE",
            rateLogic: "GLOBAL_PROJECT_RATE",
            currency: "USD",
            teamMembers: [],
            entryRules: { notesRequired: false },
            alerts: { budgetThresholdPct: 80 }
        };

        console.log('Sending Payload:', JSON.stringify(projectPayload, null, 2));

        const projectRes = await makeRequest('POST', '/api/projects', projectPayload);
        console.log('Project Creation Status:', projectRes.status);
        console.log('Project Creation Body:', projectRes.body);

    } catch (err) {
        console.error('Error:', err);
    }
};

run();
