import { action } from '@storybook/addon-actions';
import { expect, fn, waitFor } from '@storybook/test';
import { inject, onUnmounted, provide, reactive } from 'vue';

import PureAnnotations from '@/components/settings/PureAnnotations.vue';

export default {
  title: 'Settings/Annotations',
  component: PureAnnotations
};
const Template = (args) => ({
  components: { PureAnnotations },
  setup () {
    return {...args};
  },
  template:
    `<PureAnnotations :annotations="annotations"
                    @add-annotation="addAnnotation"
                    @remove-annotations="removeAnnotations"
                    @update-annotation="updateAnnotation" />`
});

export const Default = Template.bind({});
Default.args = {
  annotations: reactive([
    {
      'type': 'volume',
      'name': 'A volume annotation',
      'values': 'axolotl_labels.json',
      'display': true
    },
    {
      'type': 'text',
      'name': 'texte',
      'values': 'A text annotation',
      'display': true
    }
  ]),
  addAnnotation: action('add annotation'),
  removeAnnotations: action('remove annotations'),
  updateAnnotation: action('update annotation')
};

// A config without fetchLabelSets (3.5.0): the label sets come from /api/getLabelsets
const labelSetsFetch = fn();
const withoutFetchLabelSets = () => ({
  setup () {
    const config = { ...inject('config') };
    delete config.fetchLabelSets;
    provide('config', config);
    const originalFetch = window.fetch;
    labelSetsFetch.mockReset();
    labelSetsFetch.mockImplementation((url, options) => (url === '/api/getLabelsets'
      ? Promise.resolve(new Response(JSON.stringify([{ name: 'Fetched set', source: 'fetched.json' }])))
      : originalFetch(url, options)));
    window.fetch = labelSetsFetch;
    onUnmounted(() => { window.fetch = originalFetch; });
  },
  template: '<story/>'
});

export const DefaultFetchLabelSets = Template.bind({});
DefaultFetchLabelSets.args = {
  ...Default.args,
  annotations: reactive([{ type: 'volume', name: 'A volume annotation', values: 'fetched.json', display: true }])
};
DefaultFetchLabelSets.decorators = [withoutFetchLabelSets];
DefaultFetchLabelSets.play = async ({ canvasElement }) => {
  await waitFor(() => expect([...canvasElement.querySelectorAll('#annotations tbody tr td:nth-child(3) option')].map((o) => o.textContent.trim()))
    .toEqual(['Fetched set']));
  await expect(labelSetsFetch).toHaveBeenCalledTimes(1);
  await expect(labelSetsFetch.mock.calls[0][0]).toBe('/api/getLabelsets');
  await expect(canvasElement.querySelector('#annotations tbody tr td:nth-child(3) select').value).toBe('fetched.json');
};
