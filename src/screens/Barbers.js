import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import api from '../api/api';
import { COLORS, FONTS } from '../constants/theme';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Barbers() {
    const isMounted = useRef(false);

    const [barbers, setBarbers] = useState();
    const [loading, setIsLoading] = useState(false);

    useEffect(() => {
        isMounted.current = true;
        const getBarbers = async () => {
            setIsLoading(true)
            const token = await AsyncStorage.getItem("@token")
            await api.get('/employees', {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    setBarbers(response.data)
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => setIsLoading(false));
        }
        getBarbers();

        return () =>
            (isMounted.current = false);
    }, []);

    const renderItem = ({ item }) => {
        const { firstname, lastname, picture } = item;
        return (
            <View style={styles.barbers}>
                <View style={styles.imageWrapper} >
                    <Image style={styles.image} resizeMode='cover' source={{ uri: picture }} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.title} >{firstname}</Text>
                    <Button  style={styles.button} icon="calendar" mode="contained" onPress={() => console.log('Pressed')}>
                       Agendar
                    </Button>
                </View>
            </View >
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
                        data={barbers}
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
    barbers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        height: 100,
        backgroundColor: COLORS.background
    },

    imageWrapper: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        overflow: 'hidden',

        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: '70%',
        padding: 10,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    },

    title: {
        color: COLORS.tangerine,
        fontFamily: FONTS.medium,
        fontSize: 18,
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
        width: 120,
        borderRadius: 16,
        backgroundColor: COLORS.success
    }


});


export default Barbers;