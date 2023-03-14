import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import DrawerRoutes from './drawer.routes';

function Routes() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const getLanguage = async () => {
            let language = await AsyncStorage.getItem('@appLanguage');
            i18n.changeLanguage(language || 'pt');
        }
        getLanguage();
    }, []);

    return (
        <NavigationContainer>
            <DrawerRoutes />
        </NavigationContainer>
    )
}

export default Routes;