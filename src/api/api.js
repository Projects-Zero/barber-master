import axios from "axios";
import { IP_ADDRESS, BACKEND_URL } from "@env"


const BASE_URL = process.env.NODE_ENV == 'development' ? IP_ADDRESS : BACKEND_URL;



export default api = axios.create({
    baseURL: BASE_URL,
    
});

/* export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
}) */
