const { getStoryContext } = require('@storybook/test-runner');

// What a play function can't do, since its events are synthetic: real mouse clicks and hovers.
//
// - `parameters.mouseFocus` (CSS selectors): the test runner clicks each element with the real
//   mouse; it must then be focused, not :focus-visible, and show no outline (the browser takes a
//   play function's focus for keyboard focus). Used by `Library/Base` MouseFocus.
// - `parameters.hoverStyles` ([{ selector, styles }]): the test runner moves the real mouse over
//   each element (a play function's userEvent.hover doesn't make CSS :hover match), and its
//   computed styles must be `styles` ({ property: value }). Used by `Library/Look` and
//   `Library/Widgets`.
const checkMouseFocus = async (page, selectors) => {
  for (const selector of selectors) {
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
};

const checkHoverStyles = async (page, hovers) => {
  const problems = [];
  for (const { selector, styles } of hovers) {
    await page.hover(selector);
    const actual = await page.evaluate(([s, props]) => {
      const cs = getComputedStyle(document.querySelector(s));

      return Object.fromEntries(props.map((p) => [p, cs[p]]));
    }, [selector, Object.keys(styles)]);
    Object.entries(styles).filter(([p, v]) => actual[p] !== v)
      .forEach(([p, v]) => problems.push(`${selector} hovered: ${p} ${actual[p]} (expected ${v})`));
  }
  await page.mouse.move(0, 0);
  if (problems.length > 0) {
    throw new Error(problems.join('; '));
  }
};

// only these stories: other stories' contexts can't all be serialised
const withMouseChecks = ['library-base--', 'library-look--', 'library-widgets--'];

module.exports = {
  async postVisit (page, context) {
    if (!withMouseChecks.some((prefix) => context.id.startsWith(prefix))) { return; }
    const { parameters } = await getStoryContext(page, context);
    await checkMouseFocus(page, parameters.mouseFocus || []);
    await checkHoverStyles(page, parameters.hoverStyles || []);
  }
};
