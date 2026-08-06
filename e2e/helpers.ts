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
  await page.waitForSelector('.rsm-geography', { timeout: 15000 });

  // Fixed fractional coordinates are unreliable — they depend on the
  // projection and viewport, and land in open ocean as often as on a country.
  // Instead find the largest country whose bounding-box centre actually
  // hit-tests to its own path (which rules out shapes like Russia, whose bbox
  // centre sits in the Pacific because the country wraps the antimeridian).
  const target = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('.rsm-geography'));
    let best: { x: number; y: number; area: number } | null = null;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (document.elementFromPoint(x, y) !== el) continue;
      const area = r.width * r.height;
      if (!best || area > best.area) best = { x, y, area };
    }
    return best;
  });

  if (!target) throw new Error('No clickable country found on the map');
  await page.mouse.click(target.x, target.y);
}
