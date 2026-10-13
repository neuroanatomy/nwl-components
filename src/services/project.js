export default class ProjectService {

  constructor (baseURL) {
    this.baseURL = baseURL;
  }

  // eslint-disable-next-line class-methods-use-this
  transformProjectFiles (project) {
    if (!project) {
      return project;
    }
    // files.list may be missing (e.g. a project created by an older app version):
    // use an empty list, so that the settings page still renders
    const list = Array.isArray(project.files?.list) ? project.files.list : [];

    return {
      ...project,
      files: {
        ...project.files,
        list: list.map((file) => {
          if (typeof file === 'string') {
            const splitAt = file.lastIndexOf('/');

            return {
              source: file,
              name: splitAt > 0 ? file.substring(splitAt + 1) : ''
            };
          }

          return file;
        })
      }
    };
  }

  async fetch (id) {
    return this.transformProjectFiles(
      await (await fetch(`${this.baseURL}/project/json/${id}`)).json()
    );
  }

  async save (data) {
    const res = await fetch(`${this.baseURL}/project/json/${data.shortname}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data
      })
    });

    return res.json();
  }

  async delete (id) {
    const res = await fetch(`${this.baseURL}/project/json/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    return res.json();
  }
}
