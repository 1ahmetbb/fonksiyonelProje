//Token yönetimi ve kimlik doğrulama işlemleri için yardımcı fonksiyonlar.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { STORAGE_KEYS, AUTH_ERRORS } from "./constants";

// Alert gösterilip gösterilmediğini takip eden flag
let unauthorizedAlertShown = false;

// AsyncStorage işlemleri için merkezi fonksiyonlar
export const saveAuthData = async (token, userId, role, user, sessionId) => {
  try {
    const items = [
      ['token', token ?? ''],
      ['userId', userId ?? ''],
      ['role', role ?? ''],
      ['currentUser', user ? JSON.stringify(user) : ''],
      ['sessionId', sessionId ?? ''],
      ['loginTime', new Date().toISOString()],
    ];

    // Filtrele: Değeri boş olanları kaydetme
    const validItems = items.filter(([key, value]) => value !== null && value !== undefined);

    await AsyncStorage.multiSet(validItems);
  } catch (error) {
    console.error("Auth verileri kaydedilirken hata:", error);
    throw error;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(STORAGE_KEYS);
  } catch (error) {
    console.error("Auth verileri temizlenirken hata:", error);
    throw error;
  }
};

//Token ve kullanıcı bilgilerini kontrol eder
export const validateTokenAndUser = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    const role = await AsyncStorage.getItem("role");
    const userJson = await AsyncStorage.getItem("currentUser");

    let user = null;
    try {
      if (userJson) {
        user = JSON.parse(userJson);
      }
    } catch (e) {
      console.error("JSON parse hatası:", e);
    }

    if (token && userId && role) {
      return {
        isValid: true,
        token,
        userId,
        role,
        user,
      };
    }

    return {
      isValid: false,
      token: null,
      userId: null,
      role: null,
      user: null,
    };
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return {
      isValid: false,
      token: null,
      userId: null,
      role: null,
      user: null,
      error,
    };
  }
};

//Kullanıcı çıkışı yapar ve tüm oturum verilerini temizler
export const handleLogout = async (dispatch, logoutAction) => {
  try {
    await clearAuthData();
    dispatch(logoutAction());
    unauthorizedAlertShown = false;
  } catch (error) {
    console.error("Çıkış yapma hatası:", error);
    dispatch(logoutAction());
    unauthorizedAlertShown = false;
  }
};

//Yetki hatası durumunda kullanıcıyı çıkış yapmaya yönlendirir
export const handleUnauthorized = async (dispatch, logoutAction) => {
  try {
    await clearAuthData();
    
    // Eğer daha önce alert gösterilmediyse göster
    if (!unauthorizedAlertShown) {
      unauthorizedAlertShown = true; // Flag'i true yap
      
      Alert.alert(
        "Oturum Süresi Doldu",
        "Güvenlik nedeniyle oturumunuz kapatıldı. Lütfen tekrar giriş yapın.",
        [{ 
          text: "Tamam", 
          onPress: () => {
            dispatch(logoutAction());
          }
        }]
      );
    } else {
      // Alert zaten gösterilmişse sadece logout işlemini yap
      dispatch(logoutAction());
    }
  } catch (error) {
    console.error("Yetki hatası işleme hatası:", error);
    dispatch(logoutAction());
  }
};

// Kullanıcı verilerini normalize eder
export const normalizeUserData = (user) => ({
  _id: user._id || user.userId || null,
  name: user.name || 'Kullanıcı Adı',
  email: user.email || '',
  title: user.title || '',
  role: user.role || 'user',
  isActive: user.isActive === undefined ? true : user.isActive
});
