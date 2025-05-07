import { apiSlice } from "./apiSlice";
import { normalizeUserData } from "../../../util/authHelpers";

// Auth ilgili API endpoints
export const authApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "user/login",
        method: "POST",
        body: credentials,
      }),

      transformResponse: (response, meta, arg) => {
        if (!response.status) {
          throw new Error(response.message || "Giriş başarısız");
        }

        const enhancedResponse = {
          ...response,
          user: normalizeUserData({
            ...response,
            email: arg?.email,
          }),
        };
        return enhancedResponse;
      },
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "user/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response) => {
        return {
          status: true,
          message:
            "Hesabınız başarıyla oluşturuldu. Admin onayından sonra giriş yapabilirsiniz.",
          user: response,
        };
      },
      transformErrorResponse: (error) => {
        return {
          status: false,
          message: error.data?.message || "Kayıt sırasında bir hata oluştu",
        };
      },
    }),

    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `user/profile/${id}`,
        method: "PUT",
        body: userData,
      }),
      transformResponse: (response) => {
        if (!response || (!response.status && !response.updatedUser)) {
          console.error("Güncelleme başarısız, yanıt:", response);
          throw new Error(response?.message || "Güncelleme başarısız");
        }
        // API yanıtı iki farklı formatta gelebilir, her iki durumu da ele al
        const result = {
          status: response.status || true,
          message: response.message || "Kullanıcı başarıyla güncellendi",
          updatedUser: response.updatedUser || response.user || response,
        };
        return result;
      },
      transformErrorResponse: (error) => {
        console.error("Güncelleme hatası:", error);
        return {
          status: false,
          message:
            error.data?.message || "Güncelleme sırasında bir hata oluştu",
        };
      },
      invalidatesTags: ["User", "Team"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "user/logout",
        method: "POST",
      }),
    }),

    getUser: builder.query({
      query: () => ({
        url: "user/profile",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (!response) {
          throw new Error("Kullanıcı bilgileri alınamadı");
        }
        return normalizeUserData(response);
      },
      providesTags: ["User"],
      keepUnusedDataFor: 0,
    }),

    getTeamList: builder.query({
      query: () => ({
        url: "user/get-team",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (!response || !Array.isArray(response)) {
          console.warn("Team list yanıtı geçersiz format:", response);
          return [];
        }

        return response.map((user) => normalizeUserData(user));
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.warn("Takım üyeleri alınırken hata:", err);
        }
      },
      extraOptions: {
        maxRetries: 0,
      },
      providesTags: ["Team"],
      keepUnusedDataFor: 0,
    }),

    getNotificationsList: builder.query({
      query: () => ({
        url: "user/notifications",
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response) ? response : [];
      },
      providesTags: ["Notifications"],
    }),

    markNotificationRead: builder.mutation({
      query: ({ isReadType, id }) => ({
        url: `user/read-noti?${isReadType ? `isReadType=${isReadType}` : ""}${id ? `&id=${id}` : ""}`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    activateUser: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `user/${id}/activate`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["User", "Team"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),

    changePassword: builder.mutation({
      query: ({ password }) => ({
        url: "user/change-password",
        method: "PUT",
        body: { password },
      }),
      transformResponse: (response) => {
        if (!response.status) {
          throw new Error(response.message || "Şifre güncelleme başarısız");
        }
        return response;
      },
      transformErrorResponse: (error) => {
        return {
          status: false,
          message:
            error.data?.message || "Şifre değiştirilirken bir hata oluştu",
        };
      },
    }),

    resetUserPasswordByAdmin: builder.mutation({
      query: ({ id, password }) => ({
        url: `user/reset-password/${id}`,
        method: "PUT",
        body: { password },
      }),
      transformResponse: (response) => {
        if (!response.status) {
          throw new Error(response.message || "Şifre sıfırlama başarısız");
        }
        return response;
      },
      transformErrorResponse: (error) => {
        return {
          status: false,
          message: error.data?.message || "Şifre sıfırlanırken bir hata oluştu",
        };
      },
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useLogoutMutation,
  useGetUserQuery,
  useGetTeamListQuery,
  useGetNotificationsListQuery,
  useMarkNotificationReadMutation,
  useActivateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useResetUserPasswordByAdminMutation,
} = authApiSlice;
