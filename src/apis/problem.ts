import axios from "axios";
import { BASE_URL } from "../../constants";

export const apiGetProblems = (data?: any) => axios.get(`${BASE_URL}/problem/list`, { params: { ...data } });
export const apiGetProblemDetail = (uuid: string) => axios.get(`${BASE_URL}/problem/${uuid}`);