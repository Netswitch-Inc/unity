// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

import { initialProject } from "utility/reduxConstant";

async function getProjectListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Project.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getProjectList = createAsyncThunk(
  "appProject/getProjectList",
  async (params) => {
    try {
      const response = await getProjectListRequest(params);
      if (response && response.flag) {
        return {
          params,
          projectItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          projectItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        projectItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Project.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editProjectRequest = createAsyncThunk(
  "appProject/editProjects",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          projectItem: response.data,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          projectItem: null,
          actionFlag: "",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        projectItem: null,
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function createProjectRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.Project.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createProject = createAsyncThunk(
  "appProject/createProject",
  async (payload) => {
    try {
      const response = await createProjectRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          // projectItem: response.data || null,
          actionFlag: "PROJECT_CREATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "PROJECT_CREATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "PROJECT_CREATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateProjectRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.Project.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateProject = createAsyncThunk(
  "appProject/updateProject",
  async (payload) => {
    try {
      const response = await updateProjectRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          // projectItem: response.data || null,
          actionFlag: "PROJECT_UPDATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "PROJECT_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "PROJECT_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteProjectRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.Project.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteProject = createAsyncThunk(
  "appProject/deleteProject",
  async (id) => {
    try {
      const response = await deleteProjectRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "PROJECT_DELETED_SUCCSESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          id,
          actionFlag: "PROJECT_DELETED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        id,
        actionFlag: "PROJECT_DELETED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

// Create a slice
const appAuthSlice = createSlice({
  name: "appProject",
  initialState: {
    projectItems: [],
    projectItem: initialProject,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanProjectMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectList.pending, (state) => {
        state.projectItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getProjectList.fulfilled, (state, action) => {
        state.projectItems = action.payload?.projectItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "PROJECT_LISTING";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getProjectList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(editProjectRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.actionFlag = 'GET_CURRENT_PROJECT'
        state.projectItem = action.payload.projectItem;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(createProject.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        // state.projectItem = action.payload?.projectItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createProject.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        // state.projectItem = action.payload?.projectItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateProject.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteProject.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  },
});

export const { cleanProjectMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
