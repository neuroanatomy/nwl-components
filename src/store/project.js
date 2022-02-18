import { inject, reactive, toRefs } from "vue";

const state = reactive({
    project: null,
    loading: true,
});

export default function useProject() {
    const baseURL = inject('baseURL');
     const fetchProject = async (id) => {
        state.loading = true;
        state.project = await (await fetch(`${baseURL}/project/json/${id}`)).json();
        state.loading = false;
    }

    const addCollaborator = () => {
      if (!state.project) return;
      state.project.collaborators.list.push({
        username: "",
        name: "",
        access: { collaborators: "none", annotations: "none", files: "none" },
      });
    }

    const updateCollaborator = (idx, data) => {
      if (!state.project) return;
      const collaborator = state.project.collaborators.list[idx];
      state.project.collaborators.list[idx] = {
        ...collaborator,
        ...data,
      };
    }

    const removeCollaborators = (collaboratorsIdx) => {
      if (!state.project) return;
      state.project.collaborators.list = state.project.collaborators.list.filter((collaborator) =>
        !collaboratorsIdx.includes(state.project.collaborators.list.indexOf(collaborator))
      );
    }

    const addAnnotation = () => {
      if (!state.project) return;
      state.project.annotations.list.push({
        type: "text",
        name: "",
        values: null,
        display: true,
      });
    }

    const updateAnnotation = (idx, data) => {
      if (!state.project) return;
      const annotation = state.project.annotations.list[idx];
      state.project.annotations.list[idx] = {
        ...annotation,
        ...data,
      };
    }

    const removeAnnotations = (annotationsIdx) => {
      if (!state.project) return;
      state.project.annotations.list = state.project.annotations.list.filter((annotation) =>
        !annotationsIdx.includes(state.project.annotations.list.indexOf(annotation))
      );
    }

    const addFile = () => {
      if (!state.project) return;
      state.project.files.list.push({
        source: "",
        name: "",
      });
    }

    const updateFile = (idx, data) => {
      if (!state.project) return;
      console.log('update', idx, data);
      const file = state.project.files.list[idx];
      state.project.files.list[idx] = {
        ...file,
        ...data,
      };
    }

    const removeFiles = (filesIdx) => {
      if (!state.project) return;
      state.project.files.list = state.project.files.list.filter((file) =>
        !filesIdx.includes(state.project.files.list.indexOf(file))
      );
    }

    return {
        ...toRefs(state),
        fetchProject,
        addCollaborator,
        updateCollaborator,
        removeCollaborators,
        addAnnotation,
        updateAnnotation,
        removeAnnotations,
        addFile,
        updateFile,
        removeFiles,
    }
}