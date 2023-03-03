import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import { COLORS, FONTS } from '../constants/theme';
import { AntDesign, Entypo, MaterialIcons, } from '@expo/vector-icons';

import api from '../api/api';


moment.locale('pt-br');


function Bookings() {
    const isMounted = useRef();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        isMounted.current = true;

        const getBookings = async () => {
            const token = await AsyncStorage.getItem("@token");
            const userId = await AsyncStorage.getItem("@id");

            await api.get(`/bookings/booking-service/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

            }).then(response => {
                setBookings(response.data)
            }).catch((err) => {
                console.log(err)
            }).finally(() => setIsLoading(false))


        };

        getBookings();
        return () =>
            (isMounted.current = false)


    }, []);



    const LoadingBar = () => {
        return (
            <View>
                <ActivityIndicator size="small" color="#fff" />
            </View>
        );
    };
    const capitalize = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    const renderItem = ({ item }) => {

        const getFormattedDate = (value) => {
            return moment(value).format('DD/MM/YYYY')
        }

        const { date, time, status, username, photo } = item;


        return (
            <View style={styles.card}>
                <View style={{ width: '100%' }} >

                    <Text style={[styles.title ]}>Serviço: {item.service[0].name}</Text>
                    <View style={styles.wrapper}>
                        <Image style={styles.image} source={{ uri: item.service[0].picture }} resizeMode='cover' />
                    </View>
                </View>

                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                {/* <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: photo }} resizeMode='cover' />

                    <Text style={styles.text}>Cliente: {username}</Text> */}
                  <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: item.employee[0].picture }} resizeMode='cover' />
                    <Text style={styles.text}>Profissional: {item.employee[0].firstname}</Text> 
                </View>
                {/* <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                 <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: photo }} resizeMode='cover' />

                    <Text style={styles.text}>Cliente: {username}</Text> 
                </View> */}

                <Text style={[styles.text, { color: COLORS.tangerine, fontSize: 20 }]}>Valor: R$ {item.service[0].price}</Text>

                <View style={styles.info} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Entypo name='calendar' size={20} color={COLORS.success} />
                        <Text style={styles.text}> {getFormattedDate(date)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name='clockcircle' size={20} color={COLORS.success} />
                        <Text style={styles.text}>{time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Entypo name='dot-single' size={25} color={status === 'cancelado' ? COLORS.tangerine : COLORS.success} />
                        <Text style={styles.text}>{status}</Text>
                    </View>


                </View>
                <Button onPress={() => console.log('Cancelado!')} style={styles.button} mode='contained' >Cancelar</Button>
            </View>
        )
    }



    return (
        <View style={{
            flex: 1,
            backgroundColor: COLORS.black,
        }} >
            {
                isLoading ?
                    (<LoadingBar />)
                    : !bookings.length ?
                        (<View style={styles.empty}>
                            <Text style={styles.text}>Nenhum serviço agendado.</Text>
                        </View>)
                        :
                        <FlatList
                            keyExtractor={(item) => item._id}
                            data={bookings}
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
    )
}

const styles = StyleSheet.create({


    card: {
        padding: 16,
        marginTop: 30,
        width: '100%',
        alignItems: 'flex-start',
        backgroundColor: COLORS.background
    },

    info: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 20

    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: 20,
        color: COLORS.tangerine,
        marginVertical: 10,
        textAlign: 'center'

    },
    text: {
        fontFamily: FONTS.bold,
        fontSize: 16,
        color: COLORS.white,
        marginHorizontal: 5,
        marginVertical: 15




    },
    wrapper: {
        width: 200,
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center'

    },
    image: {
        width: '100%',
        height: '100%',
    },
    status: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.success,
        borderRadius: 25,
    },
    button: {
        borderRadius: 9,
        backgroundColor: COLORS.cancel,
        fontWeight: 'bold',
        alignSelf: 'flex-end',
        marginTop: 20
    },
    empty: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center'
    }


})

export default Bookings;