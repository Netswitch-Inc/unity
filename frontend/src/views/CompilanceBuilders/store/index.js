// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getFrameworkListRequest(params) {
  return instance.get(`${API_ENDPOINTS.Framework.dropdown}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getFrameworkList = createAsyncThunk("appFrameworks/getFrameworkList", async (params) => {
  try {
    const response = await getFrameworkListRequest(params);
    if (response && response.flag) {
      return {
        frameworkItems: response?.data || [],
        actionFlag: "Framework_LISTING",
        success: "",
        error: ""
      }
    } else {
      return {
        frameworkItems: [],
        actionFlag: "Framework_LISTING_ERROR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      frameworkItems: [],
      actionFlag: "Framework_LISTING_ERROR",
      success: "",
      error: error
    }
  }
})

async function getControllerByFrameworkRequest(params) {
  return instance.get(`${API_ENDPOINTS.controls.listing}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getControllerListByFrameworkId = createAsyncThunk("appFrameworks/getControllerListByFrameworkId", async (params) => {
  try {
    const response = await getControllerByFrameworkRequest(params);
    if (response && response.flag) {
      return {
        controllerItem: response.data || [],
        complianceControlItems: response.data || [],
        pagination: response?.pagination || null,
        actionFlag: "CONTROL_VIA_FRAMEWORK_ID",
        success: "",
        error: ""
      }
    } else {
      return {
        controllerItem: [],
        actionFlag: "CONTROL_VIA_FRAMEWORK_ID_ERROR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      controllerItem: [],
      actionFlag: "CONTROL_VIA_FRAMEWORK_ID_ERROR",
      success: "",
      error: error.message // Ensure error message is string
    }
  }
})

// Create a slice
const appFrameworkSlice = createSlice({
  name: "appFrameworks",
  initialState: {
    frameworkItems: [],
    controllerItem: [],
    complianceControlItems: [],
    pagination: null,
    editItem: "",
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanFrameworkMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFrameworkList.pending, (state) => {
        state.frameworkItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getFrameworkList.fulfilled, (state, action) => {
        state.frameworkItems = action.payload?.frameworkItems || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getFrameworkList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getControllerListByFrameworkId.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getControllerListByFrameworkId.fulfilled, (state, action) => {
        state.controllerItem = action.payload?.controllerItem;
        state.complianceControlItems = action.payload?.complianceControlItems || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getControllerListByFrameworkId.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
  }
});

export const { cleanFrameworkMessage } = appFrameworkSlice.actions;

export default appFrameworkSlice.reducer;
