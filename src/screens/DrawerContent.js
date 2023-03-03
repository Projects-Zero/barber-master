import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    TouchableHighlight,
    Linking,
    Platform,
    Image,
} from 'react-native';
import { Avatar, Title, Drawer, Caption } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
    Feather,
    AntDesign,
    Entypo,
    MaterialCommunityIcons,
    MaterialIcons,
    EvilIcons,
    Ionicons,
} from "@expo/vector-icons";
import api from '../api/api';
import useLogout from '../hooks/useLogout';
import AsyncStorage from '@react-native-async-storage/async-storage';



function DrawerContent({ otherProps, navigation }) {
    const [photo, setPhoto] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const getUser = async () => {
            try {
                let values = await AsyncStorage.multiGet(['@photo', '@email'])
                let photo = values[0][1];
                let email = values[1][1];

                if (values !== null) {
                    setPhoto(photo)
                    setEmail(email);


                }
            } catch (error) {
                console.log(error)
            }

        }
        getUser();

        return () => {
            setPhoto(null);
            setEmail(null);
        }
    }, [])


    const logout = useLogout();
    const handleLogout = async () => {
        await logout();
        //let keys = ['@id', '@token', '@email', '@user', '@photo']
        // await AsyncStorage.multiRemove(keys);
        /*  console.log(`Clear:
         ${keys[0][1]}
         ${keys[1][1]}
         ${keys[2][1]}
         ${keys[3][1]}
         ${keys[4][1]}`) */

        navigation.navigate('Login');
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <DrawerContentScrollView {...otherProps}>
                    <View style={styles.drawerContent} >
                        <View style={styles.userInfoSection}>
                            <View style={{ flexDirection: "row", marginTop: 15 }}>
                                <Avatar.Image
                                    source={ photo ? { uri: photo } : require("../assets/images/avatar.png")}
                                    size={60}
                                />
                                <View style={{ marginLeft: 15, flexDirection: "column" }}>
                                    <Title style={styles.appTitle}>Mestre Bigode</Title>
                                    <Caption lineBreakMode='clip'  style={styles.caption}>{email}</Caption>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section title='Main' style={styles.drawerSection} >
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Entypo name="home" size={24} color="black" />
                            )}
                            label="Home"
                            onPress={() => {
                                navigation.navigate("Home", { ...otherProps });
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons name="cut" size={24} color="black" />
                            )}
                            label="Serviços"
                            onPress={() => {
                                navigation.navigate("Services");
                            }}
                        />


                    </Drawer.Section>
                    <Drawer.Section title='Profile' style={styles.bottomDrawerSection} >
                        <DrawerItem
                            icon={({ color, size }) => (
                                <MaterialIcons name="logout" size={24} color="black" />
                            )}
                            label="Logout"
                            onPress={handleLogout}
                        />
                    </Drawer.Section>

                </DrawerContentScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,

    },
    userInfoSection: {
        paddingLeft: 5,
    },

    caption: {
        fontSize: 13,
        lineHeight: 13,
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",

    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,

    },

    drawerSection: {
        marginTop: 15,

    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
})

export default DrawerContent;