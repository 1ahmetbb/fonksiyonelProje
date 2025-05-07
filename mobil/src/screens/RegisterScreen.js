import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AuthContent from "../components/AuthContent";
import Loading from "../components/Loading";
import { useNavigation } from "@react-navigation/native";
import { useRegisterMutation } from "../redux/slice/api/authApiSlice";
import { handleApiError } from "../util/errorHandler";

const { height } = Dimensions.get("window");

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [register] = useRegisterMutation();

  async function registerHandler({ email, password, name, title, role }) {
    setIsLoading(true);
    try {
      const response = await register({
        name,
        email,
        password,
        title,
        role: role || "user",
        isAdmin: false,
      }).unwrap();

      //console.log("Kayıt yanıtı:", response);

      Alert.alert("Başarılı", "Kayıt işlemi başarıyla tamamlandı!", [
        { text: "Tamam", onPress: () => navigation.replace("Login") },
      ]);
    } catch (error) {
      // Merkezi hata işleme fonksiyonunu kullan
      handleApiError(error, "RegisterScreen.registerHandler");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Loading message="Kayıt yapılıyor..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              //source={require("")}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <AuthContent isLogin={false} onAuthenticate={registerHandler} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: "90%",
    height: height * 0.15,
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
});
