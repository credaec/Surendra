
import http from 'http';

const data = JSON.stringify({
    employeeId: 'admin_01',
    startDate: '2026-02-09',
    endDate: '2026-02-15'
});

const options = {
    hostname: 'localhost',
    port: 3005,
    path: '/api/approvals',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
