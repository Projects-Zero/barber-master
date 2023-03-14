import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Image,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Formik, ErrorMessage, Field, Form } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import useAuth from "../hooks/useAuth";
import { COLORS, FONTS } from "../constants/theme";
const LOGIN_URL = "/auth";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const Login = ({ navigation }) => {
  const { t } = useTranslation();
  const background = require("../assets/images/login.png");

  const { setAuth } = useAuth();

  const emailRef = useRef();
  const userRef = useRef();
  const errRef = useRef();

  const [loading, setLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const validations = yup.object().shape({
    //user: yup.string().required('Usuário é obrigatório'),
    email: yup
      .string()
      .email(t("auth.invalidEmail"))
      .required(t("auth.requireEmail")),
    pwd: yup.string().required(t("auth.requirePassword")),
  });

  return (
    <ImageBackground
      resizeMode="cover"
      source={background}
      style={[styles.background]}
    >
      <Text ref={errRef} style={errMsg ? styles.errMsg : styles.offscreen}>
        {errMsg}
      </Text>

      <View style={styles.imagewrapper}>
        <Image
          source={require("../assets/images/logo-new.png")}
          resizeMode="cover"
          style={styles.logo}
        />
      </View>

      <Formik
        initialValues={{
          //user: '',
          email: "",
          pwd: "",
        }}
        onSubmit={async (credentials, formikActions) => {
          setLoading(true);
          await sleep(500);
          api
            .post(LOGIN_URL, credentials, {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            })
            .then((response) => {
              const userId = response?.data?.userId;
              const accessToken = response?.data?.accessToken; // send to backend
              const roles = response?.data?.roles; // send roles to backend
              const username = response?.data?.user;
              const photo = response?.data?.photo;
              const email = response?.data?.email;

              // console.log(JSON.stringify(response?.data))
              // salva o token bo async storage
              AsyncStorage.multiSet([
                ["@token", accessToken],
                ["@id", userId],
                ["@user", username],
                ["@photo", photo],
                ["@email", email],
              ]);
              // console.log(`Values: ${values}}`)

              setAuth({
                credentials,
                roles,
                accessToken,
              });

              navigation.navigate("Home");
            })
            .catch((err) => {
              // console.log(`Error: ${err}`);
              if (!err?.response) {
                setErrMsg("Erro no servidor: " + err);
              } else if (err.response?.status === 400) {
                setErrMsg("Email ou senha não existem.");
              } else if (err.response?.status === 401) {
                setErrMsg("Email ou senha incorretos, ou não cadastrados!");
              } else {
                setErrMsg("Erro ao tentar fazer Login.");
                // console.warn(err.response)
              }
              // errRef.current.focus();
            })
            .finally(() => setLoading(false));
          formikActions.setSubmitting(false);
          formikActions.resetForm();
          setErrMsg("");
        }}
        validationSchema={validations}
      >
        {(props) => (
          <View style={styles.loginForm}>
            {/*                <TextInput style={styles.input}
                            label={"Usuário"}
                            ref={userRef}
                            autoComplete="off"
                            value={props.values.user}
                            onChangeText={props.handleChange('user')}
                            autoCapitalize='none'


                        /> */}
            {props.touched.user && props.errors.user ? (
              <Text style={styles.errMsg}>{props.errors.user}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              label={t("auth.email")}
              autoComplete="off"
              value={props.values.email}
              onChangeText={props.handleChange("email")}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {props.touched.email && props.errors.email ? (
              <Text style={styles.errMsg}>{props.errors.email}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              label={t("auth.password")}
              secureTextEntry={true}
              autoComplete="off"
              value={props.values.pwd}
              onChangeText={props.handleChange("pwd")}
            />
            {props.touched.pwd && props.errors.pwd ? (
              <Text style={styles.errMsg}>{props.errors.pwd}</Text>
            ) : null}

            <Button
              style={styles.button}
              mode="contained"
              onPress={props.handleSubmit}
            >
              {loading ? (
                <ActivityIndicator size={18} color={"white"} />
              ) : (
                t("auth.login")
              )}
            </Button>
            <Text style={styles.text}>
              {t("auth.notRegistered")}
              <Text
                onPress={() => navigation.navigate("Register")}
                style={{ textDecorationLine: "underline" }}
              >
                {t("auth.register")}
              </Text>
            </Text>
          </View>
        )}
      </Formik>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginForm: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    width: "90%",
    height: 200,
  },
  input: {
    width: "100%",
    marginTop: 10,
  },
  errMsg: {
    backgroundColor: "lightpink",
    color: "firebrick",
    fontWeight: "bold",
    padding: 5,
    marginBottom: 10,
  },
  offscreen: {
    width: "100%",
    position: "absolute",
    left: -9999,
  },
  button: {
    marginTop: 20,
    padding: 12,
    width: "100%",
    backgroundColor: COLORS.tangerine,
  },
  imagewrapper: {
    width: 350,
    height: 350,
    marginBottom: 30,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  text: {
    marginTop: 10,
    color: "#fff",
    fontSize: 18,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },
});

export default Login;
