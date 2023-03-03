import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../api/api";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        let keys = ['@id', '@token', '@email', '@user', '@photo']

        setAuth({});
        try {
            await axios.get('/logout', {
                withCredentials: true
            })
        } catch (error) {
            console.error(error);            
        }
        await AsyncStorage.multiRemove(keys);
        console.log(`Clear:
         ${keys[0][1]}
         ${keys[1][1]}
         ${keys[2][1]}
         ${keys[3][1]}
         ${keys[4][1]}`)
    }

    return logout;
}


export default useLogout; // send to Home Component