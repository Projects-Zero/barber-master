import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  FlatList

} from 'react-native';
import Categories from '../components/categories.component';
import Header from '../components/header.component';
import { CATEGORIES } from '../constants/categories';
import { COLORS, FONTS } from '../constants/theme';
import AuthContext from '../context/AuthProvider';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const bg = require('../assets/bg.png');

  const { width, height } = useWindowDimensions();

  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
       let values = await AsyncStorage.multiGet(['@user', '@photo'])
        let user = values[0][1];
        let photo = values[1][1];

        console.log(`User: ${user}`);
        console.log(`Photo: ${photo}`); 

      if (values !== null) {
        setPhoto(photo)
        setUsername(user);
      }
     } catch (error) {
      console.log(error)
     }

    }
    getUser();
  }, [])

  const renderItem = ({ item }) => {
    const { name, image, navigate } = item;


    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(navigate, {username})}
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
    <ImageBackground resizeMode='cover' source={bg} style={[styles.background,]}>

      <View style={[styles.container]} >
        <View style={{ justifyContent: 'center', alignItems: 'center', width }}>
          <ImageBackground resizeMode='cover' source={require('../assets/images/header.png')} style={[styles.header,]}>
            <Text style={styles.title} >Barbearia Mestre Bigode</Text>

            <View style={styles.profileImgWrapper}>

              <Image style={{ width: '100%', height: '100%' }} source={photo ? { uri: photo } : require('../assets/images/avatar.png')} />
            </View>
          </ImageBackground>
          <View style={[{ width: '100%', }]}>
            <Text style={styles.name} >Olá {username}!</Text>
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
    </ImageBackground>

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
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center'


  },
  profileImgWrapper: {
    backgroundColor: '#FFF',
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
  background: {
    width: '100%',
  },
  name: {
    color: '#fff',
    fontFamily: FONTS.medium,
    fontSize: 20,
    textAlign: 'center'
  },
});

export default Home;