import { action } from '@storybook/addon-actions';

import Access from '@/components/settings/Access.vue';

export default {
  title: 'Settings/Access',
  component: Access
};

const Template = (args) => ({
  components: { Access },
  setup () {
    return {
      ...args
    };
  },
  template: '<Access :collaborator="collaborator" type="annotations" @update-access="handleAccessChange" />'
});

export const Default = Template.bind({});
Default.args = {
  collaborator: {
    username: 'anyone',
    access: { collaborators: 'view', annotations: 'edit', files: 'view' },
    name: 'Any User'
  },
  handleAccessChange: action('access change')
};
