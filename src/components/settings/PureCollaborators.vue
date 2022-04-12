<template>
  <div class="wrapper">
    <h2>Access</h2>
    <Table id="access">
      <thead>
        <tr>
          <th>User Name</th>
          <th>Name</th>
          <th>Collaborators</th>
          <th>Annotations</th>
          <th>Files</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(collaborator, idx) in collaborators"
          :key="collaborator.userID"
          :class="{ selected: selected === idx }"
          @click="handleRowClick($event, idx)"
        >
          <td style="position: relative">
            <Autocomplete
              @input="handleUserSearch"
              @select="handleUserSelect"
              :items="props.usersFound"
              :is-async="true"
              :extra-select-args="[props.collaborators.indexOf(collaborator)]"
              :default-value="collaborator[usernameField] || collaborator[userID]"
              :disabled="collaborator[usernameField] === 'anyone'"
              :extract-result-text="(result) => result[usernameField]"
              aria-label="Search by username"
            />
          </td>
          <td>
            <TextInput
              v-model="collaborator.name"
              placeholder="User Name"
              :disabled="collaborator[usernameField] === 'anyone'"
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
        </tr>
      </tbody>
    </Table>
    <div class="actions">
      <Button
        :small="true"
        @click="$emit('addCollaborator')"
        title="Add collaborator"
      >
        +
      </Button>
      <Button
        :small="true"
        @click="
          $emit('removeCollaborators', [selected]);
          selected = null;
        "
        title="Remove selected collaborators"
        :disabled="
          selected == null ||
          collaborators[selected][username] == 'anyone' ||
          collaborators[selected].userID === 'anyone'
        "
      >
        -
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import TextInput from "@/components/common/TextInput.vue";
import Button from "@/components/common/Button.vue";
import Table from "@/components/common/Table.vue";
import Access from "@/components/settings/Access.vue";
import Autocomplete from "@/components/common/Autocomplete.vue";
import { debounce } from "lodash-es";
import AccessLevel from "@/domain/AccessLevel";

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

const { usernameField } = inject("config");

const handleUserSearch = debounce((search) => {
  emit("searchUsers", search);
}, 300);

const selected = ref(null);
const handleRowClick = (event, idx) => {
  selected.value = idx;
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
  const existingAccessLevel = new AccessLevel(
    props.collaborators[idx].access[accessType]
  ).toInt();

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
    [usernameField]: userInfo[usernameField],
    userID: userInfo[usernameField],
    name: userInfo.name,
  });
};
</script>
<style scoped>
h2 {
  font-size: 14px;
  padding-bottom: 4px;
}

.actions {
  text-align: right;
  margin-top: 20px;
}
</style>