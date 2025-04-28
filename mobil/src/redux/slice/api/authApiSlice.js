import { apiSlice } from "./apiSlice";

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
          user: {
            _id: response.userId || response.user?._id || response._id,
            email: response.email || response.user?.email || arg?.email || "",
            name: response.name || response.user?.name,
            title: response.title || response.user?.title, 
            role: response.role || response.user?.role, 
            isActive: response.isActive === undefined ? true : response.isActive,
          }
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
          updatedUser: response.updatedUser || response.user || response
        };
        return result;
      },
      transformErrorResponse: (error) => {
        console.error("Güncelleme hatası:", error);
        return {
          status: false,
          message: error.data?.message || "Güncelleme sırasında bir hata oluştu",
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
        const userData = {
          _id: response._id || response.userId || response.id || null,
          name: response.name || "",
          email: response.email || "",
          title: response.title || "",
          role: response.role || "",
          isActive: response.isActive === undefined ? true : response.isActive,
        };
        return userData;
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
        
        // Takım üyelerinin eksik verilerini doldur
        const enhancedTeamList = response.map(user => ({
          ...user,
          name: user.name,
          email: user.email,
          title: user.title,
          role: user.role,
          isActive: user.isActive === undefined ? true : user.isActive
        }));
        
        return enhancedTeamList;
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.warn("Takım üyeleri alınırken hata:", err);
        }
      },
      extraOptions: {
        maxRetries: 0
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
        url: "user/read-noti",
        method: "PUT",
        body: { isReadType, id },
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
} = authApiSlice;
