// API modüllerini tek bir yerden export et
import { apiSlice } from './apiSlice';
import { authApiSlice } from './authApiSlice';
import { taskApiSlice } from './taskApiSlice';

// API slice'larını tek bir noktadan dışa aktar
export { 
  apiSlice,
  authApiSlice,
  taskApiSlice
};

// API hook'larını dışa aktar
export {
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
} from './authApiSlice';

export {
  useFetchTasksQuery,
  useFetchTaskByIdQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteRestoreTaskMutation,
  useGetTrashedTasksQuery,
  useAddTaskActivityMutation,
} from './taskApiSlice';
