import { reactive, inject } from "vue";

const usersFound = reactive([]);

export default function useUserSearch() {
    const {userSearchURL} = inject('config');
    const fetchUsers = async (q) => {
        usersFound.splice(0, usersFound.length);
        const users = await (await fetch(`${userSearchURL}${q}`)).json();
        usersFound.push(...users);
    }

    return {
        usersFound,
        fetchUsers,
    }
}