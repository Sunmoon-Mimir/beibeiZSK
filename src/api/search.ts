import requestSearch from "../util/requstSearch";
import { requstSearch } from "./apimodel";

/**
 * 搜索接口
 * @returns
 */
export function getTSearchList(data: requstSearch) {
  return requestSearch({
    url: "/get_max_similar",
    method: "post",
    data:data
  });
}

