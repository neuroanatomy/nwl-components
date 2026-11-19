// JSON requests of the apps' pages (from BrainBox's and microdraw's admin-page.js, 3.5.0)

/**
 * Fetch a JSON answer, with JSON headers merged with the caller's
 * @param {string} url The address
 * @param {Object} [options] fetch's options
 * @returns {Promise<Object>} The answer's body
 * @throws {Error} `body.error`, `body.msg` or '<status> <statusText>' when the answer isn't ok
 *   or has `success: false` (a body that isn't JSON counts as `{success: false}`)
 */
export const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  let body;
  try {
    body = await res.json();
  } catch (err) {
    body = { success: false, error: `${res.status} ${res.statusText}` };
  }
  if (!res.ok || body.success === false) {
    throw new Error(body.error || body.msg || `${res.status} ${res.statusText}`);
  }

  return body;
};

/**
 * POST data as JSON, with fetchJSON
 * @param {string} url The address
 * @param {*} data The data, sent as JSON
 * @returns {Promise<Object>} The answer's body
 */
export const postJSON = (url, data) => fetchJSON(url, { method: 'POST', body: JSON.stringify(data) });

/**
 * The label sets of the server's /api/getLabelsets: what PureAnnotations uses when the
 * config has no `fetchLabelSets`
 * @returns {Promise<Array<{name: string, source: string}>>} The label sets
 */
export const defaultFetchLabelSets = async () => (await fetch('/api/getLabelsets')).json();
