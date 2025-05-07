/**
 * Uygulama genelinde kullanılan sabit değerler
 */

// AsyncStorage'da kullanılan anahtarların listesi
export const STORAGE_KEYS = [
    "token", 
    "userId", 
    "role", 
    "currentUser",
    "sessionId",
    "loginTime"
  ]; 
  
  // Token kontrolü yapılan yerler - token kontrollerini takip etmek için
  export const TOKEN_CHECK_LOCATIONS = {
    API_SLICE: "apiSlice.js baseQueryWithReauth'ta",
    APP_JS: "App.js initializeAuth fonksiyonunda",
    STACK_NAVIGATOR: "StackNavigator.js initializeAuth fonksiyonunda"
  };
  
  // Auth ile ilgili hata mesajları
  export const AUTH_ERRORS = {
    TOKEN_MISSING: "Token bulunamadı",
    SESSION_EXPIRED: "Oturum süresi doldu",
    UNAUTHORIZED: "Yetkisiz erişim"
  };
  
  // Uygulama hata tipleri
  export const ERROR_TYPES = {
    AUTH: "AUTH_ERROR",        // Kimlik doğrulama hataları
    NETWORK: "NETWORK_ERROR",  // Ağ bağlantısı hataları
    VALIDATION: "VALIDATION_ERROR", // Form doğrulama hataları
    SERVER: "SERVER_ERROR",    // Sunucu taraflı hatalar
    UNKNOWN: "UNKNOWN_ERROR"   // Bilinmeyen hatalar
  }; 