// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getControllerByFrameworkRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.controls.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getListing = createAsyncThunk(
  "appCompanys/getCompanyList",
  async (params) => {
    try {
      const response = await getControllerByFrameworkRequest(params);
      if (response && response.flag) {
        return {
          controllerItems: response.data || [],
          pagination: response?.pagination || null,
          actionFlag: "CONTROLLER_LISTING",
          success: "",
          error: "",
        };
      } else {
        return {
          controllerItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        controllerItems: [],
        actionFlag: "",
        success: "",
        error: error.message, // Ensure error message is string
      };
    }
  }
);

// Create a slice
const appAuthSlice = createSlice({
  name: "appFrameworks",
  initialState: {
    controllerItems: [],
    controlItem:[],
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanFrameworkMessage: (state) => {
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
      });
  },
});

export const { cleanFrameworkMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
