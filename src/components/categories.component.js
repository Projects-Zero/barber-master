import React from 'react';
import {
    useWindowDimensions,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image
} from 'react-native';
import { CATEGORIES } from '../constants/categories';
import { COLORS, FONTS } from '../constants/theme';

function Categories({ onNavigate, userProps }) {
    const { width, height } = useWindowDimensions();
    const renderItem = ({ item }) => {
        const { name, image, navigate } = item
        return (
            <TouchableOpacity
                onPress={() => onNavigate(navigate)}
                activeOpacity={0.8} style={[styles.cards]}>
                <ImageBackground
                    imageStyle={{ opacity: 0.9 }}
                    source={image}
                    resizeMode="cover"
                    style={styles.image}>
                    <Text lineBreakMode='middle' style={styles.catTitle}>{name}</Text>
                </ImageBackground>

            </TouchableOpacity>
        )
    }
    
    return (
        <View style={[styles.container]} >
             <View style={{ justifyContent: 'center', alignItems: 'center', width }}>
                <ImageBackground resizeMode='cover' source={require('../assets/images/header.png')} style={[styles.header,]}>
                <Text style={styles.title} >Barbearia Mestre Bigode</Text>

                    <View style={styles.profileImgWrapper}>
                        
                        <Image style={{ width: '100%', height: '100%' }} source={{ uri: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60' }} />
                    </View>
                </ImageBackground>
                <View style={[{ width: '100%', }]}>
                    <Text style={styles.name} >Olá, {userProps || 'Cliente'}!</Text>
                </View>
            </View>
            <FlatList
                key={(item) => item.id}
                numColumns={2}
                data={CATEGORIES}
                renderItem={renderItem}
                bounces={false}

            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },

    cards: {
        width: 170,
        height: 200,
        borderRadius: 6,
        overflow: 'hidden',
        margin: 10,

    },
    catTitle: {
        fontFamily: FONTS.medium,
        fontSize: 22,
        color: '#fff',
    },
    title: {
        color: '#fff',
        fontSize: 25,
        fontFamily: FONTS.bold,
        fontWeight: '600',
        textAlign: 'center'
    },
    wrapper: {
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',

        width: '100%',
        height: '100%',

    },
    overlay: {
        backgroundColor: COLORS.black,

    },

    //header
    header: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center'


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

export default Categories