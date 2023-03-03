import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import api from '../api/api';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { Button, Modal, TextInput, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
// * formik
import { Formik } from 'formik';
import * as Yup from 'yup';

import moment from 'moment';
import 'moment/min/moment-with-locales';
import AuthContext from '../context/AuthProvider';

import { HOURS } from '../constants/hours';


moment.locale('pt-br');




function Appointment({ navigation, route }) {
    const { _id, name, username, price, duration } = route.params;
    const isMounted = useRef(false);

    const [barbers, setBarbers] = useState();
    const [bookings, setBookings] = useState(['']);

    const [loading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    // * barber props
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [picture, setPicture] = useState('');
    const [employeeId, setEmployeeId] = useState('');

    // * date values

    const [open, setOpen] = useState(false);

    const [date, setDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState('');
    const [hour, setHour] = useState('');
    const [barberId, setBarberId] = useState('');


    // * Retrieve userId frm storage
    const [userId, setUserId] = useState('');



    useEffect(() => {
        const getId = async () => {
            let id = await AsyncStorage.getItem('@id');
            if (id !== null) {
                setUserId(id)
            }

        }
        getId();
    }, []);






    const onDismissSingle = () => {
        setOpen(false)
    };


    // getBookings 
    const getBookings = async (employeeId) => {
        const token = await AsyncStorage.getItem("@token");

        await api.get(`/bookings/booking-barber/${employeeId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

        }).then(response => {
            isMounted && setBookings(response.data);

        }).catch((err) => {
            console.log(err)
        })


    };


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






    const renderHeader = () => {
        return (
            <View style={{ marginTop: 40 }}>
                <Text style={styles.title} >Escolha o Profissional</Text>
            </View>
        )
    }

    const renderItem = ({ item }) => {
        const { _id, firstname, lastname, picture } = item;
        return (
            <TouchableOpacity
                onPress={() => {
                    setVisible(!visible);
                    setFirstName(firstname);
                    setLastName(lastname);
                    setPicture(picture);
                    setEmployeeId(_id);
                    getBookings(_id)
                }}
                style={styles.barbers}>

                <View style={styles.imageWrapper} >
                    <Image style={styles.image} resizeMode='cover' source={{ uri: picture }} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.title} >{firstname}</Text>
                    <Text style={styles.text} >{lastname}</Text>
                </View>
            </TouchableOpacity>
        )

    }
    const LoadingBar = () => {
        return (
            <View>
                <ActivityIndicator size="small" color="#fff" />
            </View>
        );
    };




    const handleAvailableTime = (time) => {
        for (let i = 0; i < HOURS.length; i++) {
            const today = moment(new Date()).toDate();
            var time = date.toString().substring(0, 16) + HOURS[i].startHour + ':00 GMT-0300 (-03)';

            for (let j = 0; j < bookings.length; j++) {
                var apiHour = moment(bookings[j]?.date).toDate().toString();
                var empId = bookings[j].employeeId;

                var todayFormatted = moment(today).format('L');
                var dateFormatted = moment(date).format('L');

               var currentHour = moment(today).format('HH:mm');

               var availableHour = moment(HOURS[i].startHour, 'HH:mm A').format('HH:mm');


                if (time === apiHour) {
                    HOURS[i].isEnabled = false;
                } else if (todayFormatted === dateFormatted && availableHour < currentHour) {
                    HOURS[i].isEnabled = false
                } else {
                    HOURS[i].isEnabled = true;
                }
            }
            setBarberId(empId);
            setHour(time)

           


        }

    }
   


    const renderHours = ({ item }) => {
        const { startHour, isEnabled } = item


        return (
            <View style={{ padding: 6 }} >
                <TouchableOpacity
                    disabled={handleAvailableTime(startHour) || isEnabled ? false :
                        barberId === employeeId ? true
                            : false}

                    onPress={() => {
                        setSelectedHour(startHour);
                    }} activeOpacity={0.7} style={[styles.hours, { backgroundColor: startHour === selectedHour ? COLORS.success : null }]}>

                    <Text style={[styles.hourText, {
                        color: startHour === selectedHour ? 'white' :
                            handleAvailableTime(startHour) || isEnabled ? COLORS.black :
                                barberId === employeeId ? '#d3d3d3' :
                                    COLORS.black
                    }]} >{startHour}</Text>
                </TouchableOpacity>
            </View>
        )
    }



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
                        numColumns={2}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={21}
                        removeClippedSubviews={true}
                        updateCellsBatchingPeriod={100}
                        contentContainerStyle={{ flexGrow: 1 }}
                        bounces={false}
                        ListHeaderComponent={renderHeader}
                    />

            }
            <Modal style={styles.modal} visible={visible} onDismiss={() => setVisible(!visible)} >
               
                    <Formik
                        initialValues={{
                            title: name,
                            date: date.toString().substring(0, 16) + selectedHour,
                            customer: username,
                            time: selectedHour,
                            userId: userId,
                            serviceId: _id,
                            employeeId: employeeId,
                            duration: duration
                        }}
                        enableReinitialize
                        onSubmit={async (values, formikActions) => {

                            const token = await AsyncStorage.getItem('@token')
                            setTimeout(() => {
                                // console.log(values)
                                api.post('/bookings', values, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    }
                                })
                                    .then(() => {
                                        Alert.alert(
                                            "Marcado!",
                                            "Agendamento Cadastrado com Sucesso.",
                                            [

                                                { text: "Ver Agendamentos", onPress: () => navigation.navigate('Bookings') }
                                            ], { cancelable: false }
                                        );
                                    })
                                    .catch((err) => {
                                        Alert.alert(
                                            "Erro!",
                                            "Algo deu errado: " + JSON.stringify(err.response.data),
                                            [

                                                { text: "OK" }
                                            ], { cancelable: true }
                                        );
                                    })


                            }, 500)
                            formikActions.setSubmitting(false);
                        }
                        }
                    >
                        {props => (
                            <ScrollView showsVerticalScrollIndicator={false}
                            bounces={false} >
                                <View style={styles.modalWrapper}>
                                    <Text style={[styles.title, { color: 'black', textAlign: 'center', fontSize: 22, marginBottom: 10 }]}> Agendamento</Text>
                                    <View style={styles.info} >
                                        <View style={styles.wrapper}>
                                            <Image style={styles.image} source={{ uri: picture }} resizeMode='cover' />
                                        </View>

                                        <View style={{ padding: 12 }}>

                                            <Text style={styles.title}>Serviço: {name}</Text>
                                            <Text style={[styles.title, { color: 'black' }]}>Profissional: {firstname} {lastname}</Text>

                                            <Text style={styles.text}>Valor:  {price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Text>

                                        </View>

                                    </View>

                                    <View>
                                        <View>
                                            <View style={styles.dateInput}>
                                                <Text style={styles.title} >Para qual dia?</Text>
                                                <Text style={styles.text} >{date ? new Intl.DateTimeFormat('pt-BR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit'
                                                }).format(new Date(date)) : ''}</Text>

                                                <FAB
                                                    icon="calendar"
                                                    color='white'
                                                    style={styles.fab}
                                                    onPress={() => setOpen(true)}
                                                />

                                                <DatePickerModal
                                                    locale='pt'
                                                    mode='single'
                                                    visible={open}
                                                    inputFormat
                                                    onDismiss={onDismissSingle}
                                                    date={new Date(date)}
                                                    onConfirm={(value) => {
                                                        const newDate = Object.values(value).toString();
                                                        setDate(newDate);
                                                        props.setFieldValue("date", newDate);
                                                        setOpen(false)

                                                    }}
                                                />



                                            </View>
                                            <View style={styles.timeInput}>

                                                <Text style={styles.title} >Escolha um horário disponível.</Text>

                                                <FlatList
                                                    data={HOURS}
                                                    keyExtractor={item => item.id}
                                                    renderItem={renderHours}
                                                    horizontal
                                                    initialNumToRender={5}
                                                    maxToRenderPerBatch={10}
                                                    windowSize={21}
                                                    removeClippedSubviews={true}
                                                    updateCellsBatchingPeriod={100}
                                                    contentContainerStyle={{ flexGrow: 1 }}
                                                    bounces={false}
                                                />


                                            </View>
                                            <Text style={[styles.text, { textAlign: 'center' }]} > Agendar para: {date ? new Intl.DateTimeFormat('pt-BR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: '2-digit'
                                            }).format(new Date(date)) : ''}</Text>


                                            <Text style={[styles.title, { textAlign: 'center' }]}>{selectedHour || 'Escolha um horário acima.'}</Text>

                                        </View>
                                    </View>




                                    <View style={styles.actions}>

                                        <Button
                                            onPress={props.handleSubmit}
                                            mode='contained'
                                            style={[styles.button, { backgroundColor: COLORS.success }]}
                                        >
                                            {loading ? <ActivityIndicator size={18} color={'white'} /> : 'Confirmar Agendamento'}
                                        </Button>

                                        <Button
                                            onPress={() => {
                                                setVisible(!visible);
                                                setSelectedHour('');
                                                setDate(new Date());

                                            }}
                                            mode='contained'
                                            style={[styles.button, { backgroundColor: COLORS.tangerine , marginBottom: 20}]}
                                        >
                                            Cancelar
                                        </Button>

                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </Formik>
            </Modal>
        </View>

    );

}





const styles = StyleSheet.create({
    barbers: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
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
        padding: 10,

        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    fab: {
        backgroundColor: COLORS.success
    },

    title: {
        color: COLORS.tangerine,
        fontFamily: FONTS.bold,
        fontSize: 18,
    },
    hours: {
        padding: 5,
        marginVertical: 3,
        borderRadius: 6
    },
    hourText: {
        fontFamily: FONTS.bold,
        fontSize: 16,
        marginHorizontal: 10
    },
    text: {
        color: COLORS.black,
        fontFamily: FONTS.bold,
        fontSize: 16,
    },
    dateInput: {
        marginVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    timeInput: {
        marginBottom: 30
    },
    times: {
        padding: 10,
        flexDirection: 'row'

    },

    button: {
        borderRadius: 16,
        backgroundColor: COLORS.success,
        marginTop: 20,
        padding: 12,
    },

    // * Modal goes here

    modal: {
        height: '100%',
        backgroundColor: 'transparent'
    },
    modalWrapper: {
        padding: 12,
        backgroundColor: COLORS.white,
        borderRadius: 10,
    },
    wrapper: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        overflow: 'hidden',

    },
    info: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    actions: {
    }


});


export default Appointment;