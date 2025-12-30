import { test, expect } from '@playwright/test';

test.describe('Subscriber Import', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
        await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'testpassword');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should navigate to subscribers page', async ({ page }) => {
        await page.goto('/dashboard/subscribers');
        await expect(page.locator('h1, h2')).toContainText(/subscribers/i);
    });

    test('should show import dialog', async ({ page }) => {
        await page.goto('/dashboard/subscribers');

        // Click import button
        await page.click('button:has-text("Import")');

        // Dialog should appear
        await expect(page.locator('text=/upload|import|csv/i')).toBeVisible();
    });

    test('should upload CSV file', async ({ page }) => {
        await page.goto('/dashboard/subscribers');
        await page.click('button:has-text("Import")');

        // Create a test CSV file
        const csvContent = `User Email,User Name,Subscription Status
test1@example.com,Test User 1,free
test2@example.com,Test User 2,paid`;

        // Upload file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles({
            name: 'test-subscribers.csv',
            mimeType: 'text/csv',
            buffer: Buffer.from(csvContent),
        });

        // Submit
        await page.click('button:has-text("Upload")');

        // Wait for success message
        await expect(page.locator('text=/success|imported/i')).toBeVisible({ timeout: 10000 });
    });
});
