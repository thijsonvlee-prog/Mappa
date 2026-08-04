import { test, expect } from '@playwright/test';
import { resetAppState } from './helpers';

test.describe('onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppState(page);
  });

  test('shows the welcome screen on first load', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to Mappa' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Skip setup' })).toBeVisible();
  });

  test('skipping onboarding lands on the map page', async ({ page }) => {
    await page.getByRole('button', { name: 'Skip setup' }).click();

    await expect(page.getByRole('heading', { name: 'Welcome to Mappa' })).not.toBeVisible();
    await expect(page.locator('.rsm-svg')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Map' })).toBeVisible();
  });

  test('completing all steps marks the selected countries as visited', async ({ page }) => {
    await page.getByRole('button', { name: 'Get Started' }).click();

    await page.getByPlaceholder('Search countries...').fill('Netherlands');
    await page.getByRole('button', { name: /Netherlands/ }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await page.getByPlaceholder('Search countries...').fill('Japan');
    await page.getByRole('button', { name: /Japan/ }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await expect(page.getByText(/You've visited 2 countries/)).toBeVisible();
    await page.getByRole('button', { name: 'Explore Your Map' }).click();

    await expect(page.locator('.rsm-svg')).toBeVisible();

    await page.getByRole('link', { name: 'Countries' }).click();
    await page.getByPlaceholder('Search countries...').fill('Netherlands');
    await expect(page.getByText('Visited', { exact: true }).first()).toBeVisible();

    await page.getByPlaceholder('Search countries...').fill('Japan');
    await expect(page.getByText('Visited', { exact: true }).first()).toBeVisible();
  });
});
