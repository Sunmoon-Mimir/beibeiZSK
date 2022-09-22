export interface requstSearch {
  text: string;
}

export interface setUSRole {
  userName: string;
  userEmail: string;
  roleId: number;
}



/**
 * 工作台表格分页Model
 */
export interface TablePageModel {
  category: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 问答表单Model
 */
export interface QaModel {
  Id?: number;
  Query: string;
  Answer: string;
  FirstProject: string;
  isResubmit?: boolean;
  updateUser?: string;
}

/**
 * 项目大类Model
 */
export interface CateModel {
  count: number;
  firstProject: string;
}

/**
 * 问答表格Model
 */
export interface QaTableModel {
  id: number;
  firstProject: string;
  first_project: string;
  query: string;
  answer: string;
  createUser: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: number;
  isShowText?:boolean;
  updateName: string;
}

/**
 * history Model
 */

export interface historyModel {
  query: string;
  answer: string;
  firstProject: string;
}

/**
 * VUEX相关
 */
export interface userPayload {
  Role: string;
  UserName: string;
  UserEmail: string;
  LoginTime: string;
  IsAdmin: string;
}

export interface approveList {
  submitType: number;
  firstProject: string;
  submitUser: string;
  status: number;
  pageNum: number;
  pageSize: number;
  orderType: string;
}

export interface rejectList {
  idList: Array<number>;
  rejectReason: string;
}


/**
 * 工作台表格分页Model
 */
 export interface UserPageModel {
  nameOrEmail: string;
  pageNum: number;
  pageSize: number;
}
