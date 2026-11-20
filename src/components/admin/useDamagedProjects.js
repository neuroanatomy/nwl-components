// The admin page's "Damaged projects" section (3.7.0): microdraw's useDamagedProjects
// (app/views/scripts/src/admin-damaged.js), with BrainBox's problems(p) and its error that
// survives the reload (view/brainbox/src/pages/admin-page.js). The list is read on demand (the
// server reads every version of every project); the fixes are the routes
// /admin/json/projects/restore-files and /admin/json/projects/fix-current.
import { ref } from 'vue';

import { fetchJSON as libraryFetchJSON, postJSON as libraryPostJSON } from '@/helpers/json.js';
import { formatDate as formatDateOf } from '@/helpers/pages.js';

const LIST_URL = '/admin/json/projects/damaged';
const RESTORE_FILES_URL = '/admin/json/projects/restore-files';
const FIX_CURRENT_URL = '/admin/json/projects/fix-current';

/**
 * What is wrong with a damaged project (BrainBox's labels)
 * @param {Object} p The project, as the list gives it
 * @returns {Array<string>} The labels
 */
export const damagedProblems = (p) => [
  ...(p.suspected ? ['incomplete save'] : []),
  ...(p.missing && !p.suspected ? ['files removed'] : []),
  ...(p.currentVersions.length > 1 ? [`${p.currentVersions.length} current versions`] : [])
];

/**
 * The project's settings page
 * @param {Object} p The project
 * @returns {string} Its address
 */
export const damagedSettingsLink = (p) => `/project/${encodeURIComponent(p.shortname)}/settings`;

/**
 * State and actions of the "Damaged projects" section
 * @param {Object} [options] The options
 * @param {Function} [options.fetchJSON] GET a JSON answer (default: the library's fetchJSON)
 * @param {Function} [options.postJSON] POST JSON (default: the library's postJSON)
 * @param {boolean} [options.showTime=false] true: the dates show the time (microdraw)
 * @param {string} [options.undoURL] The route that puts back the version before a restore,
 *   posted `{ log }` (microdraw's /admin/json/projects/restore). Without it, a restore offers
 *   no undo, and the confirms are BrainBox's.
 * @returns {Object} What the panel uses
 */
// eslint-disable-next-line max-statements
export const useDamagedProjects = ({ fetchJSON = libraryFetchJSON, postJSON = libraryPostJSON, showTime = false, undoURL = '' } = {}) => {
  const damaged = ref(null); // null until searched
  const loading = ref(false);
  const error = ref('');
  const result = ref(null); // { text, shortname, restore? }

  const formatDate = (date) => formatDateOf(date, { time: showTime });

  const load = async () => {
    loading.value = true;
    error.value = '';
    try {
      damaged.value = (await fetchJSON(LIST_URL)).list;
    } catch (err) {
      error.value = err.message;
    }
    loading.value = false;
  };

  // Post a fix, then read the list again. An error (a 409 for a project changed since it was
  // listed) stays shown above the list read again, as in BrainBox
  const act = async (fn) => {
    error.value = '';
    result.value = null;
    let failure = '';
    try {
      result.value = await fn();
    } catch (err) {
      failure = err.message;
    }
    await load();
    if (failure) {
      error.value = failure;
    }
  };

  const restoreConfirm = (p, e) => (undoURL ?
    `Add back to ${p.shortname} the ${e.stillMissing} file(s) removed by the save of ${formatDate(e.modified)}?\n\nThey go at the end of its files, in a new version: you can restore the previous one.` :
    `Add back to "${p.shortname}" the ${e.stillMissing} file(s) that the save of ${formatDate(e.modified)} removed?`);

  const fixCurrentConfirm = (p) => (undoURL ?
    `Keep the most recent of the ${p.currentVersions.length} current versions of ${p.shortname}, and make the others backups?` :
    `"${p.shortname}" has ${p.currentVersions.length} current versions: keep the most recent one, and make the others backups?`);

  const restoreFiles = (p, e) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(restoreConfirm(p, e))) {
      return null;
    }

    return act(async () => {
      const { restored, files, log } = await postJSON(RESTORE_FILES_URL, { project: p.shortname, version: p.version, save: e.save });

      return {
        text: `${p.shortname}: restored ${restored} file(s), it has ${files} now.`,
        shortname: p.shortname,
        ...(undoURL && log ? { restore: log } : {})
      };
    });
  };

  const fixCurrent = (p) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(fixCurrentConfirm(p))) {
      return null;
    }

    return act(async () => {
      const { backups } = await postJSON(FIX_CURRENT_URL, { project: p.shortname, version: p.version });

      return { text: `${p.shortname}: kept the most recent version, ${backups} other(s) made backups.`, shortname: p.shortname };
    });
  };

  // undo a restore-files: the app's restore route puts the previous version back
  const undoRestoreFiles = (r) => {
    if (!undoURL || !r || !r.restore) {
      return null;
    }

    return act(async () => {
      await postJSON(undoURL, { log: r.restore });

      return { text: `Restored the previous version of ${r.shortname}.`, shortname: r.shortname };
    });
  };

  return {
    damaged,
    damagedLoading: loading,
    damagedError: error,
    damagedResult: result,
    loadDamaged: load,
    restoreFiles,
    fixCurrent,
    undoRestoreFiles,
    formatDate,
    problems: damagedProblems,
    settingsLink: damagedSettingsLink
  };
};
