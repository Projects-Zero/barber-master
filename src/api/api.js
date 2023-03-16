import axios from "axios";
import { REACT_APP_IP_ADDRESS, REACT_APP_PRODUCTION_URL } from "@env"

const BASE_URL = process.env.NODE_ENV == 'development' ? REACT_APP_IP_ADDRESS : REACT_APP_PRODUCTION_URL;



export default api = axios.create({
    baseURL: BASE_URL,
    
});

/* export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
}) */
