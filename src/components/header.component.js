import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, useWindowDimensions } from 'react-native';
import { FONTS } from '../constants/theme';

const Header = () => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', width }}>
            <ImageBackground resizeMode='cover' source={require('../assets/images/header.png')} style={[styles.header,]}>
                <View style={styles.profileImgWrapper}>
                    <Image style={{ width: '100%', height: '100%' }} source={{ uri: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60' }} />
                </View>
            </ImageBackground>
            <View style={[{ width: '100%', }]}>
                <Text style={styles.name} >Barbearia Barber Style</Text>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 40,
        alignItems: 'center',


    },
    profileImgWrapper: {
        position: 'absolute',
        bottom: -30,

        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        overflow: 'hidden',
    },
    name: {
        color: '#fff',
        fontFamily: FONTS.medium,
        fontSize: 20,
        textAlign: 'center'
    },
})

export default Header;