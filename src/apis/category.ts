import axios from "axios";
import { BASE_URL } from "../../constants";

export const apiGetCategories = (data?: any) => axios.get(`${BASE_URL}/category/list`, { ...data });