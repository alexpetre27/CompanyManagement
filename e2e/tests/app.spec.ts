import fs from "node:fs";
import { test, expect, login, logout, toast, apiToken, API, ADMIN, USER } from "./fixtures";

const PNG = Buffer.from(
  "89504e470d0a1a0a0000000d4948445200000001000000010806000000" +
    "1f15c4890000000d49444154789c63f80f00000101000518d84e0000000049454e44ae426082",
  "hex",
);

test.describe.serial("MicroManager QA", () => {
  // ---------------------------------------------------------------- auth
  test("anonymous users are sent to login", async ({ page }) => {
    for (const p of ["/", "/projects", "/users", "/settings", "/admin", "/status"]) {
      await page.goto(p);
      await expect(page).toHaveURL(/\/login/);
    }
    await expect(page.getByText("GitHub")).toHaveCount(0);
  });

  test("login with wrong password shows an error", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email or Username").fill(ADMIN.id);
    await page.getByPlaceholder("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Invalid credentials.")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("registration validates and creates an account", async ({ page }) => {
    await page.goto("/register");
    const pw = page.getByPlaceholder("••••••••");
    await page.getByPlaceholder("Username").fill(USER.name);
    await page.getByPlaceholder("name@company.com").fill(USER.email);

    await pw.nth(0).fill(USER.pw);
    await pw.nth(1).fill("different1");
    await page.getByRole("button", { name: "Register Now" }).click();
    await expect(page.getByText("Passwords do not match!")).toBeVisible();

    await pw.nth(0).fill("123");
    await pw.nth(1).fill("123");
    await page.getByRole("button", { name: "Register Now" }).click();
    await expect(page.getByText("Password must be at least 6 characters.")).toBeVisible();

    await pw.nth(0).fill(USER.pw);
    await pw.nth(1).fill(USER.pw);
    await page.getByRole("button", { name: "Register Now" }).click();
    await page.waitForURL(/\/login/);
    await expect(toast(page, "Account created")).toBeVisible();
  });

  test("duplicate registration shows the backend's message", async ({ page }) => {
    await page.goto("/register");
    await page.getByPlaceholder("Username").fill(USER.name);
    await page.getByPlaceholder("name@company.com").fill("other@example.com");
    await page.getByPlaceholder("••••••••").nth(0).fill(USER.pw);
    await page.getByPlaceholder("••••••••").nth(1).fill(USER.pw);
    await page.getByRole("button", { name: "Register Now" }).click();
    await expect(page.getByText("Username is already taken")).toBeVisible();
  });

  test("regular user: login by e-mail, restricted navigation, logout", async ({ page }) => {
    await login(page, USER.email.toUpperCase(), USER.pw);
    await expect(page.getByRole("heading", { name: /Hello,\s*Qa_user/ })).toBeVisible();

    const nav = page.locator("aside nav");
    await expect(nav.getByRole("link", { name: "Projects" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Admin Panel" })).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "System Status" })).toHaveCount(0);
    await expect(page.getByText("Admin Command Row")).toHaveCount(0);

    for (const p of ["/admin", "/status"]) {
      const res = await page.goto(p);
      expect(res?.status(), `${p} for non-admin`).toBe(404);
    }

    // signed-in users are bounced away from the auth pages
    await page.goto("/login");
    await expect(page).toHaveURL((u) => u.pathname === "/");
    await page.goto("/register");
    await expect(page).toHaveURL((u) => u.pathname === "/");

    await logout(page);
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  // ---------------------------------------------------------------- tasks
  test("user creates, completes and re-opens a task", async ({ page }) => {
    await login(page, USER.name, USER.pw);
    await expect(page.getByText("You’re all clear ☕")).toBeVisible();

    await page.getByRole("button", { name: "Add", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Create Task" }).click();
    await expect(toast(page, "Please fill in all required fields")).toBeVisible();

    await dialog.getByPlaceholder("e.g. Update API documentation").fill("QA: write test plan");
    await dialog.getByRole("button", { name: "Select a project..." }).click();
    await dialog.getByPlaceholder("Search projects...").fill("analytics");
    await dialog.getByRole("button", { name: "Analytics Engine" }).click();
    await dialog.getByText("HIGH", { exact: true }).click();
    await dialog.getByRole("button", { name: "Create Task" }).click();

    await expect(toast(page, "Task created successfully!")).toBeVisible();
    await expect(dialog).toBeHidden();
    const task = page.getByRole("button", { name: /QA: write test plan/ });
    await expect(task).toBeVisible();
    await expect(task).toContainText("Analytics Engine");

    // dialog opens empty again
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByRole("dialog").getByPlaceholder("e.g. Update API documentation")).toHaveValue("");
    await page.keyboard.press("Escape");

    await task.click();
    await expect(task).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Productivity", { exact: true }).locator("..")).toContainText("100%");
    await expect(page.getByText("Tasks Done").locator("..")).toContainText("1");

    await page.reload();
    await expect(page.getByRole("button", { name: /QA: write test plan/ })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /QA: write test plan/ }).click();
    await expect(page.getByRole("button", { name: /QA: write test plan/ })).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByText("Productivity", { exact: true }).locator("..")).toContainText("0%");
  });

  // ---------------------------------------------------------------- projects (user)
  test("user browses, searches and filters projects", async ({ page }) => {
    await login(page, USER.name, USER.pw);
    await page.locator("aside nav").getByRole("link", { name: "Projects" }).click();
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(page.getByRole("button", { name: "New Project" })).toHaveCount(0);

    const cards = page.locator("h3").filter({ hasNotText: "No projects found" });
    await expect(cards).toHaveCount(4);

    await page.getByPlaceholder("Search projects...").fill("crm");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toHaveText("Legacy CRM");

    await page.getByPlaceholder("Search projects...").fill("");
    await page.getByRole("button", { name: "ON HOLD" }).click();
    await expect(cards).toHaveCount(1);
    await page.getByRole("button", { name: "COMPLETED" }).click();
    await expect(page.getByText("No projects found")).toBeVisible();
    await page.getByRole("button", { name: "Clear all filters" }).click();
    await expect(cards).toHaveCount(4);

    await page.getByText("E-commerce API").click();
    await expect(page).toHaveURL(/\/projects\/\d+$/);
    await expect(page.getByRole("heading", { name: "E-commerce API" })).toBeVisible();
    await expect(page.getByText("FastAPI")).toBeVisible();
    await expect(page.getByText("5000")).toBeVisible();
    await expect(page.getByRole("link", { name: "Manage Team" })).toHaveCount(0);
    const repo = page.getByRole("link", { name: "Repository" });
    await expect(repo).toHaveAttribute("rel", /noopener/);

    await page.getByRole("button", { name: "Back to projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("unknown or malformed project ids show 404", async ({ page }) => {
    await login(page, USER.name, USER.pw);
    for (const id of ["999999", "abc", "1;drop"]) {
      const res = await page.goto(`/projects/${id}`);
      expect(res?.status(), `/projects/${id}`).toBe(404);
    }
  });

  // ---------------------------------------------------------------- settings
  test("settings: profile, avatar, password, preferences", async ({ page }) => {
    await login(page, USER.name, USER.pw);
    await page.locator("aside nav").getByRole("link", { name: "Settings" }).click();
    await expect(page.getByRole("heading", { name: "Account Settings" })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveValue(USER.email);

    // avatar: reject a non-image, accept a PNG
    const tmp = test.info().outputPath("not-image.png");
    fs.writeFileSync(tmp, "<html>nope</html>");
    await page.locator('input[type="file"]').setInputFiles(tmp);
    await expect(toast(page, "Only PNG, JPEG, GIF or WebP images are allowed")).toBeVisible();

    const png = test.info().outputPath("avatar.png");
    fs.writeFileSync(png, PNG);
    await page.locator('input[type="file"]').setInputFiles(png);
    await expect(toast(page, "Avatar updated successfully!")).toBeVisible();
    const img = page.locator('img[src^="/uploads/avatar-"]').first();
    await expect(img).toBeVisible();
    expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);

    // password
    await page.getByRole("button", { name: "Security" }).click();
    await page.getByPlaceholder("Enter current password").fill("wrong-one");
    await page.getByPlaceholder("Enter new password").fill("qaSecret2");
    await page.getByRole("button", { name: "Update Password" }).click();
    await expect(toast(page, "Current password is incorrect")).toBeVisible();
    await page.getByPlaceholder("Enter current password").fill(USER.pw);
    await page.getByRole("button", { name: "Update Password" }).click();
    await expect(toast(page, "Password changed successfully!")).toBeVisible();
    USER.pw = "qaSecret2";

    // preferences persist across reload
    await page.getByRole("button", { name: "Preferences" }).click();
    await page.getByText("Dark Mode").click();
    await expect(page.getByText("Enabled", { exact: true })).toBeVisible();
    await page.waitForTimeout(500);
    await page.reload();
    await page.getByRole("button", { name: "Preferences" }).click();
    await expect(page.getByText("Enabled", { exact: true })).toBeVisible();

    // profile rename keeps the session working
    await page.getByRole("button", { name: "Profile" }).click();
    await page.locator('input[type="text"]').fill("qa_user_renamed");
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(toast(page, "Profile updated successfully!")).toBeVisible();
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Hello,\s*Qa_user_renamed/ })).toBeVisible();
    USER.name = "qa_user_renamed";
  });

  test("settings: taken username shows a conflict", async ({ page }) => {
    await login(page, USER.name, USER.pw);
    await page.goto("/settings");
    await page.locator('input[type="text"]').fill(ADMIN.id);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(toast(page, "Username is already taken")).toBeVisible();
  });

  // ---------------------------------------------------------------- admin
  test("admin dashboard shows the admin row and quick actions", async ({ page }) => {
    await login(page, ADMIN.id, ADMIN.pw);
    await expect(page.getByText("Admin Command Row")).toBeVisible();
    await expect(page.getByText("Total Users").first()).toBeVisible();
    await expect(page.getByText("System Activity Log")).toBeVisible();
    await expect(page.getByRole("link", { name: "New Project" })).toBeVisible();
    const nav = page.locator("aside nav");
    await expect(nav.getByRole("link", { name: "Admin Panel" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "System Status" })).toBeVisible();
  });

  test("admin creates a project with a team member; XSS-looking name is inert", async ({ page }) => {
    await login(page, ADMIN.id, ADMIN.pw);
    await page.goto("/projects");
    await page.getByRole("button", { name: "New Project" }).click();
    const dialog = page.getByRole("dialog");

    await dialog.getByRole("button", { name: "Create Project" }).click();
    await expect(toast(page, "Project name is required.")).toBeVisible();

    const name = `<img src=x onerror=alert(1)> QA Project`;
    await dialog.getByPlaceholder("Auth Service").fill(name);
    await dialog.getByPlaceholder("Service purpose...").fill("Created by the QA suite");
    await dialog.getByPlaceholder("Java, Docker, Redis").fill("Go, Rust, Go");
    await dialog.getByPlaceholder("https://github.com/...").fill("javascript:alert(1)");
    await dialog.getByRole("button", { name: "Create Project" }).click();
    await expect(toast(page, /Repository URL must start with http/)).toBeVisible();

    await dialog.getByPlaceholder("https://github.com/...").fill("https://github.com/example/qa");
    await dialog.getByText(USER.name, { exact: true }).click();
    await expect(dialog.getByRole("checkbox").first()).toBeVisible();
    await dialog.getByRole("button", { name: "Create Project" }).click();
    await expect(toast(page, "Project created")).toBeVisible();

    await page.getByText(name).first().click();
    await expect(page.getByRole("heading", { name })).toBeVisible();
    await expect(page.getByText(USER.name)).toBeVisible();
    await expect(page.locator("span", { hasText: /^Go$/ })).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Manage Team" })).toBeVisible();
  });

  test("admin assigns and unassigns a user from the Team page", async ({ page }) => {
    // put the QA user back in the "unassigned" state first
    const token = await apiToken(ADMIN.id, ADMIN.pw);
    const users = await (await fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } })).json();
    const qa = users.find((u: { username: string }) => u.username === USER.name);
    await fetch(`${API}/users/${qa.id}/unassign`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });

    await login(page, ADMIN.id, ADMIN.pw);
    await page.goto("/users");
    await expect(page.getByText("Pending Assignments")).toBeVisible();
    const row = page.locator("div.p-6").filter({ hasText: USER.email });
    await expect(row).toBeVisible();
    await expect(row.getByRole("button", { name: "Assign" })).toBeDisabled();

    await row.getByRole("button", { name: "Select a project..." }).click();
    await page.getByRole("option", { name: "Legacy CRM" }).click();
    await row.getByLabel("Project role").selectOption("MANAGER");
    await row.getByRole("button", { name: "Assign" }).click();
    await expect(toast(page, "User assigned")).toBeVisible();
    await expect(row).toBeHidden();

    const tableRow = page.locator("tr").filter({ hasText: USER.email });
    await expect(tableRow).toContainText("Legacy CRM");
    await expect(tableRow).toContainText("manager");
    await expect(tableRow).toContainText("USER");

    await tableRow.getByRole("button").click();
    await page.getByRole("menuitem", { name: "Remove from Project" }).click();
    await expect(toast(page, "User removed from project")).toBeVisible();
    await expect(tableRow).toContainText("Unassigned");
  });

  test("assigned user keeps full access (role not overwritten)", async ({ page }) => {
    await login(page, USER.name, USER.pw);
    await page.goto("/projects");
    await expect(page.locator("h3").first()).toBeVisible();
    await page.goto("/users");
    await expect(page.getByText("My Colleagues")).toBeVisible();
    await expect(page.getByText("Pending Assignments")).toHaveCount(0);
  });

  test("admin console: stats, flush cache, maintenance mode", async ({ page, browser }) => {
    await login(page, ADMIN.id, ADMIN.pw);
    await page.goto("/admin");
    await expect(page.getByText("System Command Center")).toBeVisible();
    await expect(page.getByText("SYSTEM ONLINE")).toBeVisible();
    await expect(page.getByText("Recent Users")).toBeVisible();

    await page.getByRole("button", { name: "Flush Cache" }).click();
    await expect(toast(page, /cache/i)).toBeVisible();

    await page.getByRole("button", { name: "Maintenance" }).click();
    await expect(toast(page, /maintenance mode/i)).toBeVisible();

    // what does a regular user see during maintenance?
    const ctx = await browser.newContext();
    const userPage = await ctx.newPage();
    await userPage.goto("/login");
    await userPage.getByPlaceholder("Email or Username").fill(USER.name);
    await userPage.getByPlaceholder("Password").fill(USER.pw);
    await userPage.getByRole("button", { name: "Sign In" }).click();
    await userPage.waitForURL((u) => u.pathname === "/");
    await expect(userPage.getByRole("status").filter({ hasText: "under maintenance" })).toBeVisible();
    await userPage.screenshot({ path: test.info().outputPath("user-during-maintenance.png"), fullPage: true });
    await page.reload();
    await expect(page.getByRole("status").filter({ hasText: "Maintenance mode is ON" })).toBeVisible();

    await page.getByRole("button", { name: "Maintenance" }).click();
    await expect(toast(page, /live/i)).toBeVisible();
    await userPage.reload();
    await expect(userPage.getByRole("status").filter({ hasText: "under maintenance" })).toHaveCount(0);
    await expect(userPage.getByRole("heading", { name: /Hello,/ })).toBeVisible();
    await ctx.close();
  });

  test("status page reports both services operational", async ({ page }) => {
    await login(page, ADMIN.id, ADMIN.pw);
    await page.goto("/status");
    await expect(page.getByText("Operational", { exact: true })).toBeVisible();
    await expect(page.getByText("Online", { exact: true })).toBeVisible();
    await expect(page.getByText("Connected", { exact: true })).toBeVisible();
    await expect(page.getByText("Spring Boot API")).toBeVisible();
    await expect(page.getByText("PostgreSQL Database")).toBeVisible();
  });

  test("admin can open the register page to add a user", async ({ page }) => {
    await login(page, ADMIN.id, ADMIN.pw);
    await page.getByRole("link", { name: "Add User" }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();
  });

  test("a tampered session cookie sends the user back to login", async ({ page, context }) => {
    await login(page, USER.name, USER.pw);
    const cookies = await context.cookies();
    const session = cookies.find((c) => c.name.includes("session-token"));
    expect(session).toBeTruthy();
    await context.addCookies([{ ...session!, value: session!.value.slice(0, -10) + "AAAAAAAAAA" }]);
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("no horizontal overflow on desktop pages", async ({ page }) => {
    await login(page, ADMIN.id, ADMIN.pw);
    for (const p of ["/", "/projects", "/users", "/settings", "/admin", "/status"]) {
      await page.goto(p);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `horizontal overflow on ${p}`).toBeLessThanOrEqual(0);
    }
  });
});

