import { test as base, expect, type Page } from "@playwright/test";

export const API = process.env.E2E_API_URL || "http://localhost:8080/api";
export const ADMIN = {
  id: process.env.E2E_ADMIN_USERNAME || "admin",
  pw: process.env.E2E_ADMIN_PASSWORD || "AdminPass123",
};
export const USER = { name: "qa_user", email: "qa.user@example.com", pw: "qaSecret1" };

/**
 * Every test fails if the page logs a console error, throws an uncaught exception,
 * or receives a 5xx response — these are bugs even when the UI looks fine.
 */
export const test = base.extend<{ problems: string[] }>({
  problems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on("console", (msg) => {
        // "Failed to load resource" duplicates the response check below, which knows the resource type.
        if (msg.type() === "error" && !msg.text().startsWith("Failed to load resource"))
          problems.push(`console: ${msg.text()}`);
      });
      page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
      page.on("response", (res) => {
        const isDocument = res.request().resourceType() === "document";
        // A 404 *page* can be intentional (tests visit forbidden URLs); a broken sub-resource never is.
        if (res.status() >= 500 || (res.status() >= 400 && !isDocument && !res.url().includes("/api/auth/")))
          problems.push(`HTTP ${res.status()} ${res.request().resourceType()} ${res.url()}`);
      });
      page.on("dialog", async (dialog) => {
        if (dialog.type() === "confirm") return dialog.accept();
        problems.push(`unexpected ${dialog.type()}: ${dialog.message()}`);
        await dialog.dismiss();
      });
      await use(problems);
      expect(problems, "console errors / page errors / 5xx responses").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };

export async function login(page: Page, id: string, pw: string) {
  await page.goto("/login");
  await page.getByPlaceholder("Email or Username").fill(id);
  await page.getByPlaceholder("Password").fill(pw);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL((u) => u.pathname === "/");
  await expect(page.getByRole("heading", { name: /Hello,/ })).toBeVisible();
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "Sign Out" }).click();
  await page.waitForURL(/\/login/);
}

export const toast = (page: Page, text: string | RegExp) =>
  page.locator("[data-sonner-toast]").filter({ hasText: text }).first();

export async function apiToken(id: string, pw: string): Promise<string> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: id, password: pw }),
  });
  if (!res.ok) throw new Error(`login ${id} failed: ${res.status}`);
  return (await res.json()).token;
}
