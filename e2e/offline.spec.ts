import { test, expect } from '@playwright/test';
import { resetAppState, skipOnboarding, clickOnMap } from './helpers';

test.describe('offline support', () => {
  test('previously saved data remains available after going offline', async ({ page, context }) => {
    await resetAppState(page);
    await skipOnboarding(page);

    await clickOnMap(page);
    const countryName = (await page.getByTestId('quick-panel-country-name').textContent())!.trim();
    await page.getByRole('radio', { name: 'Visited', exact: true }).click();
    await page.keyboard.press('Escape');

    await page
      .waitForFunction(() => navigator.serviceWorker?.ready.then(() => true), null, { timeout: 15000 })
      .catch(() => {});
    await page.waitForTimeout(1000);

    await context.setOffline(true);
    await page.reload();

    await expect(page.locator('.rsm-svg')).toBeVisible({ timeout: 10000 });

    await page.getByRole('link', { name: 'Countries' }).click();
    await page.getByPlaceholder('Search countries...').fill(countryName);
    await expect(page.getByText('Visited', { exact: true }).first()).toBeVisible();

    await context.setOffline(false);
  });
});
