import { test, expect } from '@playwright/test';

test.describe('Employee Role Tests', () => {
    test.beforeEach(async ({ page, request }) => {
        // Create a test employee to ensure we have valid credentials
        // The seed data might not have passwords set correctly since they are raw inserts.
        try {
            await request.post('/api/users', {
                data: {
                    id: 'TEST-EMP-001',
                    name: 'Test Employee',
                    email: 'testemployee@credaec.in',
                    password: 'password123',
                    role: 'EMPLOYEE',
                    department: 'QA',
                    designation: 'Tester',
                    avatarInitials: 'TE',
                    status: 'ACTIVE'
                }
            });
        } catch (e) {
            // Ignore if already exists (although usually we should handle cleanup)
            console.log('User creation might have failed or already exists', e);
        }

        // Login as Employee
        await page.goto('/login');
        await page.fill('input[type="email"]', 'testemployee@credaec.in');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/employee\/dashboard/, { timeout: 10000 });
    });

    test('Employee Dashboard Loads Correctly', async ({ page }) => {
        // Verify Header
        // Dashboard heading is 'Welcome back, Test!'
        await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();

        // Verify Personal KPIs
        // Look for "Today Logged" or "This Week"
        await expect(page.getByText(/Today Logged/i)).toBeVisible();
        await expect(page.getByText(/This Week/i)).toBeVisible();

        // Verify no Admin links
        await expect(page.getByRole('link', { name: 'Team / Employees' })).not.toBeVisible();
        await expect(page.getByRole('link', { name: 'Invoices' })).not.toBeVisible();
    });

    test('Employee Can View My Projects', async ({ page }) => {
        await page.click('nav >> text=My Projects');
        await expect(page).toHaveURL(/\/employee\/projects/);

        // Verify Header - Might be "My Projects" or "Active Scope" or similar
        await expect(page.getByRole('heading', { name: /My Projects/i }).or(page.getByRole('heading', { name: /Active Scope/i }))).toBeVisible();
    });

    test('Employee Can Access Timesheet', async ({ page }) => {
        await page.click('nav >> text=Timesheet');
        // Timesheet page might be /employee/timesheet
        await expect(page).toHaveURL(/\/employee\/timesheet/);

        // Verify we are on the timesheet page
        // Use visible locator and specify level to avoid ambiguity with "Timesheet Snapshot"
        await expect(page.getByRole('heading', { name: 'Timesheet', exact: true, level: 1 })).toBeVisible();
    });

    test('Employee Can Access My Reports', async ({ page }) => {
        await page.click('nav >> text=My Reports');
        await expect(page).toHaveURL(/\/employee\/reports/);

        // Verify Header
        await expect(page.getByRole('heading', { name: /Reports/i })).toBeVisible();

        // Check for filters OR empty state
        // If empty, maybe "No reports found"
        // But usually filters are always there.
        // Let's check for "Report Type" or "Date Range" or "Generate"
        await expect(page.getByText(/Date/i).or(page.getByRole('button', { name: /Generate/i }))).toBeVisible();
    });
});
