import axios from "axios";
import { BASE_URL } from "../../constants";

export const apiGetProblems = (data?: any) => axios.get(`${BASE_URL}/problem/list`, { params: { ...data } });
export const apiGetProblemDetail = (uuid: string) => axios.get(`${BASE_URL}/problem/${uuid}`);

/** 记录闪卡复习结果：记住了(known) 或 没记住(unknown) */
export const apiRecordReview = (problemUuid: string, remembered: boolean) =>
    axios.post(`${BASE_URL}/review/record`, { problemUuid, remembered });

/** 获取当前用户所有题目的复习状态 */
export const apiGetReviewStatus = () => axios.get(`${BASE_URL}/review/status`);

/** 获取当前用户对所有题目的收藏状态，返回 { [problemUuid]: boolean } */
export const apiGetFavoriteStatus = () => axios.get(`${BASE_URL}/favorite/status`);

/** 更新当前题目的收藏状态 */
export const apiToggleFavorite = (problemUuid: string, favorite: boolean) =>
    axios.post(`${BASE_URL}/favorite/toggle`, { problemUuid, favorite });