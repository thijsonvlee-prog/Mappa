import { test, expect } from '@playwright/test';
import { resetAppState, skipOnboarding } from './helpers';

test.describe('country list', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppState(page);
    await skipOnboarding(page);
    await page.getByRole('link', { name: 'Countries' }).click();
  });

  test('lists all 195 countries by default', async ({ page }) => {
    await expect(page.getByText('195 countries')).toBeVisible();
  });

  test('searching narrows the list to matching countries', async ({ page }) => {
    await page.getByPlaceholder('Search countries...').fill('Japan');

    await expect(page.getByText('1 country', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Japan', level: 3 })).toBeVisible();
  });

  test('clicking a country opens its detail sheet', async ({ page }) => {
    await page.getByPlaceholder('Search countries...').fill('Japan');
    await page.getByRole('button', { name: /Japan/ }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Japan', level: 2, exact: true })).toBeVisible();
  });

  test('changing status in the detail sheet persists after closing and reopening', async ({ page }) => {
    await page.getByPlaceholder('Search countries...').fill('Japan');
    await page.getByRole('button', { name: /Japan/ }).click();

    await page.getByRole('dialog').getByRole('radio', { name: 'Visited', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();

    await expect(page.getByText('Visited', { exact: true }).first()).toBeVisible();

    await page.getByRole('button', { name: /Japan/ }).click();
    await expect(
      page.getByRole('dialog').getByRole('radio', { name: 'Visited', exact: true }),
    ).toHaveAttribute('data-state', 'on');
  });
});
