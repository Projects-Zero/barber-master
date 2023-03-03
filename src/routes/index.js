import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import DrawerRoutes from './drawer.routes';

function Routes() {
    return (
        <NavigationContainer>
            <DrawerRoutes />
        </NavigationContainer>
    )
}

export default Routes;