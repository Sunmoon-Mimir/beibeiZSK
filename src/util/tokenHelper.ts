import { userPayload } from "../api/apimodel";
import jwtDecode from "jwt-decode";
import request from "./request";
const Token = "token";

/**
 * 保存token
 * @param token
 */
export function setToken(token: string): void {
  sessionStorage.setItem(Token, token);
}

/**
 * 获取token
 * @returns
 */
export function getToken(): string {
  return sessionStorage.getItem(Token) || "";
}

/**
 *
 * @param tokenStr 校验token
 * @returns
 */
export function checkToken(tokenStr: string): any {
  return request({
    url: "/OAuth/token",
    method: "get",
    params: { token: tokenStr },
  });
}

/**
 * 获取用户信息
 * @returns
 */
export function getUserInfo(): userPayload | null {
  const token = getToken();
  if (token != "") {
    const user: userPayload = jwtDecode(token);
    return user;
  } else {
    return null;
  }
}

/**
 * 获取当前用户权限列表
 * @returns
 */
export function getPermissionList():any{
    return request({
        url:"/Permission/permissions",
        method:"get"
    })
}