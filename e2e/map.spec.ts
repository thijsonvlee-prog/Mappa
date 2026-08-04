import { test, expect } from '@playwright/test';
import { resetAppState, skipOnboarding, clickOnMap } from './helpers';

test.describe('map', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppState(page);
    await skipOnboarding(page);
  });

  test('renders the world map with many country shapes', async ({ page }) => {
    await expect(page.locator('.rsm-svg')).toBeVisible();
    const count = await page.locator('.rsm-geography').count();
    expect(count).toBeGreaterThan(100);
  });

  test('clicking a country opens the quick panel with status options', async ({ page }) => {
    await clickOnMap(page);

    await expect(page.getByRole('radiogroup')).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Not Visited', exact: true })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Planned', exact: true })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Visited', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Details' })).toBeVisible();
  });

  test('changing status via the quick panel persists to the country list', async ({ page }) => {
    await clickOnMap(page);
    const countryName = await page.getByTestId('quick-panel-country-name').textContent();
    expect(countryName).toBeTruthy();

    await page.getByRole('radio', { name: 'Visited', exact: true }).click();
    await page.getByRole('button', { name: 'View Details' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(
      page.getByRole('dialog').getByRole('radio', { name: 'Visited', exact: true }),
    ).toHaveAttribute('data-state', 'on');

    await page.keyboard.press('Escape');
    await page.getByRole('link', { name: 'Countries' }).click();

    await page.getByPlaceholder('Search countries...').fill(countryName!.trim());
    await expect(page.getByText('Visited', { exact: true }).first()).toBeVisible();
  });
});
