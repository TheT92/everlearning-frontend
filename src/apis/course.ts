import axios from "axios";
import { BASE_URL } from "../../constants";

export const apiAddCourse = (data: any) => axios.post(`${BASE_URL}/course/add`, { ...data });
export const apiGetCourses = (data?: any) => axios.get(`${BASE_URL}/course/list`, { params: { ...data } });
export const apiGetCourseDetail = (uuid: string) => axios.get(`${BASE_URL}/course/${uuid}`);