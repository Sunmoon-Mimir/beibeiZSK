import request from "../util/request";
import { QaModel, TablePageModel } from "./apimodel";

/**
 * 项目大类接口
 * @returns
 */
export function getProjectType() {
  return request({
    url: "/Workbench/firstproject",
    method: "get",
  });
}

/**
 * 工作台列表
 * @param query
 * @returns
 */
export function getWorkbenchTable(query: TablePageModel) {
  return request({
    url: "/Workbench/qa",
    method: "get",
    params: query,
  });
}

/**
 * 获取问答ById
 * @param id
 * @returns
 */
export function getQaById(id: number) {
  return request({
    url: `/Workbench/qaByid?id=${id}`,
    method: "get",
  });
}

export function getQaByIdRe(id: number,isResubmit: boolean) {
  return request({
    url: `/Workbench/qaByid?id=${id}&isResubmit=${isResubmit}`,
    method: "get",
  });
}

/**
 * 获取问答列表接口
 * @returns
 */
export function getUserList() {
  return request({
    url: "/Permission/users",
    method: "get",
  });
}

/**
 * 获取当前角色权限接口
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
 * 添加model
 * @param model
 * @returns
 */
export function addQa(model: QaModel) {
  return request({
    url: "/Workbench/qa",
    method: "post",
    data: model,
  });
}

/**
 * 编辑model
 * @param model
 * @returns
 */
 export function updateQa(model: QaModel) {
  return request({
    url: "/Workbench/qa",
    method: "put",
    data: model,
  });
}

/**
 * 删除model
 * @param model
 * @returns
 */
 export function deleteQa(data: string) {
  return request({
    url: `/Workbench/qa?id=${data}`,
    method: "delete",
  });
}

/**
 * 获取角色列表
 * @returns
 */
 export function getQAhistory(id: number) {
  return request({
    url: `/Workbench/qahistory?id=${id}`,
    method: "get",
  });
}