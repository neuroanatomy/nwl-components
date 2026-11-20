# Changelog

## Unreleased

Storybook only (stories aren't published to npm; no version bump).

- CI publishes the Storybook on GitHub Pages after the tests pass on `main`:
  <https://neuroanatomy.github.io/nwl-components/> (job `storybook-pages`).

- Story `Icons/Finder`: search the icons by name, meaning or the app file names they replaced
  ("floppy" finds `save`), at 24, 32 or 48 px on the dark or a light background; pick one for a
  large preview, what it replaced, and copy buttons for its three paths (`@/icons/`, webpack 4
  `~nwl-components/dist/icons/`, served `/lib/nwl-components/icons/`). Its `play` test covers
  the search, the count, no match, the keyboard and the copy. The map is parsed once in
  `src/icons/map.js`, shared with `Icons/All`.

## 3.7.1

Roboto 100 in Latin Extended, for project names such as "Łódź" (microdraw shows the project name
in Roboto).

- **`fonts.css`** has a second Roboto 100 face, `fonts/roboto-latin-ext-100-normal.woff2`, from
  `@fontsource/roboto` as the Latin one, with fontsource's `unicode-range` (U+0100-02BA and the
  rest of Latin Extended). The build copies it to `dist/fonts/` with the other faces
  (`scripts/fonts.js`). A browser downloads it only for a page with such letters.
- Story `Styles/Theme` Fonts: its `play` test checks `document.fonts.check('100 16px Roboto',
  'ŁódźĄę')`, the face in fonts.css and its woff2 served from `fonts/`.

**What the apps must do:** nothing, if they link `nwl-components/fonts.css`. They may now drop
their own Roboto copies (microdraw's `app/public/lib/roboto/`, BrainBox's `public/fonts/roboto/`)
and the `<link>`s to them, where they use Roboto only at weight 100 (the only weight the kit has).

## 3.7.0

The admin page's "Damaged projects" section, for both apps: one panel replaces microdraw's
(`app/views/admin.mustache` and `app/views/scripts/src/admin-damaged.js`) and BrainBox's
(`templates/admin.mustache` and `view/brainbox/src/pages/admin-page.js`). Exported from the root.
The routes it calls don't change (`GET /admin/json/projects/damaged`, `POST
/admin/json/projects/restore-files` and `fix-current`, NeuroWebLab 1.23.0's `admin/damaged.js`
behind them).

- **`useDamagedProjects({ fetchJSON, postJSON, showTime = false, undoURL = '' })`**
  (`src/components/admin/useDamagedProjects.js`): microdraw's composable, same returned names
  (`damaged`, `damagedLoading`, `damagedError`, `damagedResult`, `loadDamaged`, `restoreFiles`,
  `fixCurrent`, `undoRestoreFiles`) plus `formatDate`, `problems` and `settingsLink`.
  - `fetchJSON` and `postJSON` default to the library's (3.5.0).
  - **Fixed:** an error from a fix (such as the 409 "has changed since it was listed") stays shown
    after the list is read again, as in BrainBox; microdraw's `act()` lost it.
  - `showTime`: the dates show the time (`YYYY-MM-DD HH:MM`, microdraw), or not (BrainBox).
  - `undoURL`: with it (microdraw's `/admin/json/projects/restore`, posted `{ log }`), a restore's
    result offers **Restore the previous version**, and the confirms are microdraw's (they mention
    the undo); without it, nothing is offered and the confirms are BrainBox's, as today.
  - Also exported: `damagedProblems(p)` (BrainBox's `problems(p)`: `incomplete save`,
    `files removed`, `N current versions`) and `damagedSettingsLink(p)`.
- **`DamagedProjects`** (`src/components/admin/DamagedProjects.vue`): a `<section>` with its
  `<h2>`, microdraw's layout (a block per project, the help text) with BrainBox's problem labels
  in each block's counts line. Microdraw's class names stay (`button.find-damaged`,
  `div.project[data-shortname]`, `li.event[data-save]`, `button.restore-files`,
  `button.fix-current`, `p.result`, `button.undo-restore-files`, `p.error`), so its e2e selectors
  still match. Props: `showTime`, `undoUrl` (`undo-url` in a DOM or string template; `undoURL`
  also works), `fetchJSON` and `postJSON` (optional). Native `<button>`s in the tab order (not
  `Button`, which has `tabindex="-1"`, nor BrainBox's toggle link), a visible `:focus-visible`
  outline, the error in `role="alert"`, the result in `role="status"`; the confirms stay
  `window.confirm`. Its styles are in `@layer nwl.components`, from the tokens. An `id` on the
  element goes to the section.
- Story `Admin/DamagedProjects` (a mocked server, `window.confirm` stubbed): List (keyboard,
  focus, labels, dates with the time), RestoreAndUndo, FixCurrent (and a cancelled confirm),
  Conflict (the 409 stays shown after the reload), NoUndo (BrainBox's: no time, no undo, its
  confirms), CustomRequests.

What the apps must do (their copies still work until then):

- **microdraw**: `package.json` (:31): `nwl-components` `^3.7.0`. `app/views/admin.mustache`:
  replace :193–:236 with `<damaged-projects id="damaged-projects" show-time
  undo-url="/admin/json/projects/restore"></damaged-projects>`, and remove the CSS only it used
  (`ul.events`, `ul.events li`, `.examples`, :452–:462; `div.project`, `.tag`, `.help`, `.error`
  and `.result` stay, the other sections use them). Remove
  `app/views/scripts/src/admin-damaged.js`. `app/views/scripts/src/admin-page.js`: remove the
  import (:9) and `...useDamagedProjects(…)` (:189); import `DamagedProjects` from
  `nwl-components` and `app.component('DamagedProjects', DamagedProjects)` (after :205).
- **BrainBox**: `package.json` (:56): `nwl-components` `^3.7.0`. `templates/admin.mustache`:
  replace :58–:103 with `<damaged-projects id="projects"></damaged-projects>` (no time, no undo),
  and remove its CSS (:212–:235: `tr.details ul`, `li`, `li .tag`, `li button`, `.examples`,
  `.tag.notice`, `.tag + .tag`; `tr.details td` at :209 stays, the orphans use it).
  `view/brainbox/src/pages/admin-page.js`: remove the state (:29–:33), the logic (:49–:108) and
  the returned names (:234–:243; `formatDate` at :256 stays, the other sections use it); import
  `DamagedProjects` and `app.component('DamagedProjects', DamagedProjects)` (after :266).

## 3.6.0

The apps' embeddable viewer, without Vue: the embed page's sizing and the `/embed.js` loader,
which both apps carried (BrainBox's `public/embed.js` and microdraw's `app/public/embed.js` were
line-for-line ports of each other). A new subpath, **`nwl-components/embed`** (`dist/embed/`,
built by `vite.embed.config.js`; `embed/package.json` for webpack 4, which ignores `exports`; on
a page with no bundle, `dist/embed/nwl-components-embed.umd.js` as the global
`nwlComponentsEmbed`). Not exported from the root. See the README's "Embeddable viewer".

- **`desiredEmbedHeight({ width, aspect, toolbarHeight, minHeight = 160, maxHeight = Infinity })`**
  and **`positiveIntParam(value)`** (`src/embed/sizing.js`): the apps' bodies, unchanged. The
  aspect functions stay in the apps (BrainBox's `planeAspect`, microdraw's `imageAspect`).
- **`embedScript(config)`** (`src/embed/script.js`; the plan's `createEmbedSDK`) returns the text
  of an app's `/embed.js`: `src/embed/loader.js`, imported as text (`?raw`), unminified and with
  its comments, with a header comment made from the config on its first line and the app's names
  as a JSON literal in `const CONFIG` at its top. `config`: `prefix` (`'brainbox'`), `appName`
  (`'BrainBox'`), `endpoint` (`'/mri/embed'`), `required` (`'url'`), `params` (dataset key →
  query parameter, in the query string's order), `optionsDoc` (`[attribute, description]` of the
  app's options; the CSS options `data-width`, `data-max-width`, `data-height` and `data-target`
  are added after them). It throws on a config it can't use. The loader is microdraw's:
  `findScript`, the origin from the script's `src`, the query string, the starting size
  (`100%`, `560px`, `420px`), `MAX_SANE_HEIGHT = 4000`, `data-target`, the page-wide registry
  `window.__<prefix>Embeds = { frames, listening }` and one `message` listener per page. The
  URLs, `data-*` attributes and defaults, iframe URLs, message names and fields don't change.
  For BrainBox, the registry is new: two copies of the script on one page now share one
  listener (before, each kept its own `embeds` array and listener).
- Stories: `Library/Embed` Sizing (both apps' spec cases), LoaderBrainBox and LoaderMicroDraw
  (no placeholder left; the text parses; one iframe with the expected `src`, title and starting
  size; a resize message from its frame sets its height up to 4000, not 4001, not another app's,
  not one from the page; a second copy, into `data-target`, adds its frame to the registry and no
  listener; no frame and a console error without the required attribute), BadConfig.

What the apps must do (their copies still work until then):

- **microdraw**: `package.json` (:31): `nwl-components` `^3.6.0`. `app/app.js`: serve
  `/embed.js` from `embedScript(config)`, built once at start-up, by a route before
  `express.static` (:135), with `Content-Type: application/javascript; charset=UTF-8` and
  `Cache-Control: public, max-age=0` (CORS from the app's middleware, the ETag from `res.send`);
  remove `app/public/embed.js`. `app/public/js/embed-sizing.js`: keep `imageAspect` only (remove
  :32–:66, and the two names from `api` at :68). `app/views/dataEmbed.mustache` (:48): also load
  `/lib/nwl-components/embed/nwl-components-embed.umd.js`. `app/public/js/embed-page.js`
  (:364, :368): `nwlComponentsEmbed.desiredEmbedHeight`, `nwlComponentsEmbed.positiveIntParam`
  (and the global at :21). Tests: `test/api/embed-sizing.spec.js` (:4) and
  `test/e2e/embed.spec.js` (:15) take `desiredEmbedHeight` and `positiveIntParam` from
  `nwl-components/embed`.
- **BrainBox**: `package.json` (:56): `nwl-components` `^3.6.0`. `app.js`: the same `/embed.js`
  route, ahead of `publicFiles`' static (:129), with today's CORS headers; config `required:
  'url'`, `params` `url, view, slice, project, annotation, maxHeight, brainboxLink`; remove
  `public/embed.js`. `view/brainbox/src/pages/embed-page.js`: remove `positiveIntParam`
  (:53–:63), import `desiredEmbedHeight` and `positiveIntParam` from `nwl-components/embed` (:7,
  :78, :82). `view/shared/embedSizing.js`: keep `planeAspect` only (remove :36–:57, and the name
  from `module.exports` at :59). Tests: `test/unit/embed.sizing.spec.js` (:2) takes
  `desiredEmbedHeight` from `nwl-components/embed`.

## 3.5.0

The settings page's batched files loader and the admin and user page helpers, which both apps
carried. All exported from the root (`import { useBatchedFiles } from 'nwl-components'`). See
the README's "Scope" and "Settings page files loader".

- **`useBatchedFiles({ shortname, filesTotal, batchLength = 100, retryDelays = [500, 1000] })`**
  returns `{ files, filesLoaded, loadFiles }`, as the apps' copies: `files`, the ref of the
  files received, for `SettingsPage :files`; `filesLoaded`, the `{ count }` object to put on the
  project given to `SettingsPage` (when saving, a count that isn't the number of files stored
  makes the server keep the stored list); `loadFiles()`, called from `mounted()`. It fetches
  `/project/json/<shortname>/files?start=…&length=…&names=true` (the shortname encoded with
  `encodeURIComponent`) until a batch isn't full, nothing when `filesTotal` is 0; tries a failed
  batch again after each retry delay; shows ` (loading… r / t)` after the "Files" heading
  (`t = max(filesTotal, received)`), then ` (could not load all the files: <message>) ` and a
  Retry button that calls `loadFiles()` again; `.filesLoading` on the files' section keeps them
  from being edited until they are all in. A call during a load does nothing.
- **Its CSS** (`.filesStatus`, `.filesStatus button`, `.filesLoading`) is in `dist/style.css`,
  in `@layer nwl.components`. The status colour is `var(--nwl-text-3)` (`#999`), where
  BrainBox had `#aaa`.
- **`fetchJSON(url, options)`**, **`postJSON(url, data)`**: JSON headers merged with the
  caller's; a body that isn't JSON counts as `{success: false, error: '<status> <statusText>'}`;
  they throw `body.error || body.msg || '<status> <statusText>'` when the answer isn't ok or has
  `success: false`.
- **`defaultFetchLabelSets()`**: the label sets of `/api/getLabelsets`. `PureAnnotations` uses it
  when the config has no `fetchLabelSets` (before, the label sets failed to load: `fetchLabelSets
  is not a function`, and the layers' menus stayed empty).
- **`formatDate(date, { time = false } = {})`**: `YYYY-MM-DD`, or `YYYY-MM-DD HH:MM` as stored,
  `''` for a missing date. **`pad(n)`**, **`localDate(iso, dateTime = false)`**: a local
  `YYYY-MM-DD` (`YYYY-MM-DD HH:MM:SS`), `''` when missing or not a date.
  **`shownName(row, { nameKey = 'name', shortnameKey = 'shortname' } = {})`**: the display name,
  or the shortname when the name is missing or blank.
- Stories: `Pages/Settings` BatchedFiles (three batches, the status and its colour, the files
  not editable while loading, a second `loadFiles()`, the count saved), BatchedFilesEncoded (a
  space and a slash in the shortname, the total never less than what was received),
  BatchedFilesRetry (the retry delays, the error and Retry's look, Retry finishes the load),
  BatchedFilesNone (`filesTotal` 0, no request); `Settings/Annotations` DefaultFetchLabelSets;
  `Library/Helpers` FetchJSON and DatesAndNames.

What the apps must do (their copies still work until then):

- **microdraw**: `app/views/scripts/src/project-settings-page.js`: remove the loader (:55–:199)
  and call `useBatchedFiles({ shortname: project.shortname, filesTotal })`, putting `filesLoaded`
  on `projectWithLists`; `app/public/css/projectSettings-style.css`: remove its CSS (:32–:52);
  `nwl-components-config.js`: remove `fetchLabelSets` (:10) and wrap `defaultFetchLabelSets` in
  `withStoredLabelSets`; `admin-page.js`: remove `fetchJSON`, `postJSON`, `formatDate` (:14–:37),
  `admin-damaged.js`: remove `formatDate` (:6–:9), and call `formatDate(d, { time: true })`;
  `user-page.js`: remove `pad`, `localDate`, `shownName` (:7–:27).
- **BrainBox**: `view/brainbox/src/pages/project-settings-page.js`: remove the loader (:11–:142)
  and call `useBatchedFiles({ shortname: project.shortname, filesTotal })`, putting `filesLoaded`
  on `project` (the shortname is now encoded); `templates/projectSettings.mustache`: remove its
  CSS (:13–:32); `nwl-components-config.js`: remove `fetchLabelSets` (:10); `admin-page.js`:
  remove `fetchJSON`, `postJSON`, `formatDate` (:7–:29); `user-page.js`: remove `pad`,
  `localDate`, `shownName` (:7–:27) and call `shownName(row, { nameKey: 'projectName',
  shortnameKey: 'project' })`.

## 3.4.0

Two table rules the apps each carried. See the README's "Widgets" and "Resizable columns".

- **`widgets.css`: `.nwl-table`**: a plain `<table class="nwl-table">` gets the column spacing
  of `Table` and `SortableTh` (since 1.5.1): `padding-right: 1em` on every cell but the last of
  its row (14px at 14px; 1em rather than a `--nwl-space-*` token, so it follows the font size).
  In `:where()` and `@layer nwl.widgets`, as the other widgets: an app rule wins.
- **`resize.css`: `text-overflow: clip`** on the cells of a resized table
  (`.nwl-resized.nwl-resized :is(th, td)`, with `white-space: normal` and
  `overflow-wrap: anywhere`): a resized column shows what fits up to its edge, no ellipsis. The
  doubled class beats `Table`'s scoped `nowrap` in the same layer. No specificity beats an app
  rule outside the layers, so an app that sets `ellipsis` or `nowrap` on cells limits that rule
  to tables that weren't resized (`table:not(.nwl-resized)`).
- **`ImportFilesDialog`**: its table has the class `nwl-table`.
- Stories: `Library/Widgets` TableSpacing (14px after every cell but the last; opt-in) and
  ResizedTableClips (after a keyboard resize: `clip`, `normal`, `anywhere`, also where an app's
  scoped rule set `ellipsis` before; an unscoped app rule keeps its `ellipsis`; the spacing
  stays); `Settings/ImportFilesDialog` Default (the class and its spacing).

What the apps must do (their rules still apply until then):

- **microdraw**: `app/public/css/project-style.css`: limit the ellipsis rule (:30–:35) to
  `#projectFiles table:not(.nwl-resized) :is(th, td)` and `#vecAnnotations:not(.nwl-resized)
  :is(th, td)` (keep `overflow: hidden` on all cells), and remove the resized rule (:53–:62);
  `app/public/css/shared-style.css`: remove the spacing rule (:79–:90); add `class="nwl-table"`
  to the two tables of `app/views/scripts/src/project-page.js` (:224, :250).
- **BrainBox**: `view/brainbox/src/style/project-style.css`: limit the ellipsis rule (:24–:29)
  to `#projectFiles table:not(.nwl-resized)` cells (keep `overflow: hidden`), and remove the
  resized rule (:30–:37); `view/brainbox/src/style/tables.css`: remove the spacing rule and its comment (:1–:12);
  add `class="nwl-table"` to `#projectFiles table`, `#volAnnotations`, `#annotationsPane table`
  and `#landmarksDialog table`.

## 3.3.0

Floating panels resize with a finger: a resize handle of their own. See the README's "Widgets".

- **`resizablePanel(panel)`**, new in `src/components/common/panel.js`, and called by
  **`floatingPanel(panel)`** for a resizable panel (the class `nwl-panel-resizable`, or a computed
  `resize` other than `none`: the apps' `resize: both` panels keep working unchanged). iOS and
  iPadOS Safari have no `resize: both` corner. The handle, `.nwl-panel-resize-handle`
  (`role="button"`, `aria-label="Resize"`, focusable), sits in the panel's bottom-right corner;
  dragged with pointer events (mouse, pen, touch; pointer capture, `touch-action: none`), it
  pins the panel first (`pinPanel`), then sets `width` and `height` in px. Arrow keys resize by
  10px, 50px with Shift. Limits: at least 160 × 100 (`MIN_WIDTH`, `MIN_HEIGHT`), never larger
  than the viewport nor past its right or bottom edge (`sizePanel(panel, width, height)`). The
  native resize is turned off (inline `resize: none`), so there is one corner and one behaviour
  everywhere. A panel that isn't positioned becomes `position: relative`. A second call does
  nothing. Also `isResizable(panel)`. Exported from `nwl-components` and `nwl-components/panel`.
- **`widgets.css`: `.nwl-panel-resize-handle`**: a 24 × 24 px hit area inside the panel's
  border, above the body and its scrollbar, transparent but for an 8px corner mark
  (`--nwl-text-3`; `--nwl-text` on hover and while dragged), `cursor: nwse-resize`, a focus
  outline (`--nwl-focus`).
- **`OntologySelector`** gets the handle through `floatingPanel()` (its own capture listener
  is gone).
- Stories: `Library/Widgets` Panel (the handle's place, look, what it covers, a finger's drag,
  the keyboard, a second call) and CentredPanel (a finger's and the mouse's drag keep the
  top-left corner, the limits, an absolute panel resizable by its class);
  `Project/OntologySelector` Default (finger and mouse drags, the minimum size).

## 3.2.0

Floating panels keep their header while they scroll. See the README's "Widgets".

- **`widgets.css`: `.nwl-panel`, `.nwl-panel-header`, `.nwl-panel-body`**, for plain HTML (the
  apps' Mustache and viewer panels): a flex column whose header never shrinks or scrolls and
  whose body takes the rest and scrolls (`overflow: auto; min-height: 0`,
  `overscroll-behavior: contain`). Flex, not `position: sticky`: no offset tied to the panel's
  padding, and no scrollbar beside the header. The panel keeps its own position and size, may be
  `resize: both` (`overflow: hidden`), is no larger than the viewport, and takes its colours
  from the tokens (`--nwl-bg-surface`, `--nwl-border`, `--nwl-shadow-2`; header
  `--nwl-bg-pressed`). It shows as `display: flex` (the `hidden` attribute hides it).
- **`floatingPanel(panel)`, `pinPanel(panel)`, `isTransformed(panel)`**, new in
  `src/components/common/panel.js`: a panel centred with `translate(-50%, -50%)` keeps its
  centre when its size changes, so its resize corner grew it in every direction. At rest it
  stays centred; at the first `pointerdown` on it (resize corner, header), `floatingPanel`
  pins it by its top-left corner (`transform: none`, `left` / `top` in px, same place), so a
  resize keeps the opposite edges in place. A drag then places the top-left corner
  (offset = press point - rect's left/top, no more `width / 2`). Exported from
  `nwl-components` and, without Vue, from **`nwl-components/panel`**
  (`dist/panel/nwl-components-panel.umd.js`: the global `nwlComponentsPanel` on a page with no
  bundle; `panel/` for webpack 4; `vite.panel.config.js`).
- **`OntologySelector`**: its header stays while the labels scroll (it scrolled away with them);
  the panel is still dragged by its header and resizable, and is pinned at its first press, so
  a resize grows it towards the corner pulled only.
- Stories: `Library/Widgets` Panel (a long body: the header stays after scrolling to the end and
  after a resize, no wider than the viewport) and CentredPanel (pinned at the first press
  without moving; a resize keeps its top-left corner); `Project/OntologySelector` Default checks
  the header after scrolling the 80 labels, dragging by the header, and a resize after it.

## 3.1.0

Resizable table columns (UI kit step 15a). See the README's "Resizable columns".

- **`resizableColumns(table, { wrapper })`**, new in `src/components/common/resize.js`: a handle
  at the right edge of every column header; drag (pointer events with pointer capture: mouse,
  pen, touch), ArrowLeft/ArrowRight (10px, 50px with Shift), double-click or Enter to go back to
  the automatic layout. Nothing moves before the first resize, which freezes every column's
  width in px and switches the table to `table-layout: fixed`; then only the resized column
  changes; the wrapper scrolls (`overflow-x: auto`, class `nwl-resize-overflow`) only while the
  table is wider than it, so popups in cells are not clipped. Not remembered. Returns `{ reset(), destroy() }`; a second call on the same table
  returns the same object. Also `columnHeaders(table)` and `minColumnWidth(th)`. Exported from
  `nwl-components` and, without Vue, from **`nwl-components/resize`**, with its CSS in
  **`nwl-components/resize/style.css`** (`vite.resize.config.js`, as `./sort`; `resize/` for
  webpack 4).
- **`Table`**: resizable by default (prop `resizable`, default `true`). It renders
  `<div class="nwl-resize-wrap">` (no box until a resize) around its `<table>`, and its
  attributes now go to the `<table>` (`inheritAttrs: false`), so apps see the same table.
- **`ImportFilesDialog`**: its table uses the helper, inside its existing scroller.
- Tab order in sortable headers: each sort button, then its column's resize handle.
- Stories: `Common/Table` ResizableColumns (drag, keys, double-click, no sort from the handle,
  scrolling) and ResizableSameLayout (no layout change at rest); `Common/PlainResize` (the
  helper's unit tests). The tab-order checks of `Common/Table` and `Library/Look` take the
  handle into account.

## 3.0.0

Breaking: the look of the 2.4 opt-in 2027 theme is now the only look (UI kit step 14). Apps whose
pages all set `data-nwl-theme="2027"` and link `fonts.css` on 2.4.x see no change. See the
README's "Look" and "Upgrading from 2.x".

- **`tokens.css`**: the values of `:root[data-nwl-theme="2027"]` are the tier 2 defaults, and
  that block is gone: page #1a1a1a, panels #252525, menus and selected rows #2e2e2e, pressed
  #404040, dividers #383838, strong borders #999, text #e8e8e8 / #c0c0c0 / #999, placeholders
  #999, `--nwl-font-body` "Source Sans 3" then the 2.x stack, `--nwl-font-mono` "IBM Plex Mono"
  then the 2.x stack, `--nwl-shadow-1` and `--nwl-shadow-2` always defined, content column 800px
  (container 1020px).
- **Removed tokens**: `--nwl-grey-22`, `--nwl-grey-55`, `--nwl-white-40` (raw palette entries
  nothing uses any more) and `--nwl-shadow-md` (unused). `--nwl-shadow-sm` stays (microdraw's
  CSS reads it); the cyan entries and `--nwl-accent*` stay, defined and unused.
- **Removed: the `data-nwl-theme` attribute.** Nothing in the library reads it; a page that
  still sets it is unaffected.
- **`base.css`**: inside `.app`, `h1`/`h2` are semibold (600) and `h3` medium (500), alignment
  and size unchanged; form controls (`button`, `input`, `select`, `textarea`) inherit the font
  family (in 2.x they kept the browser's: Arial, monospace for `textarea`). Both were under the
  attribute in 2.4.
- Components: the `var(--nwl-shadow-1, …)` / `var(--nwl-shadow-2, …)` fallbacks are plain
  `var()` (`Autocomplete`, `Editor` palette, `OntologySelector`, `ImportFilesDialog`).
- `fonts.css`: unchanged faces; still a separate stylesheet (not in `dist/style.css`), now linked
  by every page using the kit.
- Storybook: the toolbar theme switch and `.storybook/theme.js` are gone; the preview always
  links `fonts.css` (`.storybook/preview-head.html`) and its background is #1a1a1a.
  `Styles/Theme 2027` is `Styles/Theme` (Swatches, Contrast, TypeScale, Fonts, Controls, Widths
  on the defaults); `DefaultUnchanged` is replaced by `Defaults`, the 3.0.0 values (also with the
  attribute set). `Library/Look`, `Library/Base`, `Library/Widgets` and `Pages/Settings` Default
  expect the 3.0.0 values.

## 2.4.2

- 2027 theme: Source Sans 3 sits its letters where Lucida Grande did in a centred line. Its own
  metrics leave more room under the letters, so in table cells, buttons and the slider's − and +
  the text sat about 1px higher than today. `fonts.css` gives the three Source Sans 3 faces
  `ascent-override: 109%` and `descent-override: 33.4%`: the same line height, the letters
  0.068em lower. The `Styles/Theme 2027` Fonts test checks the overrides.

## 2.4.1

- 2027 theme: a wider content column. `TwoCols` (user and settings pages) reads its widths on
  screens of 1023px and up from two new tokens, `--nwl-content-max` and `--nwl-container-max`:
  684 and 984px by default (unchanged), 800 and 1020px under `data-nwl-theme="2027"`.
- Story `Styles/Theme 2027` Widths: the rendered widths in both themes (play test).

## 2.4.0

New: the opt-in 2027 theme (UI kit step 12, decisions U11–U17). Nothing changes on a page that
doesn't set `data-nwl-theme="2027"` on `<html>`: every token keeps its 2.3.0 value.

- **`tokens.css`**: new raw values in tier 1 (greys `--nwl-grey-1a` … `--nwl-grey-e8`,
  `--nwl-black-40/-50`, the font names); a third block,
  `:root[data-nwl-theme="2027"]`, remaps tier 2: softer greys (page #1a1a1a, panels #252525,
  menus and selected rows #2e2e2e, canvas still #000), off-white text #e8e8e8, no text darker
  than #999, control borders ≥ 3:1, no accent (focus and links stay the text colour; the
  `--nwl-accent*` tokens are unchanged and unused),
  Source Sans 3 and IBM Plex Mono before today's stacks, and two shadows `--nwl-shadow-1`
  (menus) and `--nwl-shadow-2` (floating panels). See the README ("Themes") for the table.
- **`nwl-components/fonts.css`** (`dist/fonts.css`, not in `dist/style.css`): `@font-face` for
  Source Sans 3 (400, 400 italic, 600), IBM Plex Mono (400) and Roboto (100), `font-display:
  swap`, URLs relative to the file. The woff2 files (Latin subset) and their SIL OFL 1.1
  licences are in `dist/fonts/`, copied at build from `@fontsource/*` devDependencies.
- **`base.css`**, under the theme only: `h1`–`h3` in `.app` weight 600/600/500 (alignment unchanged);
  form controls inherit the font family (today they keep the browser's).
- **Fix, visible in both themes: `Checkbox`**'s ring is 13px (was 11px), so it is centred on the
  9px disc again: since 2.0.0's inherited `box-sizing: border-box` it sat 1px up and left. Its
  story checks both centres within 0.5px.
- Shadows, under the theme only (today's value as the `var()` fallback): `Autocomplete`
  results, the editor's floating tool palette, the `OntologySelector` panel, the
  `ImportFilesDialog` box.
- Storybook: a toolbar **Theme** switch (today / 2027; default today) and the `Styles/Theme 2027`
  stories (swatches of every tier 2 token in both themes with computed contrast ratios, the
  type scale in the three fonts) with play tests: 2027 contrasts, 2.3.0 values without the
  attribute, fonts loaded from `fonts/`, controls' font; `Pages/Settings` Default checks the
  project name stays centred in both themes.

## 2.3.0

New: the shared icon set (UI kit step 11c). Added files, plus one changed drawing.

- **`dist/icons/<name>.svg`**: every UI icon of nwl-components, BrainBox and microdraw, one file
  per meaning (73), copied byte for byte from the repos (no redraw). Exported as
  `nwl-components/icons/*` (`exports`); `nwl-components/dist/icons/*` for webpack 4. The sources
  are in `src/icons/`, and `src/icons/README.md` maps each name to the file it came from and the
  app copies it replaces. Merged copies are byte-identical or render the same (0 differing
  pixels at 48 px). One rename: BrainBox's `floppy` is `save`. See the README ("Icons").
- The components take their icons from `src/icons/` instead of `src/assets/` (which keeps the
  logos). `Nav`, `Access` and the editor components look the same.
- **`PureFiles`** (the settings page's Files list): the download and upload icons are now
  BrainBox's drawing, larger and bolder, the one the BrainBox viewer uses.
- Story `Icons/All`: every icon with its name; its `play` test checks one file per row of the
  map, that every image loads, and that no name is used twice.

## 2.2.0

New: `useProject` is exported from the library entry (`import { useProject } from
'nwl-components'`). Added export only; nothing else changes.

- It is the same store `Nav` and the settings pages use (one state in `dist/`, es and umd), so an
  app can set the project with `setProject(project)` and the `Header` shows the settings link
  (`/project/<shortname>/settings`) when the app also provides `displaySettings: true`. Call it
  inside a component's `setup` or the app's `runWithContext`: it injects `config`. See the
  README ("Store").
- Stories `Layout/Header` `WithProjectSettings` (link present, a project without `files` is
  accepted) and `WithoutProject` (no link), with `play` tests.

## 2.1.1

- `Footer`: the text link ("groupe de neuroanatomie appliquée et théorique") shows an underline
  on hover. It has none at rest and is the text colour, so the hover underline is what marks it
  as a link (WCAG 1.4.1), as the apps do for their own bare links since step 9a. The logo link,
  an image, is unchanged. The `Layout/Footer` story checks both states.

## 2.1.0

New: widget classes for markup that isn't Vue. Nothing existing changes on screen: the library's
components look the same (computed styles of every story, hover included, are those of 2.0.0).

- **`widgets.css`** (`src/styles/widgets.css`, in `@layer nwl.widgets`, selectors in
  `:where()`, semantic tokens only), exported as `nwl-components/widgets.css` (`dist/widgets.css`;
  also `widgets.css` at the package root for webpack 4) and included in `dist/style.css`. It
  works on its own after `tokens.css` and `base.css`. Classes:
  - `.nwl-push-button`: `Button`'s push look (1px `--nwl-border-strong`, `--nwl-radius-md`,
    bold, `padding: 5px 0`, centred); hover `--nwl-bg-pressed`, disabled opacity .4; on
    `<button>`, `<a>`, `<select>`, `<input type="button|submit">`, browser look reset.
  - `.nwl-tool-button`: the viewers' tool button (BrainBox `.a`, microdraw `.mui`): 24px,
    1px `--nwl-border`, `--nwl-radius-sm`, 1px margin, fills its container; on a native
    `<button>`, browser look reset. Hover: `--nwl-bg-pressed` with text, opacity .5 with only
    an icon. `.nwl-tool-button--sub`: no border, 22px.
  - `.nwl-icon-button` (no border, opacity .5 on hover; needs `aria-label`), `.nwl-icon` (16px,
    middle-aligned, not selectable), `.nwl-text-field` (input, textarea: inherited size and
    colour, `--nwl-bg-input`, 1px `--nwl-border`, `--nwl-radius-sm`, placeholder
    `--nwl-text-placeholder`).
  - Keyboard focus on the widgets: the 2px `--nwl-focus` outline, also outside `.app`.
- **ARIA state contract**: the state is an attribute, not a class. `aria-pressed="true"` on a
  `.nwl-tool-button` gives `--nwl-bg-pressed`; `aria-selected="true"` on a `<tr>` gives
  `--nwl-bg-elevated`; `disabled` or `aria-disabled="true"` dims a button.
- `Button`'s push variant (`class-name="push-button"`) renders `.nwl-push-button` (and keeps
  `push-button`); its look now comes from `widgets.css`. `NewProjectPage` passes it as
  `class-name`. The selectable rows of `PureFiles`, `PureAnnotations`, `PureCollaborators`,
  `TextAnnotations` and `VolumeAnnotations` carry `aria-selected` beside their `.selected`
  class; `Tabs` is a `tablist` of `tab`s with `aria-selected`.
- Tokens: new `--nwl-text-button` (push buttons' text, `#ddd`); `--nwl-link` and
  `--nwl-link-hover` are now `var(--nwl-text)` (same value, white). `base.css` gives hovered
  links `--nwl-link-hover`.
- Stories `Library/Widgets` (plain HTML; play tests read computed styles: pressed state follows
  `aria-pressed`, icon versus text hover, Tab reaches a native tool button and shows the
  outline, an unlayered one-class app rule beats a widget). `.storybook/test-runner.js`
  checks hovered styles with the real mouse (`parameters.hoverStyles`); `Library/Look` checks
  `Button` and table-row hover with it.

## 2.0.0

Breaking: the library's CSS changes priority, and the global `*` rule is gone. No visual change
inside the library's own components except the focus outline and `SortableTh`'s unsorted icon
(below); stories `Library/Look` (unchanged) and `Library/Base` check it.

- **Cascade layers.** All library CSS is in `@layer nwl.base, nwl.widgets, nwl.components`,
  declared once at the top of `dist/style.css`, `nwl-components/base.css` and
  `nwl-components/sort/style.css` (a PostCSS step in `vite.config.js`, `scripts/css-layers.js`).
  **Unlayered app CSS now always beats library CSS**, whatever the specificity or load order:
  an app rule that used to lose to a component's scoped rule (e.g. `button { … }` against
  `Button`) now wins. The tokens stay unlayered. Rules an app wrote with `!important` or an
  `html …` prefix to beat the library still work and can be simplified.
- **No `*` rule.** `Wrapper.vue`'s `* { box-sizing: border-box; font-size: 14px; color: white }`
  is removed. It applied to the whole page, also outside the wrapper. Apps that relied on it
  for their own markup (outside `.app`, or headings, links and form controls that the
  browser styles) must set font, size and colour themselves.
- **`base.css`** (`src/styles/base.css`, in `nwl.base`, selectors in `:where()`), exported as
  `nwl-components/base.css` and included in `dist/style.css`: `html` font size 14px (1rem keeps
  its 1.x value), `body` margin 0 (moved from `Wrapper.vue`), font and colour on `.app`,
  inherited; `box-sizing: border-box` on `.app`, inherited by all elements and pseudo-elements;
  headings, `small`/`sub`/`sup`, code and form controls take their parent's font size, form
  controls and `<dialog>` their parent's colour (the controls' font family unchanged), links
  `--nwl-link`.
- **Focus outline.** New token `--nwl-focus` (= `--nwl-text`, white). `:focus-visible` inside
  `.app` gets `outline: 2px solid var(--nwl-focus); outline-offset: 2px`. `Button`, `Select`
  and `RangeSlider` no longer set `outline: none`; `sortable.css`'s 1px `currentColor`
  outline is now 2px `--nwl-focus` (2px offset). Mouse focus shows no outline on buttons;
  browsers show it on text fields, and Chromium on `<select>`.
- Components that relied on the `*` rule keep their look: `OntologySelector`'s contents and
  `Footer`'s links stay 14px; `ScriptConsole`'s overrides of codeflask's (unlayered) CSS use
  `!important`, the one way a layered rule beats unlayered CSS (and its code text stays
  white).
- One visible change besides focus: `SortableTh`'s unsorted icon on pages with
  `dist/style.css` is now grey (`--nwl-grey-7a`, `--nwl-grey-bb` on hover) as designed and as on
  `sort/style.css` pages. 1.x's `*` rule set the icon's `<path>` colour to white, and the
  stroke (`currentColor`) followed it.
- Stories `Library/Base`: form controls inside the wrapper compute 14px, white and the 1.x
  font, `box-sizing` is `border-box`, children inherit (no `*` rule), app CSS beats a
  component's scoped rule, keyboard focus (`userEvent.tab()`) shows a 2px solid outline in
  `--nwl-focus`'s colour, and a real mouse click (`.storybook/test-runner.js`) shows none.

## 1.8.0

- Design tokens: `src/styles/tokens.css`, `:root` custom properties in two tiers (a raw
  palette, the only place with hex values, and semantic tokens for backgrounds, borders,
  text, accent, links, status colours, fonts, sizes, weights, line heights, spacing, radii and
  shadows), with today's values. Exported as `nwl-components/tokens.css` (`dist/tokens.css`;
  also `tokens.css` at the package root for webpack 4), importable on its own.
- `dist/style.css` and `sort/style.css` each include the tokens, and the library's CSS reads
  them (`var(--nwl-…)`) instead of colour, font, font-size and radius literals. No visual
  change: the computed styles are the same as in 1.7.1 (stories `Library/Look`, which check
  Button, Table, an Access cell, SortableTh, OntologySelector, Header and Footer).
- Storybook page `Library/Tokens`: every token with a sample; its test checks that every
  token is defined.
- `npm run lint`: eslint, then `scripts/check-tokens.js`, which fails on a hex colour in
  `src/**/*.{vue,css}` outside `tokens.css` or on an undefined `--nwl-` token.

## 1.7.1

- `NewProjectPage`: the invalid-name warning says short names can contain "letters, numbers and
  hyphens" (was "letters and numbers"): both apps accept hyphens in new shortnames since
  2026-11-11. The story's check allows hyphens too; new story `Pages/New Project` InvalidName.

## 1.7.0

- `PureCollaborators` (and so `Collaborators` and the settings pages): `anyone` is the minimum a
  named collaborator has. Raising `anyone`'s level of one type (collaborators, annotations or
  files) above that of named collaborators asks first, with `window.confirm`, naming them, the
  type and the new level. On confirm, those collaborators are raised to the new level with
  `anyone`, through `updateCollaborator` events (one per row); on cancel nothing changes.
  Lowering `anyone`, or changing a named collaborator, works as before. The `anyone` row is
  recognised by `username` or `userID`. Stories `Settings/Collaborators` RaiseAnyoneConfirmed,
  RaiseAnyoneCancelled, RaiseAnyoneNoneBelow, LowerAnyone.

## 1.6.1

- String columns sort in natural order (`localeCompare` with `numeric: true`): "Macaque E70",
  "E90", "E120", and "file2" before "file10" (before, "E120" came first). Applies to
  `sortRows` and so to `useSortable`/`SortableTh`; missing values, stability, numbers and
  dates are unchanged. Story `Common/PlainSort` NaturalOrder.

## 1.6.0

- Sorting for tables built without Vue: `nwl-components/sort` (no Vue) exports `sortRows`,
  `sortValue`, `nextSort`, `sortableHeader`, `renderSortIcon`, `ariaSort` and the icon data
  `SORT_ICON_PATHS` / `SORT_ICON_ATTRS`; the same names are also exported from
  `nwl-components`. `useSortable` and `SortableTh` now use them (no behaviour change).
- The sortable header styles alone (only `th.nwl-sortable` / `.nwl-sort-*` rules, nothing
  global) as `nwl-components/sort/style.css`, for pages that must not load `dist/style.css`;
  they stay in `dist/style.css` for `SortableTh`. New story `Common/PlainSort`.

Earlier releases are in the git history.
