import { Service } from 'node-windows';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new service object
const svc = new Service({
    name: 'CredenceTimeTracker',
    description: 'Credence Time Tracker Backend Service',
    script: path.join(__dirname, '../server/index.js'),
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
    //, workingDirectory: '...'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
    console.log('Service installed and started.');
});

// Just in case this file is run twice.
svc.on('alreadyinstalled', function () {
    console.log('This service is already installed.');
    svc.start();
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start', function () {
    console.log(svc.name + ' started!\nVisit http://127.0.0.1:3000 to see it in action.');
});

// Install the script as a service.
svc.install();
