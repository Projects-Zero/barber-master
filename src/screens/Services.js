import AsyncStorage from '@react-native-async-storage/async-storage';
import { isLoading } from 'expo-font';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import  api from '../api/api';
import { COLORS, FONTS } from '../constants/theme';

import { Button } from 'react-native-paper'
import { useTranslation } from 'react-i18next';

function Services({ navigation, route }) {
    const isMounted = useRef(false);

    const [services, setServices] = useState();
    const [loading, setIsLoading] = useState(false);
    const [accessToken, setAccessToken] = useState();
    const {username} = route.params;

    const { t } = useTranslation();

    useEffect(() => {
        isMounted.current = true;
        const getServices = async () => {
            setIsLoading(true);
            const aToken = await AsyncStorage.getItem("@token");

            await api.get('/services', {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${aToken}`
                }
            })
                .then((response) => {
                    setServices(response.data)
                })
                .catch((err) => {
                    console.log(err.message)
                })
                .finally(() => setIsLoading(false));
        }
        getServices();

        return () =>
            (isMounted.current = false);
    }, []);

    // translate data from api
    /* const translatedData = services.map(item =>{
        return {
            ...item,
            title: t(item.name),
            description: t(item.description),
            duration: t(item.duration),
            price: t(item.price),

        }
    }) */

    const renderItem = ({ item }) => {
        const { _id, name, description, picture, price, duration } = item;
        return (
            <View style={styles.services}>
                <View style={styles.imageWrapper} >
                    <Image style={{width: '100%', height: '100%'}} resizeMode='cover' source={{ uri: picture }} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.title} >{name}</Text>
                    <Text numberOfLines={2} lineBreakMode='middle'  style={styles.text} >{description}</Text>
                    <View style={styles.contentFooter}>
                            <Text style={styles.text}>{duration} min</Text>
                            <Text style={[styles.title, {color: COLORS.success}]}>R${price}</Text>
                    </View>
                <Button mode='contained' style={styles.button} onPress={() => {navigation.navigate('Appointment', {
                    _id,
                    name,
                    username,
                    description,
                    price,
                    duration
                })}} >Agendar</Button>
                </View>
            </View>
        )

    }
    const LoadingBar = () => {
        return (
            <View>
                <ActivityIndicator size="small" color="#fff" />
            </View>
        );
    };

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: COLORS.black }}>
            {
                loading ? (
                    <LoadingBar />
                )
                    :

                    <FlatList
                        style={{ flex: 1 }}
                        keyExtractor={(item) => item._id}
                        data={services}
                        renderItem={renderItem}
                        numColumns={1}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={21}
                        removeClippedSubviews={true}
                        updateCellsBatchingPeriod={100}
                        contentContainerStyle={{ flexGrow: 1 }}
                        bounces={false}
                    />

            }
        </View>
    );

}





const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    services: {
        flexDirection: 'row',
        marginTop: 20,
        height: 170,
        backgroundColor: COLORS.background
    },
    imageWrapper: {
        width: '40%',
        height: '100%'
    },
    content: {
        width: '60%',
        padding: 10,
    },
    title: {
        color: COLORS.tangerine,
        fontFamily: FONTS.medium,
        fontSize: 22,
    },
    text: {
        color: COLORS.greyText,
        fontFamily: FONTS.regular,
        fontSize: 16,
    },
    contentFooter: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        borderRadius: 9,
        backgroundColor: COLORS.success,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 10
    },


});

export default Services;