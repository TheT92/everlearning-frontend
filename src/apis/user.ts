import axios from "axios";
import { BASE_URL } from "../../constants";

export const apiUserLogin = (data: any) => axios.post(`${BASE_URL}/login`, { ...data });
export const apiUserLogout = () => axios.post(`${BASE_URL}/logout`);
export const apiUserSignup = (data: any) => axios.post(`${BASE_URL}/signup`, { ...data });

/** 获取当前用户资料 */
export const apiGetUserProfile = () => axios.get(`${BASE_URL}/users/me`);

/** 更新当前用户资料 */
export const apiUpdateProfile = (username: string) =>
    axios.put(`${BASE_URL}/users/me`, { username });

/** 获取当前用户学习统计 */
export const apiGetUserStats = () => axios.get(`${BASE_URL}/user/stats`);

/** 获取当前用户收藏的题目列表 */
export const apiGetFavoriteProblems = (page: number, pageSize: number) =>
    axios.get(`${BASE_URL}/user/favorites`, { params: { page, pageSize } });

/** 添加收藏 */
export const apiAddFavorite = (problemUuid: string) =>
    axios.post(`${BASE_URL}/user/favorites`, { problemUuid });

/** 取消收藏 */
export const apiRemoveFavorite = (problemUuid: string) =>
    axios.delete(`${BASE_URL}/user/favorites/${problemUuid}`);

/** 获取最近复习活动 */
export const apiGetUserActivities = (limit = 10) =>
    axios.get(`${BASE_URL}/user/activities`, { params: { limit } });