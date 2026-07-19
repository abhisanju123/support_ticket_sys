import { expect, test } from '@playwright/test';

const DEMO_PASSWORD = 'Password123!';

async function loginAs(page, email: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('RBAC end-to-end', () => {
  test('login page supports showing and hiding the password', async ({ page }) => {
    await page.goto('/login');

    const passwordField = page.getByLabel('Password');
    await passwordField.fill(DEMO_PASSWORD);
    await expect(passwordField).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: 'Show password' }).click();
    await expect(passwordField).toHaveAttribute('type', 'text');

    await page.getByRole('button', { name: 'Hide password' }).click();
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('employee cannot delete tickets from the list UI', async ({ page }) => {
    await loginAs(page, 'emily@example.com');
    await page.goto('/tickets');

    await expect(page.getByRole('button', { name: /Delete ticket/i })).toHaveCount(0);
  });

  test('admin can open tickets and sees delete action', async ({ page }) => {
    await loginAs(page, 'jane@example.com');
    await page.goto('/tickets');

    const deleteButtons = page.getByRole('button', { name: /Delete ticket/i });
    const count = await deleteButtons.count();

    if (count === 0) {
      await page.getByRole('link', { name: 'Create Ticket' }).click();
      await page.getByLabel('Title').fill('E2E RBAC ticket');
      await page.getByLabel('Description').fill('Created by Playwright RBAC test');
      await page.getByLabel('Priority').click();
      await page.getByRole('option', { name: 'Medium' }).click();
      await page.getByLabel('Assigned To').click();
      await page.getByRole('option').first().click();
      await page.getByRole('button', { name: 'Create Ticket' }).click();
      await expect(page).toHaveURL(/\/tickets\/\d+/);
      await page.goto('/tickets');
    }

    await expect(page.getByRole('button', { name: /Delete ticket/i }).first()).toBeVisible();
  });

  test('employee create ticket appears in their ticket list', async ({ page }) => {
    const uniqueTitle = `E2E employee ticket ${Date.now()}`;

    await loginAs(page, 'emily@example.com');
    await page.goto('/tickets/create');
    await page.getByLabel('Title').fill(uniqueTitle);
    await page.getByLabel('Description').fill('Employee RBAC create/list test');
    await page.getByLabel('Priority').click();
    await page.getByRole('option', { name: 'Low' }).click();
    await page.getByLabel('Assigned To').click();
    await page.getByRole('option').first().click();
    await page.getByRole('button', { name: 'Create Ticket' }).click();

    await expect(page).toHaveURL(/\/tickets\/\d+/);
    await page.goto('/tickets');
    await expect(page.getByText(uniqueTitle)).toBeVisible();
  });
});
