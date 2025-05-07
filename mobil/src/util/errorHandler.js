import { Alert } from "react-native";
import { ERROR_TYPES } from "./constants";

//Hata tipini belirler
export const determineErrorType = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN;

  // Ağ hatası
  if (
    error.name === "NetworkError" ||
    error.message?.includes("network") ||
    !navigator.onLine
  ) {
    return ERROR_TYPES.NETWORK;
  }
  // API veya sunucu hataları
  if (error.status === 401 || error.status === 403) {
    return ERROR_TYPES.AUTH;
  }
  if (error.status >= 500) {
    return ERROR_TYPES.SERVER;
  }
  // Doğrulama hataları
  if (
    error.status === 400 ||
    error.status === 422 ||
    error.message?.includes("validation")
  ) {
    return ERROR_TYPES.VALIDATION;
  }

  return ERROR_TYPES.UNKNOWN;
};

//Hata mesajını belirler
export const getErrorMessage = (error) => {
  if (!error) return "Bir hata oluştu.";

  // API yanıtlarından gelen hata mesajlarını kontrol et
  if (error.data?.message) {
    return error.data.message;
  }
  // Doğrudan hata mesajını kontrol et
  if (error.message) {
    return error.message;
  }
  const errorType = determineErrorType(error);

  // Hata tipine göre varsayılan mesajlar
  switch (errorType) {
    case ERROR_TYPES.AUTH:
      return "Oturum hatası. Lütfen tekrar giriş yapın.";
    case ERROR_TYPES.NETWORK:
      return "İnternet bağlantınızı kontrol edin.";
    case ERROR_TYPES.VALIDATION:
      return "Lütfen girdiğiniz bilgileri kontrol edin.";
    case ERROR_TYPES.SERVER:
      return "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
    default:
      return "Bir hata oluştu. Lütfen tekrar deneyin.";
  }
};

//Hata mesajını loglar ve kullanıcıya gösterir
export const handleError = (
  error,
  source,
  showAlert = true,
  onAlertDismiss = null
) => {
  const errorType = determineErrorType(error);
  const errorMessage = getErrorMessage(error);

  // Her zaman konsola hata logla
  console.error(`[${source}] [${errorType}]: ${errorMessage}`, error);

  if (showAlert) {
    Alert.alert("Hata", errorMessage, [
      {
        text: "Tamam",
        onPress: onAlertDismiss,
      },
    ]);
  }

  return {
    type: errorType,
    message: errorMessage,
  };
};

//Ağ hatalarını işler (başarısız istekler için)
export const handleApiError = (error, source, onAlertDismiss = null) => {
  // API hatalarını özel olarak işle
  let errorMessage = "İstek işlenirken bir hata oluştu.";

  if (error.data?.message) {
    errorMessage = error.data.message;
  } else if (error.error) {
    errorMessage = error.error;
  } else if (error.message) {
    errorMessage = error.message;
  }

  console.error(`[${source}] API Hatası:`, { message: errorMessage, error });

  // 401 Unauthorized hatası için alert gösterme, çünkü handleUnauthorized zaten gösterecek
  const errorType = determineErrorType(error);
  if (errorType !== ERROR_TYPES.AUTH || error.status !== 401) {
    Alert.alert("İşlem Hatası", errorMessage, [
      {
        text: "Tamam",
        onPress: onAlertDismiss,
      },
    ]);
  }

  return {
    type: errorType,
    message: errorMessage,
  };
};

//Form doğrulama hatalarını işler
export const handleValidationError = (errors, source) => {
  console.warn(`[${source}] Form Doğrulama Hatası:`, errors);

  Alert.alert("Doğrulama Hatası", "Lütfen girdiğiniz bilgileri kontrol edin.");

  return {
    type: ERROR_TYPES.VALIDATION,
    message: "Lütfen girdiğiniz bilgileri kontrol edin.",
    errors,
  };
};
