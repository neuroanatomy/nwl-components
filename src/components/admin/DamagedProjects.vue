<template>
  <section class="nwl-damaged-projects">
    <h2>Damaged projects</h2>
    <p class="help">
      Projects whose current version lacks files that a save removed, and projects with several
      current versions. The settings page used to save before all its files had arrived: a save
      that kept the first files of the previous version, a multiple of 100 of them, is flagged
      <b>incomplete save</b>. Other removals are listed too, as they may have been deliberate.
      <b>Restore files</b> adds a save's missing files back at the end of the project's files, with
      their names, as a new version<span v-if="undo"> (<b>Restore the previous version</b> puts the previous one back)</span>.
      <b>Keep the most recent</b> makes the other current versions backups. Both refuse a project changed since the list was read. Searching reads
      every version of every project.
    </p>
    <p
      v-if="damagedError"
      class="error"
      role="alert"
    >
      {{ damagedError }}
    </p>
    <p
      v-if="damagedResult"
      class="result"
      role="status"
    >
      {{ damagedResult.text }}
      <button
        v-if="damagedResult.restore"
        type="button"
        class="nwl-damaged-button undo-restore-files"
        @click="undoRestoreFiles(damagedResult)"
      >
        Restore the previous version
      </button>
    </p>
    <p class="summary">
      <button
        type="button"
        class="nwl-damaged-button find-damaged"
        :disabled="damagedLoading"
        @click="loadDamaged()"
      >
        {{ damagedLoading ? 'Looking…' : (damaged ? 'Reload' : 'Find damaged projects') }}
      </button>
      <span
        v-if="damaged && !damagedLoading"
        class="count"
      >{{ damaged.length === 0 ? 'No damaged project found.' : damaged.length + ' damaged project(s).' }}</span>
    </p>
    <div
      v-for="p in damaged || []"
      :key="p.shortname"
      class="project"
      :data-shortname="p.shortname"
    >
      <h3>
        <code>{{ p.shortname }}</code> {{ p.name }} <span class="owner">owner: {{ p.owner }}</span>
        <a
          class="settings"
          :href="settingsLink(p)"
          target="_blank"
        >Settings</a>
      </h3>
      <p class="counts">
        <span
          v-for="t in problems(p)"
          :key="t"
          class="tag problem"
          :class="{ notice: t === 'files removed' }"
        >{{ t }}</span>
        {{ p.files }} file(s) now, {{ p.versions }} version(s), {{ p.missing }} file(s) missing
      </p>
      <div
        v-if="p.currentVersions.length > 1"
        class="current-versions"
      >
        <p>
          <span class="tag">{{ p.currentVersions.length }} current versions</span>
          <span
            v-for="v in p.currentVersions"
            :key="v.id"
            class="current-version"
          >{{ formatDate(v.modified) }} by {{ v.modifiedBy || '?' }}; </span>
        </p>
        <button
          type="button"
          class="nwl-damaged-button fix-current"
          @click="fixCurrent(p)"
        >
          Keep the most recent
        </button>
      </div>
      <ul class="events">
        <li
          v-for="e in p.events"
          :key="e.save"
          class="event"
          :data-save="e.save"
        >
          <span
            v-if="e.incomplete"
            class="tag"
          >incomplete save</span>
          {{ formatDate(e.modified) }} by {{ e.modifiedBy || '?' }}: {{ e.before }} → {{ e.after }} files,
          {{ e.stillMissing }} still missing<span v-if="e.annotated">, {{ e.annotated }} with annotations</span>
          <span class="examples">(<code
            v-for="x in e.examples"
            :key="x"
          >{{ x }} </code><span v-if="e.stillMissing > e.examples.length">…</span>)</span>
          <button
            type="button"
            class="nwl-damaged-button restore-files"
            :disabled="p.currentVersions.length > 1"
            @click="restoreFiles(p, e)"
          >
            Restore {{ e.stillMissing }} file(s)
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
// The admin page's "Damaged projects" section (3.7.0), for both apps: microdraw's layout (a block
// per project, with the help texts) and BrainBox's problem labels. See useDamagedProjects.js.
import { useDamagedProjects } from './useDamagedProjects.js';

const props = defineProps({
  // the dates show the time (microdraw)
  showTime: Boolean,
  // the route that undoes a restore (microdraw's /admin/json/projects/restore); in a DOM
  // template, `undo-url`. Without it, no undo is offered.
  undoUrl: { type: String, default: '' },
  // the same, for `:undoURL` in a compiled template
  undoURL: { type: String, default: '' },
  // optional: the requests (default: the library's fetchJSON and postJSON)
  fetchJSON: { type: Function, default: null },
  postJSON: { type: Function, default: null }
});

const undo = props.undoURL || props.undoUrl;

const {
  damaged,
  damagedLoading,
  damagedError,
  damagedResult,
  loadDamaged,
  restoreFiles,
  fixCurrent,
  undoRestoreFiles,
  formatDate,
  problems,
  settingsLink
} = useDamagedProjects({
  showTime: props.showTime,
  undoURL: undo,
  ...(props.fetchJSON ? { fetchJSON: props.fetchJSON } : {}),
  ...(props.postJSON ? { postJSON: props.postJSON } : {})
});
</script>

<style scoped>
.nwl-damaged-projects .help {
  color: var(--nwl-text-3);
}
.nwl-damaged-projects .help :is(b, code) {
  color: var(--nwl-text);
}
.nwl-damaged-projects .error,
.nwl-damaged-projects .tag {
  color: var(--nwl-danger);
}
.nwl-damaged-projects .result {
  color: var(--nwl-success);
}
.nwl-damaged-projects .tag {
  font-size: var(--nwl-text-xs);
  border: 1px solid var(--nwl-danger);
  border-radius: var(--nwl-radius-sm);
  padding: 0 3px;
}
.nwl-damaged-projects .tag.notice {
  color: var(--nwl-warning);
  border-color: var(--nwl-warning);
}
.nwl-damaged-projects .tag + .tag {
  margin-left: 4px;
}
.nwl-damaged-projects .problem:last-of-type {
  margin-right: 6px;
}
.nwl-damaged-projects code {
  font-size: var(--nwl-text-sm);
}
.nwl-damaged-projects .project {
  border-top: 1px solid var(--nwl-border-subtle);
  padding: 10px 0;
}
.nwl-damaged-projects .project p {
  text-align: left;
}
.nwl-damaged-projects .project h3 {
  font-size: var(--nwl-text-base);
  margin: 0 0 6px;
}
.nwl-damaged-projects .project h3 > :is(.owner, .settings) {
  font-size: var(--nwl-text-md);
}
.nwl-damaged-projects .owner {
  color: var(--nwl-text-3);
  font-weight: normal;
  margin: 0 10px;
}
.nwl-damaged-projects .settings {
  color: var(--nwl-link);
}
.nwl-damaged-projects .counts {
  color: var(--nwl-text-3);
  margin: 0 0 6px;
}
.nwl-damaged-projects .events {
  margin: 4px 0;
  padding-left: 20px;
}
.nwl-damaged-projects .events li {
  margin: 4px 0;
}
.nwl-damaged-projects .examples {
  color: var(--nwl-text-3);
  word-break: break-all;
}
.nwl-damaged-projects .count {
  margin-left: 6px;
}
/* buttons, reachable with Tab, with a visible keyboard focus */
.nwl-damaged-button {
  background: transparent;
  color: var(--nwl-text);
  font: inherit;
  border: 1px solid var(--nwl-border);
  border-radius: var(--nwl-radius-sm);
  padding: 4px 10px;
  margin-left: 4px;
  cursor: pointer;
}
.nwl-damaged-button:hover:not(:disabled) {
  background: var(--nwl-bg-pressed);
}
.nwl-damaged-button:disabled {
  opacity: 0.4;
  cursor: default;
}
.nwl-damaged-button:focus-visible {
  outline: 2px solid var(--nwl-focus);
  outline-offset: 2px;
}
.find-damaged {
  margin-left: 0;
}
</style>
