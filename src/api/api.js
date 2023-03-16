import axios from "axios";


const BASE_URL = process.env.NODE_ENV == 'development' ? 
process.env.IP_ADDRESS : 
process.env.BACKEND_URL;



export default api = axios.create({
    baseURL: BASE_URL,
    
});

/* export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
}) */
