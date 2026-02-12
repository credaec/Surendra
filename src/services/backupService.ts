import { settingsService } from './settingsService';

const API_BASE = '/api/backup';

export interface BackupLogEntry {
    id: string;
    date: string;
    location: string;
    status: 'SUCCESS' | 'FAILED';
    details: string;
}

export const backupService = {
    performBackup: async () => {
        const response = await fetch(`${API_BASE}/now`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Backup failed');
        }

        return await response.json();
    },

    getBackupHistory: async (): Promise<BackupLogEntry[]> => {
        const response = await fetch(`${API_BASE}/history`);
        if (!response.ok) return [];
        return await response.json();
    },

    testLocalConnection: async (config: { path: string }) => {
        const response = await fetch(`${API_BASE}/test-local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        return await response.json();
    },

    testNetworkConnection: async (config: any) => {
        const response = await fetch(`${API_BASE}/test-network`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        return await response.json();
    },

    testFtpConnection: async (config: any) => {
        const response = await fetch(`${API_BASE}/test-ftp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        return await response.json();
    },

    checkAndRunScheduledBackup: async () => {
        // Logically we could check localstorage for last run, 
        // but backend usually handles cron for backups.
        // For MVP, if user logs in and it's been 24h, trigger it.
        const settings = await settingsService.getSettings();
        if (!settings.backup?.enabled) return;

        const lastRun = settings.backup.lastBackupDate ? new Date(settings.backup.lastBackupDate).getTime() : 0;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (now - lastRun > oneDay) {
            try {
                await backupService.performBackup();
                settingsService.updateSection('backup', {
                    ...settings.backup,
                    lastBackupDate: new Date().toISOString()
                });
            } catch (e) {
                console.warn('Scheduled backup failed:', e);
            }
        }
    }
};
