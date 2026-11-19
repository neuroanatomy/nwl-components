import { expect, fn } from '@storybook/test';

import { defaultFetchLabelSets, fetchJSON, postJSON } from '@/helpers/json.js';
import { formatDate, localDate, pad, shownName } from '@/helpers/pages.js';

// The helpers of the apps' admin and user pages (3.5.0): no component, the play functions call
// them. Their results are listed on the canvas.
export default {
  title: 'Library/Helpers'
};

// Replace window.fetch with one answering `response()` while `run` executes, and return the mock.
const withFetch = async (response, run) => {
  const originalFetch = window.fetch;
  const mock = fn(() => Promise.resolve(response()));
  window.fetch = mock;
  try {
    await run();
  } finally {
    window.fetch = originalFetch;
  }

  return mock;
};
const json = (body, init) => () => new Response(JSON.stringify(body), init);
const errorOf = async (promise) => {
  try {
    await promise;
  } catch (err) {
    return err.message;
  }

  return null;
};

const show = (lines) => () => ({
  setup: () => ({ lines }),
  template: '<ul class="helpers"><li v-for="line in lines" :key="line">{{ line }}</li></ul>'
});

export const FetchJSON = show([
  'fetchJSON(url, options): JSON headers merged with the caller\'s; throws body.error, body.msg or "<status> <statusText>"',
  'postJSON(url, data): POST, the data as JSON',
  'defaultFetchLabelSets(): /api/getLabelsets'
]).bind({});
// eslint-disable-next-line max-statements
FetchJSON.play = async () => {
  // ok: the body, with the JSON headers merged with the caller's
  let body;
  const mock = await withFetch(json({ success: true, value: 1 }), async () => {
    body = await fetchJSON('/a', { method: 'PUT', headers: { 'X-Test': '1' } });
  });
  await expect(body).toEqual({ success: true, value: 1 });
  await expect(mock.mock.calls[0]).toEqual(['/a', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Test': '1' } }]);
  // the caller's headers win
  const own = await withFetch(json({}), () => fetchJSON('/a', { headers: { 'Content-Type': 'text/plain' } }));
  await expect(own.mock.calls[0][1].headers).toEqual({ 'Content-Type': 'text/plain' });
  // success: false, with error, msg or neither
  await withFetch(json({ success: false, error: 'no access', msg: 'other' }), async () => {
    await expect(await errorOf(fetchJSON('/a'))).toBe('no access');
  });
  await withFetch(json({ success: false, msg: 'a message' }), async () => {
    await expect(await errorOf(fetchJSON('/a'))).toBe('a message');
  });
  await withFetch(json({ success: false }, { status: 200, statusText: 'OK' }), async () => {
    await expect(await errorOf(fetchJSON('/a'))).toBe('200 OK');
  });
  // a body that isn't JSON
  await withFetch(() => new Response('<html>', { status: 502, statusText: 'Bad Gateway' }), async () => {
    await expect(await errorOf(fetchJSON('/a'))).toBe('502 Bad Gateway');
  });
  await withFetch(() => new Response('<html>', { status: 200, statusText: 'OK' }), async () => {
    await expect(await errorOf(fetchJSON('/a'))).toBe('200 OK');
  });
  // a 500, with a JSON body and without
  await withFetch(json({ error: 'database down' }, { status: 500, statusText: 'Internal Server Error' }), async () => {
    await expect(await errorOf(fetchJSON('/a'))).toBe('database down');
  });
  await withFetch(json({}, { status: 500, statusText: 'Internal Server Error' }), async () => {
    await expect(await errorOf(fetchJSON('/a'))).toBe('500 Internal Server Error');
  });

  // postJSON
  const post = await withFetch(json({ success: true }), () => postJSON('/b', { a: [1, 2] }));
  await expect(post.mock.calls[0]).toEqual(['/b', { method: 'POST', body: '{"a":[1,2]}', headers: { 'Content-Type': 'application/json' } }]);

  // defaultFetchLabelSets
  let sets;
  const labels = await withFetch(json([{ name: 'A', source: 'a.json' }]), async () => { sets = await defaultFetchLabelSets(); });
  await expect(labels.mock.calls[0][0]).toBe('/api/getLabelsets');
  await expect(sets).toEqual([{ name: 'A', source: 'a.json' }]);
};

export const DatesAndNames = show([
  'formatDate(date, { time = false }): YYYY-MM-DD, or YYYY-MM-DD HH:MM as stored; \'\' when missing',
  'pad(n), localDate(iso, dateTime = false): local YYYY-MM-DD (HH:MM:SS); \'\' when missing or not a date',
  'shownName(row, { nameKey = \'name\', shortnameKey = \'shortname\' }): the name, or the shortname when blank'
]).bind({});
// eslint-disable-next-line max-statements
DatesAndNames.play = async () => {
  await expect(formatDate('2026-11-19T13:21:55.123Z')).toBe('2026-11-19');
  await expect(formatDate('2026-11-19T13:21:55.123Z', { time: true })).toBe('2026-11-19 13:21');
  await expect(formatDate('')).toBe('');
  await expect(formatDate(null, { time: true })).toBe('');
  await expect(formatDate()).toBe('');

  await expect([pad(3), pad(12), pad(0)]).toEqual(['03', '12', '00']);
  // a local date and time, whatever the time zone
  const iso = new Date(2026, 0, 2, 3, 4, 5).toISOString();
  await expect(localDate(iso)).toBe('2026-01-02');
  await expect(localDate(iso, true)).toBe('2026-01-02 03:04:05');
  await expect([localDate(''), localDate(), localDate(null, true), localDate('not a date'), localDate('not a date', true)])
    .toEqual(['', '', '', '', '']);

  // microdraw's keys (the defaults), and BrainBox's
  await expect(shownName({ name: 'My project', shortname: 'mine' })).toBe('My project');
  await expect(shownName({ name: ' Spaced ', shortname: 'mine' })).toBe(' Spaced ');
  await expect(shownName({ name: '  ', shortname: 'mine' })).toBe('mine');
  await expect(shownName({ shortname: 'mine' })).toBe('mine');
  const brainbox = { nameKey: 'projectName', shortnameKey: 'project' };
  await expect(shownName({ projectName: 'Atlas', project: 'atlas' }, brainbox)).toBe('Atlas');
  await expect(shownName({ projectName: '', project: 'atlas' }, brainbox)).toBe('atlas');
  await expect(shownName({ projectName: 12, project: 'atlas' }, brainbox)).toBe('atlas');
};
