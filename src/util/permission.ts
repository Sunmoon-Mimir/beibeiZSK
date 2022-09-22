import { getPermissionList } from "./tokenHelper";

/**
 *
 * @param permName 检查token
 * @returns
 */
export function checkPermission(permName: string): boolean {
  let result = false;
  const perm = sessionStorage.getItem("perm");
  if(perm=="[*]"){
      return true;
  }
  let permList = perm?.split(",");
  if (permList == undefined) {
    getPermissionList().then((res: any) => {
      permList = res.data;
    });
  }
  if (permList != undefined) {
    for (let item of permList) {
      if (item == permName) {
        result = true;
      }
    }
  } else {
    result = false;
  }
  return result;
}
