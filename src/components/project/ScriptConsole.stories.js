import ScriptConsole from '@/components/project/ScriptConsole.vue';

export default {
  title: 'Project/ScriptConsole',
  component: ScriptConsole
};

const Template = (args) => ({
  components: { ScriptConsole },
  setup () {
    return {
      ...args
    };
  },
  template: `
    <ScriptConsole />
  `
});

export const Default = Template.bind({});
