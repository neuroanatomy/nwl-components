import UserPage from "@/components/pages/UserPage.vue";
import Tabs from "@/components/common/Tabs/Tabs.vue";
import Tab from "@/components/common/Tabs/Tab.vue";

export default {
  title: "Pages/User",
  component: UserPage,
};

const Template = (args) => ({
  components: { UserPage, Tabs, Tab },
  setup() {
    return {
      ...args,
    };
  },
  template: `
  <UserPage :user="user">
    <template v-slot:content>
        <Tabs>
            <Tab title="Projects">
                Some projects list
            </Tab>
            <Tab title="Some other tab">
                Some other list
            </Tab>
        </Tabs>
    </template>
  </UserPage>`,
});

export const Default = Template.bind({});
Default.args = {
  user: {
    _id: "61fbf78ee97e73dc0930e7f4",
    name: "Denis Hovart",
    url: "",
    brainboxURL: "/user/dhovart",
    avatarURL: "https://avatars.githubusercontent.com/u/764576?v=4",
    joined: "2022-02-03T15:41:02.286Z",
    nickname: "dhovart",
  },
};
