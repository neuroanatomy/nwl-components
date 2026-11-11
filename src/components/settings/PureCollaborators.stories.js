import faker from '@faker-js/faker';
import { action } from '@storybook/addon-actions';
import { expect, userEvent, waitFor, within } from '@storybook/test';
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

// `anyone` is the minimum a named collaborator has. Raising `anyone` above named
// collaborators asks for confirmation (window.confirm), then raises them too.
// These stories keep the list in state, as the apps do, and stub window.confirm.
const anyoneFloorCollaborators = () => [
  {
    userID: 'anyone',
    access: { collaborators: 'edit', annotations: 'none', files: 'view' },
    name: 'Any User'
  },
  {
    userID: 'alice',
    username: 'alice',
    access: { collaborators: 'none', annotations: 'view', files: 'view' },
    name: 'Alice'
  },
  {
    userID: 'bob',
    username: 'bob',
    access: { collaborators: 'edit', annotations: 'edit', files: 'view' },
    name: 'Bob'
  },
  {
    userID: 'carol',
    username: 'carol',
    access: { collaborators: 'remove', annotations: 'remove', files: 'view' },
    name: 'Carol'
  }
];

const StatefulTemplate = () => ({
  components: { PureCollaborators },
  setup () {
    const collaborators = reactive(anyoneFloorCollaborators());
    const updateCollaborator = (idx, collaborator) => {
      collaborators[idx] = collaborator;
    };

    return { collaborators, updateCollaborator };
  },
  template:
    `<PureCollaborators :collaborators="collaborators"
                    @update-collaborator="updateCollaborator" />`
});

const levels = ['none', 'view', 'edit', 'add', 'remove'];
const typeColumn = { collaborators: 2, annotations: 3, files: 4 };
// the level shown for each row, for one access type
const shownLevels = (canvasElement, type) => [...canvasElement.querySelectorAll('#access tbody tr')]
  .map((tr) => levels[Number(tr.children[typeColumn[type]].querySelector('.access').dataset.level)]);

// replaces window.confirm with one that records its messages and answers `answer`
const stubConfirm = (answer) => {
  const original = window.confirm;
  const messages = [];
  window.confirm = (message) => {
    messages.push(message);

    return answer;
  };

  return { messages, restore: () => { window.confirm = original; } };
};

const anyoneRow = (canvasElement) => within(canvasElement.querySelectorAll('#access tbody tr')[0]);

export const RaiseAnyoneConfirmed = StatefulTemplate.bind({});
RaiseAnyoneConfirmed.play = async ({ canvasElement }) => {
  const stub = stubConfirm(true);
  try {
    await userEvent.click(anyoneRow(canvasElement).getByTitle('add annotations'));
    await expect(stub.messages.length).toBe(1);
    await expect(stub.messages[0]).toContain('alice, bob');
    await expect(stub.messages[0]).not.toContain('carol');
    await expect(stub.messages[0]).toContain('annotations');
    await expect(stub.messages[0]).toContain('"add"');
    await waitFor(() => expect(shownLevels(canvasElement, 'annotations')).toEqual(['add', 'add', 'add', 'remove']));
    // other types are untouched
    await expect(shownLevels(canvasElement, 'collaborators')).toEqual(['edit', 'none', 'edit', 'remove']);
  } finally {
    stub.restore();
  }
};

export const RaiseAnyoneCancelled = StatefulTemplate.bind({});
RaiseAnyoneCancelled.play = async ({ canvasElement }) => {
  const stub = stubConfirm(false);
  try {
    await userEvent.click(anyoneRow(canvasElement).getByTitle('add annotations'));
    await expect(stub.messages.length).toBe(1);
    await new Promise((resolve) => { setTimeout(resolve, 50); });
    await expect(shownLevels(canvasElement, 'annotations')).toEqual(['none', 'view', 'edit', 'remove']);
  } finally {
    stub.restore();
  }
};

export const RaiseAnyoneNoneBelow = StatefulTemplate.bind({});
RaiseAnyoneNoneBelow.play = async ({ canvasElement }) => {
  const stub = stubConfirm(false);
  try {
    // alice already has "view": nobody is below it
    await userEvent.click(anyoneRow(canvasElement).getByTitle('view annotations'));
    await waitFor(() => expect(shownLevels(canvasElement, 'annotations')).toEqual(['view', 'view', 'edit', 'remove']));
    await expect(stub.messages.length).toBe(0);
  } finally {
    stub.restore();
  }
};

export const LowerAnyone = StatefulTemplate.bind({});
LowerAnyone.play = async ({ canvasElement }) => {
  const stub = stubConfirm(false);
  try {
    // alice's stored "none" is below anyone, but lowering anyone does not ask
    await userEvent.click(anyoneRow(canvasElement).getByTitle('view collaborators'));
    await waitFor(() => expect(shownLevels(canvasElement, 'collaborators')).toEqual(['view', 'none', 'edit', 'remove']));
    await expect(stub.messages.length).toBe(0);
  } finally {
    stub.restore();
  }
};
