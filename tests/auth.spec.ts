
import { test, expect } from '@playwright/test';

test('Admin Login Smoke Test', async ({ page }) => {
    await page.goto('/login');

    // Check strict visibility of login elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Monitor Network
    page.on('response', response => {
        if (response.url().includes('/api/') && response.status() !== 200) {
            console.log(`API Error: ${response.url()} returned ${response.status()}`);
        }
    });

    // Handle Alerts
    page.on('dialog', async dialog => {
        console.log(`Alert message: ${dialog.message()}`);
        await dialog.dismiss();
    });

    // Log Browser Console
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    page.on('pageerror', exception => console.log(`Uncaught exception: "${exception}"`));


    // Perform Login
    await page.click('text=Administrator'); // Switch to Admin role UI
    await page.fill('input[type="email"]', 'admin@localhost.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verify Dashboard Load
    await expect(page).toHaveURL('/admin/dashboard', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    // "Total Hours" might take a moment to load
    await expect(page.locator('text=Total Hours')).toBeVisible();

    // Take a screenshot for evidence
    await page.screenshot({ path: 'tests/evidence/admin_dashboard.png' });
});
