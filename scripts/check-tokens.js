// Fails when a hex colour appears in src/**/*.{vue,css} outside src/styles/tokens.css (the
// library's CSS reads colours from the design tokens, var(--nwl-…)), or when one of those files
// uses a --nwl- token that tokens.css doesn't define. Run by `npm run lint`.
const fs = require('fs/promises');
const path = require('path');

const src = path.resolve(__dirname, '../src');
const allowed = path.join(src, 'styles/tokens.css');
// #rgb, #rgba, #rrggbb, #rrggbbaa, not followed by another word character
const hex = new RegExp('#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\\w-])', 'giu');

const files = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const lists = await Promise.all(entries.map((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { return files(file); }

    return (/\.(?:vue|css)$/u).test(entry.name) ? [file] : [];
  }));

  return lists.flat();
};

const used = new RegExp('var\\(\\s*(--nwl-[\\w-]+)', 'gu');

const problemsIn = (defined) => async (file) => (await fs.readFile(file, 'utf8')).split('\n')
  .flatMap((line, i) => {
    const where = `${path.relative(process.cwd(), file)}:${i + 1}`;
    const colours = line.match(hex) || [];
    const unknown = [...line.matchAll(used)].map((m) => m[1])
      .filter((name) => !defined.has(name));

    return [
      ...colours.map((colour) => `${where}: hex colour ${colour}`),
      ...unknown.map((name) => `${where}: ${name} is not defined in src/styles/tokens.css`)
    ];
  });

const main = async () => {
  const tokens = await fs.readFile(allowed, 'utf8');
  const defined = new Set([...tokens.matchAll(new RegExp('(--nwl-[\\w-]+)\\s*:', 'gu'))].map((m) => m[1]));
  const checked = (await files(src)).filter((file) => file !== allowed);
  const problems = (await Promise.all(checked.map(problemsIn(defined)))).flat();
  if (problems.length > 0) {
    console.error('Use the design tokens of src/styles/tokens.css (var(--nwl-…)):');
    problems.forEach((p) => console.error('  ' + p));
    process.exitCode = 1;
  }
};

main();
