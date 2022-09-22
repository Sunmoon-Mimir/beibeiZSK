import request from "../util/request";
import { setUSRole, UserPageModel } from "./apimodel";

/**
 * 获取所有用户接口
 * @returns
 */
 export function getUserList(query: UserPageModel) {
    return request({
      url: "/Permission/users",
      method: "get",
      params: query,
    });
  }

  /**
   * 获取当前角色/用户权限接口
   * @returns
   */
   export function getUserPermission() {
    return request({
      url: "/Permission/permissions",
      method: "get",
    });
  }

  /**
   * 获取角色列表
   * @returns
   */
   export function getUserRoles() {
    return request({
      url: "/Permission/roles",
      method: "get",
    });
  }


  /**
 * 设置用户角色
 * @returns
 */
 export function setUserRole(data: setUSRole) {
    return request({
      url: "/Permission/userrole",
      method: "post",
      data:data
    });
  }

  /**
   * 删除用户
   * @returns
   */
   export function delUser(data: string) {
    return request({
      url: `/Permission/user?email=${data}`,
      method: "delete",
    });
  }