import axios from "axios";


const BASE_URL = process.env.NODE_ENV == 'development' ? 
'http://192.168.100.66:3500' : 
'barber-master-backend.vercel.app';



export default api = axios.create({
    baseURL: BASE_URL,
    
});

/* export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
}) */
