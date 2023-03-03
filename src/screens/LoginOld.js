import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, Image } from 'react-native'
import { Button, TextInput } from 'react-native-paper';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import * as yup from 'yup';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import useAuth from '../hooks/useAuth';
import { COLORS } from '../constants/theme';
const LOGIN_URL = '/auth';


const LoginOld = ({ navigation, props }) => {
    const background = require('../assets/images/login.png');

    const { auth, setAuth, persist, setPersist } = useAuth();

    const emailRef = useRef();
    const userRef = useRef();
    const errRef = useRef();

    const [loading, setLoading] = useState(false)

/*     const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
 */    const [errMsg, setErrMsg] = useState('');

    const validations = yup.object().shape({
        user: yup.string().required('Usuário é obrigatório'),
        email: yup.string().email('Email inválido').required('Email é obrigatório.'),
        pwd: yup.string().required('Senha é obrigatório.'),
    });

    /*  useEffect(() => {
         emailRef.current.focus();
     }, []) */

    /*  useEffect((props) => {
         setErrMsg('')
     }, [user, pwd]) */

    const handleLogin = (credentials) => {
        setLoading(true)
        setTimeout(() => {
            api.post(LOGIN_URL,
                credentials,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            ).then(response => {
                const result = response.data;
                const { status, message, data } = result;
                console.log(JSON.stringify(response?.data));
                const accessToken = response?.data?.accessToken;
                const roles = response?.data?.roles;

                /* DEBUG HERE, AUTH RETURNING UNDEFINED */
                setAuth({
                    credentials,
                    roles,
                    accessToken
                });
                console.log(`Credentials: ${JSON.stringify(credentials)}`)

                navigation.navigate('Home', {
                    user: credentials.user,
                    email: credentials.email

                });
            }).catch(err => {
                console.log(`Error: ${err}`);
                console.log(`Auth: ${auth}`);


                if (err.response?.status === 400) {
                    setErrMsg('Dados inválidos! Verifique email ou senha..')
                } else if (err.response?.status === 401) {
                    setErrMsg('Não Autorizado!');
                } else {
                    setErrMsg('Erro ao tentar Login.');
                }
                // errRef.current.focus();
            })
                .finally(() => setLoading(false))
        }, 500);
    }

    /* const togglePersist = () => {
        setPersist(prev => !prev);
    } */


    /* useEffect(() => {
        AsyncStorage.setItem("persist", persist)
    }, [persist]) */

    return (
        <ImageBackground resizeMode='cover' source={background}
            style={[styles.background,]}>
              
            <Text ref={errRef} style={errMsg ? styles.errMsg : styles.offscreen} >{errMsg}</Text>
            <View style={styles.imagewrapper}>
                <Image source={require('../assets/images/logo-new.png')} resizeMode='cover'  style={styles.logo}  />
               </View>

            <Formik
                initialValues={{
                    user: '',
                    email: '',
                    pwd: '',
                }}
                onSubmit={handleLogin}

                validationSchema={validations}
            >
                {props => (
                    <View style={styles.loginForm}>

                        <TextInput style={styles.input}
                            label={"Usuário"}
                            ref={userRef}
                            autoComplete="off"
                            value={props.values.user}
                            onChangeText={props.handleChange('user')}
                            autoCapitalize='none'


                        />
                        {props.touched.user && props.errors.user ? (
                            <Text style={styles.errMsg} >{props.errors.user}</Text>
                        ) : null}

                        <TextInput style={styles.input}
                            label={"Email"}
                            ref={emailRef}
                            autoComplete="off"
                            value={props.values.email}
                            onChangeText={props.handleChange('email')}
                            keyboardType="email-address"
                            autoCapitalize='none'


                        />
                        {props.touched.email && props.errors.email ? (
                            <Text style={styles.errMsg} >{props.errors.email}</Text>
                        ) : null}


                        <TextInput style={styles.input}
                            label={"Password"}
                            secureTextEntry={true}
                            autoComplete="off"
                            value={props.values.pwd}
                            onChangeText={props.handleChange('pwd')}
                        />
                        {props.touched.pwd && props.errors.pwd ? (
                            <Text style={styles.errMsg} >{props.errors.pwd}</Text>
                        ) : null}

                        <Button 
                         style={styles.button} 
                         mode='contained'
                         
                         onPress={props.handleSubmit}>
                            {loading ? <ActivityIndicator size={18} color={'white'} /> : 'Login'}
                            </Button>
                    </View>
                )}

            </Formik >


        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginForm: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        width: '90%',
        height: 200,

    },
    input: {
        width: '100%',
        marginTop: 20,
    },
    errMsg: {
        width: '100%',
        backgroundColor: 'lightpink',
        color: 'firebrick',
        fontWeight: 'bold',
        padding: 5,
        marginBottom: 30
    },
    offscreen: {
        width: '100%',
        position: 'absolute',
        left: -9999
    },
    button: {
        marginTop: 20,
        padding: 12,
        width: '100%',
        backgroundColor: COLORS.tangerine
    },
    imagewrapper: {
        width: 350,
        height: 350,
        marginBottom: 30,
    },
    logo: {
        width: '100%',
        height: '100%'
    }
});

export default LoginOld;