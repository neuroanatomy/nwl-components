import { expect, userEvent, waitFor, within } from '@storybook/test';
import { onUnmounted } from 'vue';

import DamagedProjects from './DamagedProjects.vue';

// The admin page's "Damaged projects" section (3.7.0). A mocked server answers the
// /admin/json/projects/… requests (as the batched files loader's story, SettingsPage), and
// window.confirm is stubbed: it records its texts and answers `confirmAnswer`.
export default {
  title: 'Admin/DamagedProjects',
  component: DamagedProjects
};

const UNDO_URL = '/admin/json/projects/restore';
const STALE = 'Project inc1 has changed since it was listed: reload the list';

const makeProjects = () => [
  {
    shortname: 'inc1',
    name: 'Incomplete save',
    owner: 'alice',
    version: 'v1',
    files: 100,
    versions: 3,
    missing: 2,
    suspected: true,
    currentVersions: [{ id: 'c1', modified: '2026-10-01T09:30:00.000Z', modifiedBy: 'alice' }],
    events: [{ save: 's1', modified: '2026-09-30T14:05:00.000Z', modifiedBy: 'bob', before: 102, after: 100, stillMissing: 2, annotated: 1, incomplete: true, examples: ['a.svs', 'b.svs'] }]
  },
  {
    shortname: 'two',
    name: 'Two current versions',
    owner: 'carol',
    version: 'v2',
    files: 5,
    versions: 4,
    missing: 1,
    suspected: false,
    currentVersions: [
      { id: 'c2', modified: '2026-10-02T10:00:00.000Z', modifiedBy: 'carol' },
      { id: 'c3', modified: '2026-10-03T11:00:00.000Z' }
    ],
    events: [{ save: 's2', modified: '2026-10-02T10:00:00.000Z', modifiedBy: 'carol', before: 6, after: 5, stillMissing: 1, annotated: 0, incomplete: false, examples: ['c.svs'] }]
  }
];

const server = {};
const json = (body, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status }));
const routes = {
  '/admin/json/projects/damaged': () => json({ success: true, list: server.projects }),
  '/admin/json/projects/restore-files': (body) => {
    if (server.conflict) {
      return json({ success: false, error: STALE }, 409);
    }
    server.projects = server.projects.filter((p) => p.shortname !== body.project);

    return json({ success: true, restored: 2, files: 102, log: 'log-1' });
  },
  '/admin/json/projects/fix-current': (body) => {
    server.projects = server.projects.filter((p) => p.shortname !== body.project);

    return json({ success: true, backups: 1 });
  },
  [UNDO_URL]: () => {
    server.projects = makeProjects();

    return json({ success: true, restored: 1 });
  }
};
const withServer = () => ({
  setup () {
    const originalFetch = window.fetch;
    const originalConfirm = window.confirm;
    Object.assign(server, { projects: makeProjects(), requests: [], confirms: [], confirmAnswer: true, conflict: false });
    window.fetch = (url, options = {}) => {
      const route = routes[String(url)];
      if (!route) { return originalFetch(url, options); }
      const body = options.body ? JSON.parse(options.body) : null;
      server.requests.push({ url: String(url), method: options.method || 'GET', body });

      return route(body);
    };
    window.confirm = (text) => {
      server.confirms.push(text);

      return server.confirmAnswer;
    };
    onUnmounted(() => {
      window.fetch = originalFetch;
      window.confirm = originalConfirm;
    });
  },
  template: '<story/>'
});

const Template = (args) => ({
  components: { DamagedProjects },
  setup: () => ({ args }),
  template: '<DamagedProjects v-bind="args" />'
});

const block = (canvasElement, shortname) => canvasElement.querySelector(`div.project[data-shortname="${shortname}"]`);
const posts = () => server.requests.filter((r) => r.method === 'POST');
const lists = () => server.requests.filter((r) => r.url === '/admin/json/projects/damaged').length;
const find = async (canvasElement) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: 'Find damaged projects' }));
  await waitFor(() => expect(block(canvasElement, 'inc1')).not.toBeNull());
};

// microdraw's: the dates with the time, and the undo of a restore
export const List = Template.bind({});
List.args = { showTime: true, undoUrl: UNDO_URL };
List.decorators = [withServer];
// eslint-disable-next-line max-statements
List.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('heading', { level: 2 }).textContent).toBe('Damaged projects');
  await expect(canvasElement.querySelector('.help').textContent.replace(/\s+/gu, ' ')).toContain('as a new version (Restore the previous version puts the previous one back). Keep the most recent');
  await expect(server.requests.length).toBe(0);

  // the buttons are buttons, in the tab order, and Enter on the focused one searches
  const findButton = canvas.getByRole('button', { name: 'Find damaged projects' });
  await expect(findButton.tabIndex).toBe(0);
  await userEvent.tab();
  await expect(document.activeElement).toBe(findButton);
  await expect(getComputedStyle(findButton).outlineStyle).toBe('solid');
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(block(canvasElement, 'inc1')).not.toBeNull());
  await expect(canvasElement.querySelector('.count').textContent).toBe('2 damaged project(s).');
  await expect(findButton.textContent.trim()).toBe('Reload');

  const inc = block(canvasElement, 'inc1');
  await expect(inc.querySelector('h3 .settings').getAttribute('href')).toBe('/project/inc1/settings');
  await expect([...inc.querySelectorAll('.problem')].map((t) => t.textContent)).toEqual(['incomplete save']);
  await expect(inc.querySelector('.counts').textContent).toContain('100 file(s) now, 3 version(s), 2 file(s) missing');
  const event = inc.querySelector('li.event').textContent;
  await expect(event).toContain('incomplete save');
  await expect(event).toContain('2026-09-30 14:05 by bob: 102 → 100 files');
  await expect(event).toContain('2 still missing, 1 with annotations');
  await expect(inc.querySelector('.fix-current')).toBeNull();

  const two = block(canvasElement, 'two');
  await expect([...two.querySelectorAll('.problem')].map((t) => t.textContent)).toEqual(['files removed', '2 current versions']);
  await expect(two.querySelector('.problem.notice').textContent).toBe('files removed');
  await expect(two.querySelector('.current-versions').textContent).toContain('2026-10-03 11:00 by ?;');
  await expect(two.querySelector('button.restore-files').disabled).toBe(true);
  await expect(getComputedStyle(canvasElement.querySelector('.tag')).fontSize).not.toBe('');
};

// a restore, its result, and the undo through undoURL
export const RestoreAndUndo = Template.bind({});
RestoreAndUndo.args = { showTime: true, undoUrl: UNDO_URL };
RestoreAndUndo.decorators = [withServer];
RestoreAndUndo.play = async ({ canvasElement }) => {
  await find(canvasElement);
  await userEvent.click(block(canvasElement, 'inc1').querySelector('button.restore-files'));
  await waitFor(() => expect(block(canvasElement, 'inc1')).toBeNull());
  await expect(server.confirms[0]).toBe('Add back to inc1 the 2 file(s) removed by the save of 2026-09-30 14:05?\n\nThey go at the end of its files, in a new version: you can restore the previous one.');
  await expect(posts()[0]).toEqual({ url: '/admin/json/projects/restore-files', method: 'POST', body: { project: 'inc1', version: 'v1', save: 's1' } });
  await expect(lists()).toBe(2);
  const result = canvasElement.querySelector('p.result');
  await expect(result.textContent).toContain('inc1: restored 2 file(s), it has 102 now.');
  await expect(canvasElement.querySelector('p.error')).toBeNull();

  const undo = within(result).getByRole('button', { name: 'Restore the previous version' });
  await userEvent.click(undo);
  await waitFor(() => expect(block(canvasElement, 'inc1')).not.toBeNull());
  await expect(posts()[1]).toEqual({ url: UNDO_URL, method: 'POST', body: { log: 'log-1' } });
  await expect(canvasElement.querySelector('p.result').textContent.trim()).toBe('Restored the previous version of inc1.');
  await expect(canvasElement.querySelector('button.undo-restore-files')).toBeNull();
};

// "Keep the most recent", and a cancelled confirm that posts nothing
export const FixCurrent = Template.bind({});
FixCurrent.args = { showTime: true, undoUrl: UNDO_URL };
FixCurrent.decorators = [withServer];
FixCurrent.play = async ({ canvasElement }) => {
  await find(canvasElement);
  const fix = block(canvasElement, 'two').querySelector('button.fix-current');
  server.confirmAnswer = false;
  await userEvent.click(fix);
  await expect(server.confirms[0]).toBe('Keep the most recent of the 2 current versions of two, and make the others backups?');
  await expect(posts().length).toBe(0);

  server.confirmAnswer = true;
  await userEvent.click(fix);
  await waitFor(() => expect(block(canvasElement, 'two')).toBeNull());
  await expect(posts()[0]).toEqual({ url: '/admin/json/projects/fix-current', method: 'POST', body: { project: 'two', version: 'v2' } });
  await expect(canvasElement.querySelector('p.result').textContent.trim()).toBe('two: kept the most recent version, 1 other(s) made backups.');
  await expect(canvasElement.querySelector('button.undo-restore-files')).toBeNull();
};

// a 409 (the project changed since it was listed): the list is read again, and the error
// stays shown above it
export const Conflict = Template.bind({});
Conflict.args = { showTime: true, undoUrl: UNDO_URL };
Conflict.decorators = [withServer];
Conflict.play = async ({ canvasElement }) => {
  await find(canvasElement);
  server.conflict = true;
  await userEvent.click(block(canvasElement, 'inc1').querySelector('button.restore-files'));
  await waitFor(() => expect(lists()).toBe(2));
  await waitFor(() => expect(canvasElement.querySelector('p.error')).not.toBeNull());
  await expect(canvasElement.querySelector('p.error').textContent).toBe(STALE);
  await expect(canvasElement.querySelector('p.error').getAttribute('role')).toBe('alert');
  await expect(canvasElement.querySelector('button.find-damaged').disabled).toBe(false);
  await expect(block(canvasElement, 'inc1')).not.toBeNull();
  await expect(canvasElement.querySelector('p.result')).toBeNull();
};

// BrainBox's: no time, no undo, and its confirms
export const NoUndo = Template.bind({});
NoUndo.args = {};
NoUndo.decorators = [withServer];
NoUndo.play = async ({ canvasElement }) => {
  await expect(canvasElement.querySelector('.help').textContent.replace(/\s+/gu, ' ')).toContain('as a new version. Keep the most recent');
  await find(canvasElement);
  await expect(block(canvasElement, 'inc1').querySelector('li.event').textContent).toContain('2026-09-30 by bob');
  await userEvent.click(block(canvasElement, 'inc1').querySelector('button.restore-files'));
  await waitFor(() => expect(block(canvasElement, 'inc1')).toBeNull());
  await expect(server.confirms[0]).toBe('Add back to "inc1" the 2 file(s) that the save of 2026-09-30 removed?');
  await expect(canvasElement.querySelector('p.result').textContent.trim()).toBe('inc1: restored 2 file(s), it has 102 now.');
  await expect(canvasElement.querySelector('button.undo-restore-files')).toBeNull();

  await userEvent.click(block(canvasElement, 'two').querySelector('button.fix-current'));
  await waitFor(() => expect(block(canvasElement, 'two')).toBeNull());
  await expect(server.confirms[1]).toBe('"two" has 2 current versions: keep the most recent one, and make the others backups?');
  await expect(posts().map((r) => r.url)).toEqual(['/admin/json/projects/restore-files', '/admin/json/projects/fix-current']);
};

// the requests given as props, instead of the library's fetchJSON and postJSON
export const CustomRequests = Template.bind({});
CustomRequests.args = {
  fetchJSON: () => Promise.resolve({ list: [] }),
  postJSON: () => Promise.resolve({})
};
CustomRequests.decorators = [withServer];
CustomRequests.play = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: 'Find damaged projects' }));
  await waitFor(() => expect(canvasElement.querySelector('.count')).not.toBeNull());
  await expect(canvasElement.querySelector('.count').textContent).toBe('No damaged project found.');
  await expect(server.requests.length).toBe(0);
};
