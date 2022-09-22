import request from "../util/request";
import { approveList, rejectList} from "./apimodel";



/**
 * 获取审批列表
 * @param query
 * @returns
 */
  export function getapproveList(query: approveList) {
    return request({
      url: "/Approve/approveqa",
      method: "get",
      params: query,
    });
  }


 /**
 * 通过问答ById
 * @param id
 * @returns
 */
export function getApproveId(data: rejectList) {
  return request({
    url: `/Approve/qa`,
    method: "put",
    data:data
  });
}

 /**
 * 驳回问答ById
 * @param id
 * @returns
 */
  export function rejectQA(data: rejectList) {
    return request({
      url: `/Approve/rejectqa`,
      method: "put",
      data:data
    });
  }

  /**
 * 撤回问答
 * @param id
 * @returns
 */
 export function withdraw(data: number) {
  return request({
    url: `/Approve?id=${data}`,
    method: "delete",
  });
}