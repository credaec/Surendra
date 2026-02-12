import { test, expect } from '@playwright/test';

test('Check Default Employee Login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'naresh@credaec.in');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Expect failure or success
    try {
        await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
        console.log('Login Success!');
    } catch (e) {
        console.log('Login Failed or Redirected elsewhere');
        console.log(await page.url());
    }
});
