import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Home from "../screens/Home";
import { COLORS, FONTS } from "../constants/theme";
import Products from "../screens/Products";
import Services from "../screens/Services";
import Barbers from "../screens/Barbers";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Bookings from "../screens/Bookings";
import Appointment from "../screens/Appointment";
import BarberProfile from "../screens/BarberProfile";


const StackRoutes = createStackNavigator();

const AppRoutes = ({ navigation }) => {
    return (
        <StackRoutes.Navigator
            screenOptions={{
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: FONTS.bold,
                    fontSize: 20
                },
                headerStyle: {
                    backgroundColor: COLORS.black,
                    height: 70,
                    elevation: 6,
                },
                headerRight: () => (
                    <Feather
                        style={styles.menu}
                        name="menu"
                        size={27}
                        color="white"
                        onPress={() => {
                            navigation.openDrawer();
                        }}
                    />
                ),
            }}
        >
            <StackRoutes.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                    title: "Login",
                }}
            />
            <StackRoutes.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false,
                    title: "Registrar",
                }}
            />
             <StackRoutes.Screen
                name="Home"
                component={Home}
                options={{
                    title: "Home",
                    headerLeft: null
                }}
            />
            <StackRoutes.Screen
                name="Products"
                component={Products}
                options={{
                    title: "Produtos",
                }}
            />
            <StackRoutes.Screen
                name="Services"
                component={Services}
                options={{
                    title: "Serviços",
                }}
            />
            <StackRoutes.Screen
                name="Bookings"
                component={Bookings}
                options={{
                    title: "Meus Agendamentos",
                }}
            />
            <StackRoutes.Screen
                name="Appointment"
                component={Appointment}
                options={{
                    title: "Agendar",
                }}
            />
            <StackRoutes.Screen
                name="Barbers"
                component={Barbers}
                options={{
                    title: "Profissionais",
                }}
            />
             <StackRoutes.Screen
                name="BarberProfile"
                component={BarberProfile}
                options={{
                    title: "Agendar",
                }}
            />

        </StackRoutes.Navigator>
    )
}
const styles = StyleSheet.create({
    drawer: {
        padding: 10,
    },
    menu: {
        padding: 10,
    },
})

export default AppRoutes;