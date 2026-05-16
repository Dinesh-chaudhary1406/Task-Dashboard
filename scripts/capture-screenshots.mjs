/** Regenerate README screenshots: npm run preview, then npx playwright install chromium && npx playwright run (or node this file after npm i -D playwright) */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:4173';
const OUT = 'docs/screenshots';

const sampleTasks = [
  {
    id: 'a1111111-1111-4111-8111-111111111111',
    title: 'Draft Q3 roadmap',
    description: 'Outline milestones and stakeholders for the next quarter.',
    priority: 'high',
    dueDate: '2026-05-25',
    status: 'pending',
    createdAt: '2026-05-10T10:00:00.000Z',
    order: 0,
  },
  {
    id: 'b2222222-2222-4222-8222-222222222222',
    title: 'Review pull requests',
    description: 'Focus on accessibility and test coverage.',
    priority: 'medium',
    dueDate: '2026-05-20',
    status: 'completed',
    createdAt: '2026-05-09T14:00:00.000Z',
    order: 1,
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    title: 'Update documentation',
    description: 'README setup steps and deployment notes.',
    priority: 'low',
    dueDate: '2026-05-30',
    status: 'pending',
    createdAt: '2026-05-08T09:00:00.000Z',
    order: 2,
  },
];

async function seed(page, { view = 'card', theme = 'dark' } = {}) {
  await page.goto(BASE);
  await page.evaluate(
    ({ tasks, view, theme }) => {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('taskflow_view', JSON.stringify(view));
      localStorage.setItem('taskflow_theme', JSON.stringify(theme));
    },
    { tasks: sampleTasks, view, theme },
  );
  await page.reload();
  await page.waitForSelector('text=Your tasks', { timeout: 15000 });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await mkdir(OUT, { recursive: true });

await seed(page, { view: 'card', theme: 'dark' });
await page.screenshot({ path: `${OUT}/dashboard-dark-cards.png`, fullPage: true });

await page.getByRole('button', { name: 'List view' }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/dashboard-list.png`, fullPage: true });

await page.getByRole('button', { name: 'Create new task' }).click();
await page.waitForSelector('role=dialog');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/task-modal.png`, fullPage: true });
await page.keyboard.press('Escape');

await page.getByRole('button', { name: 'Switch to light mode' }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/dashboard-light.png`, fullPage: true });

await browser.close();
console.log('Screenshots saved to', OUT);
