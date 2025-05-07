import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../../API/config";
import { handleUnauthorized } from "../../../util/authHelpers";
import { AUTH_ERRORS } from "../../../util/constants";
import { validateTokenAndUser } from "../../../util/authHelpers";

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api`,
  prepareHeaders: async (headers) => {
    try {
      const { token } = await validateTokenAndUser();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    } catch (error) {
      console.error("Header hazırlama hatası:", error);
      return headers;
    }
  },
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Eğer endpoint auth ile ilgili değilse ve token yoksa, isteği engelle
  if (!args.url.includes("login") && !args.url.includes("register")) {
    const { token } = await validateTokenAndUser();
    if (!token) {
      // Token yoksa kullanıcıyı login ekranına yönlendir
      console.log("apiSlice: Token bulunamadı, çıkış yapılıyor");
      await handleUnauthorized(api.dispatch, () => ({ type: "auth/logout" }));

      return {
        error: {
          status: 401,
          data: { message: AUTH_ERRORS.TOKEN_MISSING },
        },
      };
    }
  }
  
  let result = await baseQuery(args, api, extraOptions);

  // Eğer 401 hatası varsa
  if (result.error && result.error.status === 401) {
    // Özel işleme gerektiren endpoint'lere bak
    
    // Takım listesi için özel işleme: Sadece empty array döndür, oturumu kapatma
    if (args.url.includes("get-team")) {
      console.warn("apiSlice: Takım listesi için 401 hatası alındı, sessizce boş dizi döndürülüyor");
      
      // Hata yerine boş bir success yanıtı döndür
      return { 
        data: [],
        meta: { 
          request: result.meta?.request,
          response: result.meta?.response
        }
      };
    }
    
    // Diğer tüm 401 hataları için oturumu kapat
    console.log("apiSlice: 401 hatası alındı, çıkış yapılıyor");
    await handleUnauthorized(api.dispatch, () => ({ type: "auth/logout" }));
  }
  
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Team", "Tasks", "Notifications"],
  endpoints: () => ({}),
  // Global API ayarları
  keepUnusedDataFor: 0, // Önbelleği tamamen devre dışı bırak
  refetchOnMountOrArgChange: true, // Bileşen her monte edildiğinde verileri yeniden çek
  refetchOnFocus: true, // Uygulamaya geri döndüğünde verileri yeniden çek
  refetchOnReconnect: true, // Yeniden bağlantı kurulduğunda verileri yeniden çek
});

export const loginSuccess = ({
  token,
  userId,
  role,
  user,
  isAuthenticated,
  sessionId,
}) => ({
  type: "auth/loginSuccess",
  payload: { token, userId, role, user, isAuthenticated, sessionId },
});

export const logout = () => ({ type: "auth/logout" });
