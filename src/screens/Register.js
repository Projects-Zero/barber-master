import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, Alert } from 'react-native'
import { Button, TextInput, Paragraph, Dialog, Portal } from 'react-native-paper';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import * as yup from 'yup';

import api from '../api/api';
import useAuth from '../hooks/useAuth';
import { COLORS, FONTS } from '../constants/theme';

const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';


const Register = ({ navigation }) => {
    const background = require('../assets/images/login.png');
    const emailRef = useRef();
    const userRef = useRef();
    const errRef = useRef();

    const [loading, setLoading] = useState(false)

/*     const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
 */    const [errMsg, setErrMsg] = useState('');
    const [visible, setVisible] = useState(false);

    const validations = yup.object().shape({
        user: yup.string().matches(USER_REGEX, 'Usuário não atende aos requisitos.').required('Usuário é obrigatório'),
        email: yup.string().email('Email inválido').required('Email é obrigatório.'),
        pwd: yup.string().matches(PWD_REGEX, 'Senha muito fraca. Dica: Combine letras maiúsculas, minúsculas, números e símbolos.').required('Senha é obrigatório.'),
        confirm_pwd: yup
            .string()
            .oneOf([yup.ref('pwd')], "Senhas não coincidem!")
            .required('Senha é obrigatório.')
    });
    const hideDialog = () => setVisible(true);

    /*  useEffect(() => {
         emailRef.current.focus();
     }, []) 

    /*  useEffect((props) => {
         setErrMsg('')
     }, [user, pwd]) */





    return (
        <ImageBackground resizeMode='cover' source={background}
            style={[styles.background,]}>
            <Text ref={errRef} style={errMsg ? styles.errMsg : styles.offscreen} >{errMsg}</Text>

            <View >
                <Text style={{ textAlign: 'center', fontSize: 40, fontFamily: FONTS.bold, color: '#fff' }}>Seja um Mestre Bigode!</Text>
            </View>


            <Formik
                initialValues={{
                    user: '',
                    email: '',
                    pwd: '',
                    confirm_pwd: ''
                }}
                onSubmit={(credentials, formikActions) => {
                    setLoading(true);
                    setTimeout(() => {
                        api.post(REGISTER_URL,
                            credentials,
                            {
                                headers: { 'Content-Type': 'application/json', },
                                withCredentials: true
                            }
                        ).then(() => {
                            Alert.alert(
                                "Sucesso",
                                "Usuário Cadastrado!",
                                [

                                    { text: "LOGAR", onPress: () => navigation.navigate('Login') }
                                ], { cancelable: false }
                            );

                            setErrMsg('');
                            formikActions.setSubmitting(false);
                            formikActions.resetForm();

                        }
                        ).catch(err => {
                            console.log(`Error: ${err}`);
                            if (!err?.response) {
                                setErrMsg('Erro no servidor.')
                            } else if (err.response?.status === 409) {
                                setErrMsg('Email já cadastrado.')
                            } else {
                                setErrMsg('Erro ao tentar fazer Login.');
                            }
                            // errRef.current.focus();
                        })
                            .finally(() => setLoading(false));
                    }, 500);
                }}

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
                            label={"Senha"}
                            secureTextEntry={true}
                            autoComplete="off"
                            value={props.values.pwd}
                            onChangeText={props.handleChange('pwd')}
                        />
                        {props.touched.pwd && props.errors.pwd ? (
                            <Text style={styles.errMsg} >{props.errors.pwd}</Text>
                        ) : null}

                        <TextInput style={styles.input}
                            label={"Confirmar Senha"}
                            secureTextEntry={true}
                            autoComplete="off"
                            value={props.values.confirm_pwd}
                            onChangeText={props.handleChange('confirm_pwd')}
                        />
                        {props.touched.confirm_pwd && props.errors.confirm_pwd ? (
                            <Text style={styles.errMsg} >{props.errors.confirm_pwd}</Text>
                        ) : null}

                        <Button
                            style={styles.button}
                            mode='contained'

                            onPress={props.handleSubmit}>
                            {loading ? <ActivityIndicator size={18} color={'white'} /> : 'Cadastrar'}
                        </Button>
                        <Text style={styles.text}>Já é nosso Cliente?
                            <Text onPress={() => navigation.navigate('Login')} style={{ textDecorationLine: 'underline' }} > Faça Login!</Text>
                        </Text>
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

    },
    input: {
        width: '100%',
        marginTop: 10,
    },
    errMsg: {
        width: '100%',

        backgroundColor: 'lightpink',
        color: 'firebrick',
        fontWeight: 'bold',
        padding: 5,
        marginBottom: 10
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
    },
    text: {
        marginTop: 10,
        color: '#fff',
        fontSize: 18,
        fontFamily: FONTS.medium,
        textAlign: 'center'
    }
});

export default Register;