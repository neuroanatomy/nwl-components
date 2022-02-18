<script setup>
import PureCollaborators from '@/components/settings/PureCollaborators.vue';
import useProject from '@/store/project';
import useUserSearch from '@/store/userSearch';

const {
    project,
    addCollaborator,
    updateCollaborator,
    removeCollaborators,
} = useProject();

const {
    usersFound,
    fetchUsers,
} = useUserSearch();

</script>
<template>
  <PureCollaborators
    v-if="project && project.collaborators"
    :collaborators="project.collaborators.list"
    :users-found="usersFound"
    @add-collaborator="addCollaborator"
    @remove-collaborators="removeCollaborators"
    @update-collaborator="updateCollaborator"
    @search-users="fetchUsers" />
</template>