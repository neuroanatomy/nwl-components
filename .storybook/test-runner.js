const { getStoryContext } = require('@storybook/test-runner');

// Real mouse clicks, which a play function can't make (its events are synthetic, so the browser
// treats the focus they give as keyboard focus). A story lists the elements to click in
// `parameters.mouseFocus` (CSS selectors); each must then be focused, not :focus-visible, and
// show no outline. Used by `Library/Base` MouseFocus.
module.exports = {
  async postVisit (page, context) {
    // only the Library/Base stories: other stories' contexts can't all be serialised
    if (!context.id.startsWith('library-base--')) { return; }
    const { parameters } = await getStoryContext(page, context);
    for (const selector of parameters.mouseFocus || []) {
      await page.click(selector);
      const state = await page.evaluate((s) => {
        const el = document.querySelector(s);

        return {
          focused: document.activeElement === el,
          focusVisible: el.matches(':focus-visible'),
          outline: getComputedStyle(el).outlineStyle
        };
      }, selector);
      const expected = { focused: true, focusVisible: false, outline: 'none' };
      if (JSON.stringify(state) !== JSON.stringify(expected)) {
        throw new Error(`mouse focus on ${selector}: ${JSON.stringify(state)}, expected ${JSON.stringify(expected)}`);
      }
    }
  }
};
