# About

This project is a library of components to be used on the frontend of the Neuroweblab projects. 
They are similar in style and behaviour to existing projects.

## Scope

nwl-components holds only **generic** components, which any NAAT app can use and
customise through props, slots and the `config` object: the project-management pages,
the project-page shell, and generic building blocks. Nothing tied to one app
(BrainBox or microdraw) and none of a viewer's own logic belongs here; that stays in
each app.

Exports by group:

| Group | Exports |
|---|---|
| Pages | `UserPage`, `NewProjectPage`, `SettingsPage`, `ProjectPage` (the project-page shell: header, resizable left/right split, fullscreen; the app fills the slots) |
| Layout | `Wrapper`, `Header`, `Nav`, `Footer` |
| Settings | `Settings`, `ProjectInfo`, `Files`, `Collaborators`, `Annotations`, `Access`, `ImportFilesDialog`, `PureFiles`, `PureCollaborators`, `PureAnnotations` |
| Common widgets | `Button`, `Checkbox`, `Select`, `TextInput`, `TextArea`, `Autocomplete`, `Table`, `SortableTh` and `useSortable` (sortable table columns), `Tabs`, `Tab` |
| Building blocks | `Editor` (floating/dockable tool window with content and tools slots), `Row`, `Col`, `ButtonsGroup`, `RangeSlider`, `AdjustSettings`, `Chat`, `ScriptConsole`, `TextAnnotations`, `VolumeAnnotations`, `AnnotationCell`, `OntologySelector` (label-set selector) |

### To clean up

App-specific content that should become neutral later (no component is deprecated):

- the BrainBox stories `src/components/pages/BrainboxProjectPage.stories.js` and
  `src/components/project/BrainboxProject.stories.js`;
- the story data `TextAnnotations.brainbox.fixtures.json` and
  `TextAnnotations.microdraw.fixtures.json`;
- the BrainBox settings (site name, logo, URLs, label sets) in `.storybook/preview.js`;
- `ScriptConsole`: it loads codeflask and consolita from fixed CDN URLs, and its CSS
  targets the global id `#logScript`; both should become configurable;
- `Chat` renders messages as raw HTML (`v-html`): they must be sanitised before an
  app uses it.

## Sortable tables

`useSortable(rows, columns)` keeps a table's sort state; `SortableTh` is a header cell
that sorts by its column when clicked (or with Enter/Space). Every sortable header always
shows an icon (a grey up/down "sort" icon when the column is not the sort column, one
up or down arrow when it is; inline SVG from Tabler Icons, MIT) in a box of fixed size,
so nothing moves when you click; `aria-sort` is set on the
`<th>`. First click sorts ascending, a second click reverses, another column sorts
ascending; missing values (`null`, `undefined`, `''`, not a number/date) are always last.
The `rows` array is never mutated. Headers written as plain `<th>` look as before.

```js
import { SortableTh, Table, useSortable } from 'nwl-components';

const PageContents = {
  template: '#template',
  setup () {
    const projects = ref([]);
    const sort = useSortable(projects, {
      // column name: { key: row property (or row => value), type: 'string' (default) | 'number' | 'date' }
      Name: { key: 'project' },
      Files: { key: 'numFiles', type: 'number' },
      'Last modified': { key: 'modified', type: 'date' }
    });

    return { projects, sort, sortedProjects: sort.sortedRows };
  }
};
const app = createApp(PageContents);
app.component('Table', Table);
app.component('SortableTh', SortableTh);
```

```html
<script type="text/html" id="template">
  <Table>
    <thead><tr>
      <sortable-th :sort="sort" column="Name">Name</sortable-th>
      <sortable-th :sort="sort" column="Files">Files</sortable-th>
      <sortable-th :sort="sort" column="Last modified">Last modified</sortable-th>
    </tr></thead>
    <tbody>
      <tr v-for="project in sortedProjects">...</tr>
    </tbody>
  </Table>
</script>
```

In a template parsed by the browser (written directly in the page, not in a
`<script type="text/html">`), write `<th is="vue:sortable-th" ...>` instead, so the
browser keeps it inside the table. `useSortable` also returns `sortBy(column)`,
`direction(column)` (`'ascending'`, `'descending'` or `'none'`), and the refs
`sortColumn` and `sortAscending`; a third argument `{ column, ascending }` sets an initial
sort. Story: `Common/Table` (`npm run storybook`). Since 1.5.0.

## Single File Components

This project makes use of Vue SFCs: _Single File Components_, that have the `.vue` extension.
They encapsulate the template, logic, and styling of a component in a single file, which makes sense for a library of components. Read more about SFC in the [Vue documentation](https://vuejs.org/guide/scaling-up/sfc.html).

## Scoped styles

> When a <style> tag has the scoped attribute, its CSS will apply to elements of the current component only. This is similar to the style encapsulation found in Shadow DOM.

Read more on https://vuejs.org/api/sfc-css-features.html#scoped-css

The idea here is to encapsulate the appearance of components in the file they are defined, and not let in leak elsewhere.   

## Composition API

The components make use of the Vue 3 [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) which make code more reusable and [<script setup>](https://vuejs.org/api/sfc-script-setup.html) to make it code more compact.

See below how we use composables to define access to the store methods and properties.

## Store

In the project, the store is comprised of the modules in `src/store`.

Said modules are [composables](https://vuejs.org/guide/reusability/composables.html) that consist of a main function, usually prefixed with `use`, designed to expose stateful logic to other components.

They contain [reactive](https://vuejs.org/guide/extras/reactivity-in-depth.html#reactivity-in-depth) objects and actions to update them that you can "inject" inside of other components.

The idea is to have a centralized way of performing CRUD updates on the stateful slices of data on which rely other components.

## _Pure_ components

Pure components, also sometimes called _dumb_ components, doesn't have any logic tied to them: they're just taking care of how the component look and behave according to props. They can emit events, but the listeners should be plugged in the parent components.

The parent components are said to be container components (or sometimes _smart_ components) : this is where you actually define the logic and actions of updating the store or retrieving data from it. They're the one actually connected to the store, defined above.

This concept makes it possible to separate view and business logic. In the project, pure components are prefixed with _Pure_.


## Configuration

The apps give the components their settings through a `config` object, provided to the
whole Vue app (`app.provide('config', config)`); see `.storybook/preview.js` for the
usual keys (`baseURL`, `usernameField`, `fetchLabelSets`, ...). Optional settings, all
off by default:

| Key | Default | Effect |
|---|---|---|
| `showEmbedButton` | `true` | Set to `false` to hide the "Embed Project" button (and its dialog) in the project settings, for apps that have no `/project/:p/embed` page. |
| `beforeSaveProject(project)` | none | Called when "Save Changes" is clicked in the project settings, before the project is sent to the server, with the project as edited. Return (or resolve to) `false` to cancel the save; any other value saves as before. If it throws or rejects, the project is not saved and the page shows "Changes not saved". |

```js
app.provide('config', {
  baseURL: '',
  // ...
  showEmbedButton: false,
  beforeSaveProject: async (project) => {
    // e.g. check the project, ask the user to confirm
    return confirm(`Save ${project.shortname}?`);
  }
});
```

Since 1.4.0.

## Storybook

The components are documented through storybook, where you can see their props and see example use cases (for now we just have 'default' ones). Storybook stories are defined in files with the `.stories.js` extension. It's a quite handy tool to develop a component in isolation of other components.

Run `npm run storybook` to launch storybook.

To have a documentation always accessible, it could be possible to build storybook and publish it on Chromatic, for example through this [Github Action](https://github.com/chromaui/action).

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
