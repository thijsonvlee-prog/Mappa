import { test, expect } from '@playwright/test';
import { resetAppState, skipOnboarding, clickOnMap } from './helpers';

test.describe('import and export', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppState(page);
    await skipOnboarding(page);
  });

  test('exporting downloads a JSON file', async ({ page }) => {
    await clickOnMap(page);
    await page.getByRole('radio', { name: 'Visited', exact: true }).click();
    await page.keyboard.press('Escape');

    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Export', exact: true }).click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export', exact: true }).last().click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/^mappa-export-.*\.json$/);
  });

  test('resetting clears all data and returns to onboarding', async ({ page }) => {
    await clickOnMap(page);
    await page.getByRole('radio', { name: 'Visited', exact: true }).click();
    await page.keyboard.press('Escape');

    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Reset', exact: true }).click();

    await page.getByPlaceholder('DELETE').fill('DELETE');
    await page.getByRole('button', { name: 'Reset Everything' }).click();

    await expect(page.getByRole('heading', { name: 'Welcome to Mappa' })).toBeVisible();
  });

  test('exported data can be re-imported after a reset', async ({ page }) => {
    await clickOnMap(page);
    const countryName = (await page.getByTestId('quick-panel-country-name').textContent())!.trim();
    await page.getByRole('radio', { name: 'Visited', exact: true }).click();
    await page.keyboard.press('Escape');

    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Export', exact: true }).click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export', exact: true }).last().click(),
    ]);
    const filePath = await download.path();
    expect(filePath).toBeTruthy();

    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await page.getByPlaceholder('DELETE').fill('DELETE');
    await page.getByRole('button', { name: 'Reset Everything' }).click();

    await page.getByRole('button', { name: 'Skip setup' }).click();
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.getByRole('button', { name: 'Import', exact: true }).click();

    await page.locator('input[type="file"]').setInputFiles(filePath!);
    await expect(page.getByText('1 countries')).toBeVisible();

    await page.getByRole('button', { name: 'Import', exact: true }).last().click();

    await page.getByRole('link', { name: 'Countries' }).click();
    await page.getByPlaceholder('Search countries...').fill(countryName);
    await expect(page.getByText('Visited', { exact: true }).first()).toBeVisible();
  });
});
