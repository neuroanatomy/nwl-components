import TwoCols from "@/components/layout/TwoCols.vue";
import Wrapper from "@/components/layout/Wrapper.vue";

export default {
  title: "Layout/Two cols",
  component: TwoCols,
};

const Template = (args) => ({
  components: { TwoCols, Wrapper },
  setup() {
    return {
      ...args,
    };
  },
  template: `
  <Wrapper>
    <main>
      <TwoCols>
        <template v-slot:side>Side info</template>
        <template v-slot:content>Content (as seen on the settings and user pages)</template>
      </TwoCols>
    </main>
  </Wrapper>
  `,
});

export const Default = Template.bind({});