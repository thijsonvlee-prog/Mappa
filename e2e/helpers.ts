import type { Page } from '@playwright/test';

export async function resetAppState(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    indexedDB.deleteDatabase('MappaDB');
  });
  await page.reload();
}

export async function skipOnboarding(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Overslaan' }).click();
}

export async function clickOnMap(page: Page): Promise<void> {
  const svg = page.locator('.rsm-svg');
  const box = await svg.boundingBox();
  if (!box) throw new Error('Map SVG not found');
  await page.mouse.click(box.x + box.width * 0.52, box.y + box.height * 0.42);
}
