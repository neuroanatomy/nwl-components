import map from './README.md?raw';

// The icons and their map (src/icons/README.md), for the Icons stories.

// every file in src/icons/ (copied to dist/icons/), by name
export const icons = Object.entries(import.meta.glob('./*.svg', { eager: true, import: 'default' }))
  .map(([file, src]) => ({ name: file.slice(2, -4), src }))
  .sort((a, b) => a.name.localeCompare(b.name));

const cells = (line) => line.split('|').slice(1, -1)
  .map((cell) => cell.trim());

// "BrainBox `view/x/floppy.svg` (other name); microdraw `app/y.svg`" -> the files' names without
// folder or extension: ['floppy', 'y']
const fileNames = (replaces) => [...replaces.matchAll(/`([^`]+)`/g)]
  .map((m) => m[1].split('/').pop()
    .replace(/\.svg$/, ''));

// the map's rows: lines that start with "| `name` |"; columns Name, Meaning, Source, Replaces
export const rows = map.split('\n')
  .filter((line) => (/^\| `[^`]+` \|/).test(line))
  .map((line) => {
    const [name, meaning, source, replaces] = cells(line);

    return {
      name: name.replace(/`/g, ''),
      meaning,
      source: source.replace(/`/g, ''),
      replaces: replaces === '-' ? [] : replaces.split(';').map((r) => r.replace(/`/g, '').trim()),
      replacedNames: fileNames(replaces)
    };
  });
