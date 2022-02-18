<template>
  <div class="wrapper">
    <h2>Collaborators</h2>
    <Table id="access">
      <thead>
        <tr>
          <th>User Name</th>
          <th>Name</th>
          <th>Collaborators</th>
          <th>Annotations</th>
          <th>Data Files</th>
          <th>Batch</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(collaborator, idx) in collaborators"
          :key="collaborator.userID"
          @click="handleRowClick($event, idx)"
        >
          <td style="position: relative">
            <Autocomplete
              @input="handleUserSearch"
              @select="handleUserSelect"
              :items="props.usersFound"
              :is-async="true"
              :extra-select-args="[props.collaborators.indexOf(collaborator)]"
              :default-value="collaborator.userID"
              :disabled="collaborator.userID === 'anyone'"
              :extract-result-text="(result) => result.nickname"
              aria-label="Search by username"
            />
          </td>
          <td>
            <TextInput
              v-model="collaborator.name"
              placeholder="User Name"
              :disabled="collaborator.username === 'anyone'"
              @blur="handleNameChange(collaborator, $event.target.value)"
              @keyup.enter="handleNameChange(collaborator, $event.target.value)"
            />
          </td>
          <td>
            <Access
              type="collaborators"
              :collaborator="collaborator"
              @update-access="handleAccessChange"
            />
          </td>
          <td>
            <Access
              type="annotations"
              :collaborator="collaborator"
              @update-access="handleAccessChange"
            />
          </td>
          <td>
            <Access
              type="files"
              :collaborator="collaborator"
              @update-access="handleAccessChange"
            />
          </td>
          <td>
            <input
              v-if="collaborator.userID !== 'anyone'"
              type="checkbox"
              :checked="selected.has(idx)"
              @click="toggleSelected(idx)"
            />
          </td>
        </tr>
      </tbody>
    </Table>
    <div class="actions">
      <Button :small="true" @click="$emit('addCollaborator')" title="Add collaborator">
        +
      </Button>
      <Button :small="true"
        @click="$emit('removeCollaborators', [...selected])"
        title="Remove selected collaborators"
        :disabled="selected.size === 0"
      >
        -
      </Button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import Button from '@/components/common/Button.vue';
import Table from '@/components/common/Table.vue';
import Access from '@/components/settings/Access.vue';
import Autocomplete from '@/components/common/Autocomplete.vue';
import { debounce } from 'lodash';
import AccessLevel from '@/domain/AccessLevel';

const props = defineProps({
  collaborators: {
    type: Array,
    required: true,
  },
  usersFound: Array,
});

const emit = defineEmits([
  "addCollaborator",
  "removeCollaborators",
  "updateCollaborator",
  "searchUsers",
]);

const handleUserSearch = debounce((search) => {
  emit("searchUsers", search);
}, 300);

const selected = reactive(new Set());
const toggleSelected = (idx) => {
  selected.has(idx) ? selected.delete(idx) : selected.add(idx);
};

const handleRowClick = (event, idx) => {
  if (["BUTTON", "INPUT", "LI"].includes(event.target.tagName)) {
    return;
  }
  toggleSelected(idx);
};

const emitCollaboratorUpdate = (idx, properties) => {
  emit("updateCollaborator", idx, {
    ...props.collaborators[idx],
    ...properties,
  });
};

const handleAccessChange = (collaborator, accessType, level) => {
  const idx = props.collaborators.indexOf(collaborator);
  if (idx < 0) return;
  const existingAccessLevel = new AccessLevel(props.collaborators[idx].access[accessType]).toInt();

  let requestedLevel = level;
  if (existingAccessLevel === requestedLevel) {
    requestedLevel--;
  }

  emitCollaboratorUpdate(idx, {
    access: {
      ...props.collaborators[idx].access,
      [accessType]: AccessLevel.fromInt(requestedLevel).toString(),
    },
  });
};

const handleNameChange = (collaborator, name) => {
  const idx = props.collaborators.indexOf(collaborator);
  if (idx < 0) return;
  emitCollaboratorUpdate(idx, { name });
};

const handleUserSelect = (userInfo, idx) => {
  emitCollaboratorUpdate(idx, {
    userID: userInfo.nickname,
    name: userInfo.name,
  });
};
</script>
<style scoped>
h2 {
  margin: 0 0 10px;
  font-size: 16px;
}
.wrapper {
  padding: 10px;
}

th:last-child, td:last-child {
  text-align: right;
  padding: 5px;
}

.actions {
  text-align: right;
  margin-top: 20px;
}
</style>