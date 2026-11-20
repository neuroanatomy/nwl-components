// nwl-components/embed: the apps' embeddable viewer, without Vue. The sizing arithmetic of the
// embed page (desiredEmbedHeight, positiveIntParam) and the builder of the /embed.js loader
// (embedScript). Built by vite.embed.config.js into dist/embed/.
export { desiredEmbedHeight, positiveIntParam } from './sizing.js';
export { embedScript } from './script.js';
