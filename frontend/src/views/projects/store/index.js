// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

import { initialProject } from "utility/reduxConstant";

async function getProjectListRequest(params) {
  return instance.get(`${API_ENDPOINTS.projects.list}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getProjectList = createAsyncThunk("appProjects/getProjectList", async (params) => {
  try {
    const response = await getProjectListRequest(params);
    if (response && response.flag) {
      return {
        params,
        projectItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "PRJCT_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        projectItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      projectItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getProjectRequest(params) {
  return instance.get(`${API_ENDPOINTS.projects.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getProject = createAsyncThunk("appProjects/getProject", async (params) => {
  try {
    const response = await getProjectRequest(params);
    if (response && response.flag) {
      return {
        projectItem: response.data,
        actionFlag: "PRJCT_ITM_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        projectItem: null,
        actionFlag: "PRJCT_ITM_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      projectItem: null,
      actionFlag: "PRJCT_ITM_ERR",
      success: "",
      error: error
    }
  }
})

async function createProjectRequest(payload) {
  return instance.post(`${API_ENDPOINTS.projects.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createProject = createAsyncThunk("appProjects/createProject", async (payload) => {
  try {
    const response = await createProjectRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        projectItem: response?.data || null,
        actionFlag: "PRJCT_CRTD_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "PRJCT_CRTD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "PRJCT_CRTD_ERR",
      success: "",
      error: error
    }
  }
})

async function updateProjectRequest(payload) {
  return instance.put(`${API_ENDPOINTS.projects.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateProject = createAsyncThunk("appProjects/updateProject", async (payload) => {
  try {
    const response = await updateProjectRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        projectItem: response.data || null,
        actionFlag: "PRJCT_UPDT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "PRJCT_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "PRJCT_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function deleteProjectRequest(id) {
  return instance.delete(`${API_ENDPOINTS.projects.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteProject = createAsyncThunk("appProjects/deleteProject", async (id) => {
  try {
    const response = await deleteProjectRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "PRJCT_DLT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        id,
        actionFlag: "PRJCT_DLT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      id,
      actionFlag: "PRJCT_DLT_ERR",
      success: "",
      error: error
    }
  }
})

// Create a slice
const appProjectSlice = createSlice({
  name: "appProjects",
  initialState: {
    projectItems: [],
    projectItem: initialProject,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanProjectMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    }
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
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getProjectList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getProject.pending, (state) => {
        state.projectItem = initialProject;
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.loading = true;
        state.projectItem = action.payload?.projectItem || initialProject;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getProject.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createProject.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projectItem = action.payload?.projectItem || initialProject;
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
        state.projectItem = action.payload?.projectItem || initialProject;
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
      })
  }
});

export const { cleanProjectMessage } = appProjectSlice.actions;

export default appProjectSlice.reducer;
