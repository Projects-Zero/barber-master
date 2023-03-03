import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../screens/DrawerContent";
import AppRoutes from "./stack.routes";
import Services from "../screens/Services";

const Drawer = createDrawerNavigator();

function DrawerRoutes() {
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false
      }}
    >
      <Drawer.Screen name="HomeScreen" component={AppRoutes} />
    </Drawer.Navigator>
  );
}

export default DrawerRoutes;
