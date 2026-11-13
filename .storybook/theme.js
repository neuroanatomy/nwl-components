// The theme of the preview: today's look, or the 2027 theme (nwl-components 2.4.0), which a page
// opts in to with `<html data-nwl-theme="2027">` and a <link> to nwl-components/fonts.css.
// Used by the toolbar switch (preview.js) and by the `Styles/Theme 2027` stories.
//
// fonts.css is linked by a relative URL, next to iframe.html: the library's Vite config emits it
// (and fonts/) into storybook-static/ and serves it in `storybook dev` (scripts/fonts.js), so it
// also works under the GitHub Pages sub-path (/nwl-components/).
const LINK_ID = 'nwl-theme-fonts';
let fontsLoaded = Promise.resolve();

// link fonts.css once; resolves when the stylesheet is loaded
export const loadFonts = () => {
  if (!document.getElementById(LINK_ID)) {
    const link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    link.href = 'fonts.css';
    fontsLoaded = new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = () => reject(new Error('fonts.css did not load'));
    });
    document.head.appendChild(link);
  }

  return fontsLoaded;
};

// 'today' (no attribute, no fonts.css: the page as before 2.4.0) or '2027' (a number when the
// URL sets it: `&globals=theme:2027`)
export const setTheme = (theme) => {
  const html = document.documentElement;
  if (String(theme) === '2027') {
    html.setAttribute('data-nwl-theme', '2027');

    return loadFonts();
  }
  html.removeAttribute('data-nwl-theme');
  const link = document.getElementById(LINK_ID);
  if (link) { link.remove(); }

  return Promise.resolve();
};
