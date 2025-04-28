import { apiSlice } from "./apiSlice";

// Task ilgili API endpoints
export const taskApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    
    fetchTasks: builder.query({
      query: () => ({
        url: "task",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (!response || !response.status) {
          return [];
        }
        return response.tasks || [];
      },
      providesTags: ["Tasks"],
      keepUnusedDataFor: 0,
    }),

    fetchTaskById: builder.query({
      query: (id) => ({
        url: `task/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Tasks", id }],
    }),

    addTask: builder.mutation({
      query: (task) => ({
        url: "task/create",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation({
      query: ({ id, task }) => ({
        url: `task/update/${id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tasks", id },
        "Tasks",
      ],
    }),

    deleteRestoreTask: builder.mutation({
      query: ({ id, actionType }) => ({
        url: `task/delete-restore/${id}`,
        method: "DELETE",
        params: { actionType },
      }),
      invalidatesTags: ["Tasks"],
    }),
    
    getTrashedTasks: builder.query({
      query: () => ({
        url: "task?isTrashed=true",
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.tasks || [];
      },
      providesTags: ["Tasks"],
    }),
  }),
});

export const {
  useFetchTasksQuery,
  useFetchTaskByIdQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteRestoreTaskMutation,
  useGetTrashedTasksQuery,
} = taskApiSlice;
