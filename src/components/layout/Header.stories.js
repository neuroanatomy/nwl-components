import { expect } from '@storybook/test';

// the public entry, as the apps import it (not '@/store/project')
import { useProject } from '@/components';
import Header from '@/components/layout/Header.vue';

export default {
  title: 'Layout/Header',
  component: Header
};

const Template = (args) => ({
  components: { Header },
  setup () {
    return {
      ...args
    };
  },
  template: '<Header />'
});

export const Default = Template.bind({});

// an app that shows the settings link: provides displaySettings and sets the project
export const WithProjectSettings = () => ({
  components: { Header },
  provide: { displaySettings: true },
  setup () {
    // no `files`: setProject must not throw (transformProjectFiles gives an empty list)
    const { setProject, project } = useProject();
    setProject({ shortname: 'demo', name: 'Demo' });

    return { project };
  },
  template: '<Header /><output hidden data-test="files">{{ project.files.list.length }}</output>'
});
WithProjectSettings.play = async ({ canvasElement }) => {
  const link = canvasElement.querySelector('nav a[href$="/settings"]');
  await expect(link).not.toBeNull();
  await expect(link.getAttribute('href')).toBe('/project/demo/settings');
  // the project had no files: the store holds an empty list
  await expect(canvasElement.querySelector('[data-test="files"]').textContent).toBe('0');
};

// displaySettings provided, but no project: no settings link
export const WithoutProject = () => ({
  components: { Header },
  provide: { displaySettings: true },
  setup () {
    // the store is module-level: reset it, so the story order doesn't matter
    useProject().setProject(null);

    return {};
  },
  template: '<Header />'
});
WithoutProject.play = async ({ canvasElement }) => {
  await expect(canvasElement.querySelector('nav')).not.toBeNull();
  await expect(canvasElement.querySelector('nav a[href$="/settings"]')).toBeNull();
};
