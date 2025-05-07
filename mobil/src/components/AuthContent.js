import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import AuthForm from "./AuthForm";
import ButtonWhite from "./ButtonWhite";
import { useNavigation } from "@react-navigation/native";
import { handleValidationError } from "../util/errorHandler";

function validateCredentials({
  email,
  password,
  confirmEmail,
  confirmPassword,
  name,
  title,
  role,
  isLogin,
}) {
  email = email.trim();
  password = password.trim();

  const emailIsValid = email.includes("@");
  const passwordIsValid = password.length > 5;
  const emailsAreEqual = email === confirmEmail;
  const passwordsAreEqual = password === confirmPassword;
  const nameIsValid = !isLogin ? name?.trim().length > 0 : true;
  const titleIsValid = !isLogin ? title?.trim().length > 0 : true;
  const roleIsValid = !isLogin ? role?.trim().length > 0 : true;

  const isValid =
    emailIsValid &&
    passwordIsValid &&
    (isLogin ||
      (emailsAreEqual &&
        passwordsAreEqual &&
        nameIsValid &&
        titleIsValid &&
        roleIsValid));

  return {
    isValid,
    errors: {
      email: !emailIsValid,
      confirmEmail: !emailIsValid || !emailsAreEqual,
      password: !passwordIsValid,
      confirmPassword: !passwordIsValid || !passwordsAreEqual,
      name: !nameIsValid,
      title: !titleIsValid,
      role: !roleIsValid,
    },
  };
}

export default function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialIsInValid, setCredentialIsInValid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
    name: false,
    title: false,
    role: false,
  });

  async function submitHandler(credentials) {
    const { isValid, errors } = validateCredentials({
      ...credentials,
      isLogin,
    });

    if (!isValid) {
      handleValidationError(errors, "AuthContent.submitHandler");
      setCredentialIsInValid(errors);
      return;
    }

    // Artık burada API çağrısı yok — sadece üst bileşene bilgileri iletiyoruz
    onAuthenticate(credentials);
  }

  function switchScreen() {
    navigation.navigate(isLogin ? "Register" : "Login");
  }

  return (
    <View style={styles.container}>
      <AuthForm
        credentialIsInValid={credentialIsInValid}
        isLogin={isLogin}
        onSubmit={submitHandler}
      />
      <View>
        <ButtonWhite onPress={switchScreen}>
          {isLogin ? "Yeni Kullanıcı Oluştur" : "Giriş Yap"}
        </ButtonWhite>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 50,
    marginHorizontal: 30,
    padding: 15,
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});