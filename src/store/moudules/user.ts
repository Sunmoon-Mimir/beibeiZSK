import { userPayload } from "../../api/apimodel";
import { getPermissionList } from "../../util/tokenHelper";

const user = {
  state: {
    role: "",
    userName: "",
    userEmail: "",
    loginTime: "",
    isAdmin: "",
    permissionList: [],
  },
  mutations: {
    SET_USERNAME: (state: any, name: string): void => {
      state.userName = name;
    },
    SET_EMAIL: (state: any, name: string): void => {
      state.userEmail = name;
    },
    SET_ROLE: (state: any, name: string): void => {
      state.role = name;
    },
    SET_ISADMIN: (state: any, name: string): void => {
      state.isAdmin = name;
    },
    SET_LOGINTIME: (state: any, name: string): void => {
      state.loginTime = name;
    },
    SET_PERMISSIONS: (state: any, permissions: Array<string>): void => {
      state.permissionList = permissions;
    },
  },
  actions: {
    setUser(context: any, payload: userPayload) {
      context.commit("SET_USERNAME", payload.UserName);
      context.commit("SET_EMAIL", payload.UserEmail);
      context.commit("SET_ROLE", payload.Role);
      context.commit("SET_ISADMIN", payload.IsAdmin);
      context.commit("SET_LOGINTIME", payload.LoginTime);
    },

    async setPermissions(context: any): Promise<number> {
      context.commit("SET_PERMISSIONS", []);
      const res = await getPermissionList();
      if (res.code == 200) {
        sessionStorage.setItem("perm",res.data);
        context.commit("SET_PERMISSIONS", res.data);
        return 200;
      } else {
        return 500;
      }
    },
  },
};
export default user;
