import { test, expect, login, ADMIN } from "./fixtures";

test.describe("mobile layout", () => {
  test("hamburger menu navigates and pages do not overflow", async ({ page }) => {
    await login(page, ADMIN.id, ADMIN.pw);

    const aside = page.locator("aside");
    await expect(aside).not.toBeInViewport();
    await page.locator("div.lg\\:hidden button").first().click();
    await expect(aside).toBeInViewport();
    await aside.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(aside).not.toBeInViewport();

    for (const p of ["/", "/projects", "/users", "/settings", "/admin", "/status", "/login"]) {
      await page.goto(p);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect.soft(overflow, `horizontal overflow on ${p} (px)`).toBeLessThanOrEqual(0);
    }
  });
});
