// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getControllerByFrameworkRequest(params) {
  return instance.get(`${API_ENDPOINTS.controls.listing}`, { params })
    .then((items) => items.data).catch((error) => error);
}

export const getListing = createAsyncThunk("appControls/getListing", async (params) => {
  try {
    const response = await getControllerByFrameworkRequest(params);
    if (response && response.flag) {
      return {
        controllerItems: response.data || [],
        pagination: response?.pagination || null,
        actionFlag: "CONTROLLER_LISTING",
        success: "",
        error: ""
      }
    } else {
      return {
        controllerItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      controllerItems: [],
      actionFlag: "",
      success: "",
      error: error.message
    }
  }
})

async function updateControlRequest(payload) {
  return instance.put(`${API_ENDPOINTS.controls.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateControl = createAsyncThunk("appControls/updateControl", async (payload) => {
  try {
    const response = await updateControlRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        actionFlag: "CNTRL_UPDT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "CNTRL_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "CNTRL_UPDT_ERR",
      success: "",
      error: error.message
    }
  }
})

// Create a slice
const appControlSlice = createSlice({
  name: "appControls",
  initialState: {
    controllerItems: [],
    controlItem: [],
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanControlMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListing.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getListing.fulfilled, (state, action) => {
        state.controllerItems = action.payload?.controllerItems || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getListing.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateControl.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateControl.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateControl.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
  },
});

export const { cleanControlMessage } = appControlSlice.actions;

export default appControlSlice.reducer;
