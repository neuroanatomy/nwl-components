import faker from '@faker-js/faker';
import { action } from '@storybook/addon-actions';
import { inject, reactive } from 'vue';

import PureCollaborators from '@/components/settings/PureCollaborators.vue';

export default {
  title: 'Settings/Collaborators',
  component: PureCollaborators
};
const Template = (args) => ({
  components: { PureCollaborators },
  setup () {
    const { usernameField } = inject('config');
    const usersFound = reactive([]);
    const searchUsers = () => {
      usersFound.splice(0, usersFound.length);
      for (let i = 0; i < 3; i++) {
        const name = faker.name.findName();
        usersFound.push({ name, [usernameField]: faker.internet.userName(name)});
      }
    };

    return {
      ...args,
      usersFound,
      searchUsers
    };
  },
  template:
    `<PureCollaborators :collaborators="collaborators"
                    :users-found="usersFound"
                    @add-collaborator="addCollaborator"
                    @remove-collaborators="removeCollaborators"
                    @update-collaborator="updateCollaborator"
                    @search-users="searchUsers" />`
});

export const Default = Template.bind({});
Default.args = {
  collaborators: [
    {
      userID: 'anyone',
      access: { collaborators: 'view', annotations: 'edit', files: 'view' },
      name: 'Any User'
    },
    {
      userID: 'dhovart',
      access: { collaborators: 'view', annotations: 'remove', files: 'view' },
      name: 'Denis'
    },
    {
      userID: 'userID',
      access: { collaborators: 'remove', annotations: 'remove', files: 'view' },
      name: 'Another user'
    },
    {
      userID: 'anotheruserID',
      access: { collaborators: 'none', annotations: 'remove', files: 'view' },
      name: 'Yet Another User'
    }
  ],
  addCollaborator: action('add collaborator'),
  removeCollaborators: action('remove collaborators'),
  updateCollaborator: action('update collaborator')
};
