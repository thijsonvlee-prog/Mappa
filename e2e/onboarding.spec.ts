import { test, expect } from '@playwright/test';
import { resetAppState } from './helpers';

test.describe('onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppState(page);
  });

  test('shows the welcome screen on first load', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Mappa', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Begin je atlas' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overslaan' })).toBeVisible();
  });

  test('skipping onboarding lands on the map page', async ({ page }) => {
    await page.getByRole('button', { name: 'Overslaan' }).click();

    await expect(page.getByRole('button', { name: 'Begin je atlas' })).not.toBeVisible();
    await expect(page.locator('.rsm-svg')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Atlas' })).toBeVisible();
  });

  test('completing all steps marks the selected countries as visited', async ({ page }) => {
    await page.getByRole('button', { name: 'Begin je atlas' }).click();

    await page.getByPlaceholder('Zoek landen...').fill('Netherlands');
    await page.getByRole('button', { name: /Netherlands/ }).click();
    await page.getByRole('button', { name: 'Volgende' }).click();

    await page.getByPlaceholder('Zoek landen...').fill('Japan');
    await page.getByRole('button', { name: /Japan/ }).click();
    await page.getByRole('button', { name: 'Volgende' }).click();

    await expect(page.getByText(/Je hebt 2 landen bezocht/)).toBeVisible();
    await page.getByRole('button', { name: 'Ontdek je kaart' }).click();

    await expect(page.locator('.rsm-svg')).toBeVisible();

    await page.getByRole('link', { name: 'Landen' }).click();
    await page.getByPlaceholder('Zoek landen...').fill('Netherlands');
    await expect(page.getByText('Bezocht', { exact: true }).first()).toBeVisible();

    await page.getByPlaceholder('Zoek landen...').fill('Japan');
    await expect(page.getByText('Bezocht', { exact: true }).first()).toBeVisible();
  });
});
