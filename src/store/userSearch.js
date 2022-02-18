import { reactive } from "vue";

const usersFound = reactive([]);

export default function useUserSearch() {
    const fetchUsers = async (q) => {
        usersFound.splice(0, usersFound.length);
        const users = await (await fetch(`https://brainbox.pasteur.fr/api/userNameQuery?q=${q}`)).json();
        usersFound.push(...users);
    }

    return {
        usersFound,
        fetchUsers,
    }
}