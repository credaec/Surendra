import { test, expect } from '@playwright/test';

test('Verify Dark Mode Toggle', async ({ page }) => {
    // Go to login page
    await page.goto('/login');

    // Check initial state (should be light or system default, usually no 'dark' class on html)
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // Find Dark Mode Toggle
    // Based on previous snapshot, it's a button with "Switch to Dark Mode" or just an icon.
    // Snapshot showed: button "Switch to Dark Mode" [ref=e60]
    // But that was on Dashboard. Login page likely has it too?
    // Snapshot of Login (Step 4414) did NOT show it explicitly in the text list, but maybe it's there.
    // Let's assume it's in the Dashboard which layout has it.

    // Login first
    await page.fill('input[type="email"]', 'admin@localhost.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/dashboard/);

    // Find Toggle
    // It's usually in the header/banner.
    const toggle = page.getByRole('button', { name: /Switch to Dark Mode/i }).or(page.locator('button:has(.lucide-moon)'));

    // Click Toggle
    await toggle.click();

    // Verify 'dark' class added to html
    await expect(html).toHaveClass(/dark/);

    // Click again
    await toggle.click();

    // Verify 'dark' class removed
    await expect(html).not.toHaveClass(/dark/);
});
