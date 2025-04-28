import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetUserQuery } from "../redux/slice/api";
import { loginSuccess, logout } from "../redux/authSlice";
import DrawerNavigator from "./DrawerNavigator";
import Loading from "../components/Loading";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import EditUserScreen from "../screens/EditUserScreen";
import { validateTokenAndUser, handleUnauthorized } from "../util/authHelpers";
import { handleError, handleApiError } from "../util/errorHandlers";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AfterAuthenticationStack() {
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditUser"
          component={EditUserScreen}
          options={{ headerShown: false }}
        />
      </>
    </Stack.Navigator>
  );
}

function Navigation() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  // useGetUserQuery'yi çalıştır
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isUninitialized,
  } = useGetUserQuery(undefined, {
    skip: !authState.token || !authState.isAuthenticated,
  });

  // Uygulama başlatıldığında token kontrolü ve kullanıcı profili yükleme
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Token ve kullanıcı bilgilerini kontrol et
        const { isValid, token, userId, role } = await validateTokenAndUser();
        // Token yoksa oturumu kapat
        if (!isValid) {
          dispatch(logout());
          setIsInitializing(false);
          return;
        }
        // Geçici olarak temel bilgilerle oturum aç, API'den profil bilgileri gelince güncellenecek
        dispatch(
          loginSuccess({
            token,
            userId,
            role,
            isAuthenticated: true,
          })
        );
      } catch (error) {
        handleError(error, "StackNavigator.initializeAuth", false);
        dispatch(logout());
      } finally {
        setIsInitializing(false);
      }
    };
    initializeAuth();
  }, [dispatch]);

  // Kullanıcı oturumunu doğrulamak ve yenilemek için mevcut sessionId'yi merkezi olarak kontrol et
  useEffect(() => {
    const checkSessionId = async () => {
      try {
        const storedSessionId = await AsyncStorage.getItem("sessionId");

        if (
          storedSessionId &&
          storedSessionId !== authState.sessionId &&
          !isLoading &&
          !isError &&
          refetch &&
          !isUninitialized &&
          typeof refetch === "function"
        ) {
          try {
            await refetch();
          } catch (err) {
            console.warn("❌ Refetch sırasında hata:", err);
          }
        }
      } catch (error) {
        handleError(error, "StackNavigator.checkSessionId", false);
      }
    };

    checkSessionId();
  }, [authState.sessionId, refetch, dispatch, authState, isLoading, isError]);

  // API'den kullanıcı bilgileri gelince Redux store'u güncelle
  useEffect(() => {
    if (user && authState.token) {
      const enhancedUserData = {
        ...user,
        name: user.name,
        title: user.title,
        role: user.role,
      };

      dispatch(
        loginSuccess({
          user: enhancedUserData,
          token: authState.token,
          userId: user.userId || user._id || authState.userId,
          role: user.role || authState.role,
          isAuthenticated: true,
          sessionId: authState.sessionId,
        })
      );
    }
  }, [user, authState.token, dispatch]);

  // API hatası durumunda
  useEffect(() => {
    if (isError && error) {
      // 401 Unauthorized hatası durumunda sadece handleUnauthorized kullan, handleApiError değil
      if (error.status === 401) {
        console.log(
          "StackNavigator: 401 hatası tespit edildi, çıkış yapılıyor"
        );
        handleUnauthorized(dispatch, logout);
      } else {
        // Diğer hatalar için normal hata işleme kullan
        handleApiError(error, "StackNavigator.useGetUserQuery");
      }
    }
  }, [isError, error, dispatch]);

  if (isInitializing || isLoading) {
    return <Loading message="Oturum kontrol ediliyor..." />;
  }

  return (
    <NavigationContainer>
      {authState.isAuthenticated ? (
        <AfterAuthenticationStack role={authState.role} />
      ) : (
        <RootStack />
      )}
    </NavigationContainer>
  );
}

export default function StackNavigator() {
  return <Navigation />;
}
