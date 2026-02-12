
import { test, expect } from '@playwright/test';

test.describe('Admin Role Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await page.goto('/login');
        await page.click('text=Administrator');
        await page.fill('input[type="email"]', 'admin@localhost.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/admin/dashboard', { timeout: 10000 });
    });

    test('Admin Dashboard Loads Correctly', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

        // Use getByText with regex for robustness
        await expect(page.getByText(/TOTAL HOURS/i)).toBeVisible();
        await expect(page.getByText(/BILLABLE %/i)).toBeVisible();
        await expect(page.getByText(/TOTAL PROJECT VALUE/i)).toBeVisible();

        await expect(page.getByText(/HOURS TREND/i)).toBeVisible();
        await expect(page.getByText(/LIVE TEAM STATUS/i)).toBeVisible();
    });

    test('Admin Can Manage Team', async ({ page }) => {
        // Navigate to Team
        await page.click('nav >> text=Team / Employees');
        await expect(page).toHaveURL('/admin/team');

        // Verify Header
        await expect(page.getByRole('heading', { name: 'Team Management' })).toBeVisible();

        // Verify Employee List
        await expect(page.locator('text=Add Employee')).toBeVisible();
        await expect(page.locator('table')).toBeVisible();

        // Verify at least one employee exists (Admin or seeded data)
        const rows = page.locator('tbody tr');
        await expect(rows).not.toHaveCount(0);
    });

    test('Admin Can Access Reports', async ({ page }) => {
        // Navigate to Reports
        // Target sidebar specifically to avoid ambiguity
        await page.click('nav >> text=Reports');
        await expect(page).toHaveURL(/\/admin\/reports/);

        // Verify Header
        await expect(page.getByRole('heading', { name: 'Analytics & Reports' })).toBeVisible();

        // Verify Report Types
        await expect(page.getByRole('button', { name: 'Project Performance' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Employee Productivity' })).toBeVisible();
    });
});
