// The settings page's batched files loader: the project is sent without its files, which are
// fetched in batches from /project/json/:shortname/files and shown as they arrive. Moved from
// microdraw's and BrainBox's project-settings-page.js (3.5.0), same names and behaviour.
import { ref } from 'vue';

import './batchedFiles.css';

const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/**
 * The section of the page with the files, which also holds the "Files" heading: the
 * parent of the files table's wrapper (Table wraps its table in a div.nwl-resize-wrap
 * since 3.1.0), or of the table itself
 * @returns {HTMLElement|null} The section
 */
const filesSection = () => {
  const table = document.getElementById('files');
  if (!table) { return null; }

  return (table.closest('.nwl-resize-wrap') || table).parentElement;
};

/**
 * Write the loading progress, or an error with a Retry button, in the status
 * shown after the "Files" heading
 * @param {HTMLElement} span The status
 * @param {Object} status {received, total} while loading, {error} if a batch failed
 * @param {Function} retry Called by the Retry button
 * @returns {void}
 */
const writeFilesStatus = (span, status, retry) => {
  if (status.error) {
    span.textContent = ` (could not load all the files: ${status.error}) `;
    const button = document.createElement('button');
    button.textContent = 'Retry';
    button.addEventListener('click', retry);
    span.appendChild(button);
  } else {
    span.textContent = ` (loading… ${status.received} / ${status.total})`;
  }
};

/**
 * Show the loading status after the "Files" heading, and keep the files from
 * being edited until they are all loaded
 * @param {Object} status {received, total} while loading, {error} if a batch failed, null when done
 * @param {Function} retry Called by the Retry button
 * @returns {void}
 */
// eslint-disable-next-line max-statements
const showFilesStatus = (status, retry) => {
  const section = filesSection();
  const heading = section && section.querySelector('h2');
  if (!heading) { return; }
  const span = heading.querySelector('.filesStatus');
  if (!status) {
    if (span) { span.remove(); }
    section.classList.remove('filesLoading');

    return;
  }
  section.classList.add('filesLoading');
  writeFilesStatus(span || heading.appendChild(Object.assign(document.createElement('span'), { className: 'filesStatus' })), status, retry);
};

/**
 * The batched files loader of a project's settings page
 * @param {Object} options The options
 * @param {string} options.shortname The project's shortname
 * @param {number} options.filesTotal The number of files the project has (0: nothing is fetched)
 * @param {number} [options.batchLength=100] The number of files asked for in each request
 * @param {number[]} [options.retryDelays=[500, 1000]] ms before trying a failed batch again
 * @returns {{files: import('vue').Ref<Array>, filesLoaded: {count: number}, loadFiles: Function}}
 *   `files`, the files received so far, for SettingsPage's `files` prop; `filesLoaded`, the
 *   number of files received, to put on the project given to SettingsPage (the server keeps the
 *   stored list when it isn't the number stored); `loadFiles()`, to call from `mounted()`
 */
// eslint-disable-next-line max-lines-per-function
export const useBatchedFiles = ({ shortname, filesTotal, batchLength = 100, retryDelays = [500, 1000] }) => {
  // The files received so far. SettingsPage watches this array, and shows each
  // file as soon as it is added to it
  const files = ref([]);

  // The number of files received, sent to the server when saving. SettingsPage keeps a
  // shallow copy of the project, which shares this object, so the count it sends is
  // always the current one
  const filesLoaded = { count: 0 };

  let loading = false;

  /**
   * Fetch a batch of the project's files (only their source and name),
   * trying again after each of the retry delays if the request fails.
   * @param {number} start Index of the first file
   * @param {number} attempt Number of attempts already made
   * @returns {Promise<Array>} The files
   */
  // eslint-disable-next-line max-statements
  const fetchBatch = async (start, attempt = 0) => {
    try {
      const res = await fetch(`/project/json/${encodeURIComponent(shortname)}/files?start=${start}&length=${batchLength}&names=true`);
      if (!res.ok) {
        throw new Error(`the server answered with status ${res.status}`);
      }
      const list = await res.json();
      if (!Array.isArray(list)) {
        throw new Error('the server did not send a list of files');
      }

      return list;
    } catch (err) {
      if (attempt >= retryDelays.length) {
        throw err;
      }
      await delay(retryDelays[attempt]);

      return fetchBatch(start, attempt + 1);
    }
  };

  /**
   * Fetch the batches of files from the last one received, until a batch is not
   * full, adding each to the list shown as soon as it arrives
   * @returns {Promise<void>} Resolves once all the files have been received
   */
  const fetchRemainingFiles = async () => {
    let list;
    do {
      showFilesStatus({ received: files.value.length, total: Math.max(filesTotal, files.value.length) });
      // eslint-disable-next-line no-await-in-loop
      list = await fetchBatch(files.value.length);
      files.value.push(...list);
      filesLoaded.count = files.value.length;
    } while (list.length === batchLength);
  };

  /**
   * Load the project's files, from the last one received. A call during a load does nothing.
   * @returns {Promise<void>} Resolves once the files are loaded, or failed to load
   */
  const loadFiles = async () => {
    if (loading) { return; }
    loading = true;
    try {
      // a new project, or one without files, has nothing to fetch
      if (filesTotal > 0) {
        await fetchRemainingFiles();
      }
      showFilesStatus(null);
    } catch (err) {
      showFilesStatus({ error: err.message }, loadFiles);
    } finally {
      loading = false;
    }
  };

  return { files, filesLoaded, loadFiles };
};
