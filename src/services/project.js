import { get } from "lodash";

export default class ProjectService {
  baseURL = "";

  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  #transformProjectFiles(project) {
    if (get(project, "files.list") != null) {
      return {
        ...project,
        files: {
          ...project.files,
          list: project.files.list.map((file) => {
            if (typeof file === "string") {
              const splitAt = file.lastIndexOf("/");
              return {
                source: file,
                name: splitAt > 0 ? file.substring(splitAt + 1) : "",
              };
            }
            return file;
          }),
        },
      };
    }
    return project;
  }

  async fetch(id) {
    return this.#transformProjectFiles(
      await (await fetch(`${this.baseURL}/project/json/${id}`)).json()
    );
  }

  async save(data) {}

  async delete(id) {}
};