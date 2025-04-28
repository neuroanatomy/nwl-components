import { inject, reactive, toRefs } from 'vue';

import ProjectService from '@/services/project';

const state = reactive({
  project: null,
  loading: true
});

// eslint-disable-next-line max-statements
export default function useProject () {
  const { baseURL, usernameField } = inject('config');
  const service = new ProjectService(baseURL);

  const setProject = (project) => {
    state.project = service.transformProjectFiles(project);
  };

  const fetchProject = async (id) => {
    state.loading = true;
    state.project = await service.fetch(id);
    state.loading = false;
  };

  const saveProject = (project) => service.save(project);

  const deleteProject = (id) => service.delete(id);

  const updateProject = (data) => {
    if (!state.project) { return; }
    state.project = {
      ...state.project,
      ...data
    };
  };

  const addCollaborator = () => {
    if (!state.project) { return; }
    state.project.collaborators.list.push({
      [usernameField]: '',
      name: '',
      access: { collaborators: 'none', annotations: 'none', files: 'none' }
    });
  };

  const updateCollaborator = (idx, data) => {
    if (!state.project) { return; }
    const collaborator = state.project.collaborators.list[idx];
    state.project.collaborators.list[idx] = {
      ...collaborator,
      ...data
    };
  };

  const removeCollaborators = (collaboratorsIdx) => {
    if (!state.project) { return; }
    state.project.collaborators.list = state.project.collaborators.list.filter(
      (collaborator) =>
        !collaboratorsIdx.includes(
          state.project.collaborators.list.indexOf(collaborator)
        )
    );
  };

  const addAnnotation = () => {
    if (!state.project) { return; }
    state.project.annotations.list.push({
      type: 'text',
      name: '',
      values: '',
      display: true
    });
  };

  const updateAnnotation = (idx, data) => {
    if (!state.project) { return; }
    const annotation = state.project.annotations.list[idx];
    state.project.annotations.list[idx] = {
      ...annotation,
      ...data
    };
  };

  const removeAnnotations = (annotationsIdx) => {
    if (!state.project) { return; }
    state.project.annotations.list = state.project.annotations.list.filter(
      (annotation) =>
        !annotationsIdx.includes(
          state.project.annotations.list.indexOf(annotation)
        )
    );
  };

  const addFile = () => {
    if (!state.project) { return; }
    state.project.files.list.push({
      source: '',
      name: ''
    });
  };

  const updateFile = (idx, data) => {
    if (!state.project) { return; }
    const file = state.project.files.list[idx];
    state.project.files.list[idx] = {
      ...file,
      ...data
    };
  };

  const removeFiles = (filesIdx) => {
    if (!state.project) { return; }
    state.project.files.list = state.project.files.list.filter(
      (file) => !filesIdx.includes(state.project.files.list.indexOf(file))
    );
  };

  return {
    ...toRefs(state),
    setProject,
    fetchProject,
    saveProject,
    deleteProject,
    updateProject,
    addCollaborator,
    updateCollaborator,
    removeCollaborators,
    addAnnotation,
    updateAnnotation,
    removeAnnotations,
    addFile,
    updateFile,
    removeFiles
  };
}
