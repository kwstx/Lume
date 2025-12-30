import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should display login page', async ({ page }) => {
        await page.goto('/login');

        await expect(page.locator('h1')).toContainText(/sign in|login/i);
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'invalid@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Wait for error message
        await expect(page.locator('text=/invalid|incorrect|wrong/i')).toBeVisible();
    });

    test('should redirect to dashboard after successful login', async ({ page }) => {
        await page.goto('/login');

        // Use test credentials (you'll need to set these up)
        await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
        await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'testpassword');
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL(/\/dashboard/);
    });
});
