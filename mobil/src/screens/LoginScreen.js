import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../redux/authSlice";
import AuthContent from "../components/AuthContent";
import Loading from "../components/Loading";
import { useLoginMutation } from "../redux/slice/api";
import { useNavigation } from "@react-navigation/native";
import { handleApiError } from "../util/errorHandler";
import { clearAuthData } from "../util/authHelpers";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();
  const navigation = useNavigation();
  const [error, setError] = useState("");

  // LoginScreen'e her geldiğinde önce tüm storage ve state'i temizle
  useEffect(() => {
    const forceCleanup = async () => {
      try {
        await clearAuthData();
        dispatch(logout());
        console.log("🧹 Login ekranı - Kullanıcı verileri temizlendi");
      } catch (error) {
        handleApiError(error, "LoginScreen.forceCleanup");
        dispatch(logout());
      }
    };
    forceCleanup();
  }, [dispatch]);

  const loginHandler = async ({ email, password }) => {
    setIsLoading(true);
    setError("");

    try {
      await clearAuthData();
      const sessionId = generateSessionId();
      const response = await login({ email, password }).unwrap();

      if (response.token) {
        dispatch(
          loginSuccess({
            token: response.token,
            userId: response.user._id,
            user: response.user,
            role: response.user.role || "user",
            isAuthenticated: true,
            sessionId: sessionId,
          })
        );
      } else {
        setError("Geçersiz yanıt. Token bulunamadı.");
        Alert.alert("Giriş Yapılamadı", "Token bulunamadı");
      }
    } catch (err) {
      const errorInfo = handleApiError(err, "LoginScreen.loginHandler");
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSessionId = () => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 15);
  };

  if (isLoading) {
    return <Loading message="Giriş yapılıyor..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          //source={require("")}
        />
      </View>
      <AuthContent isLogin onAuthenticate={loginHandler} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    resizeMode: "stretch",
    width: "90%",
    height: 150,
  },
});
