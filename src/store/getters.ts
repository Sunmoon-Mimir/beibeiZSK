const getters = {
    userName: (state: any): string => state.user.userName,
    userEmail: (state: any): string => state.user.userEmail,
    permissionList: (state: any): Array<string> => state.user.permissionList,
  };

  export default getters;