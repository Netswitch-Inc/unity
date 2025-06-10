import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "utility/AxiosConfig";
import { API_ENDPOINTS } from "utility/ApiEndPoints";

// Function to fetch CIS list
async function getCISListRequest() {
  return instance.get(`${API_ENDPOINTS.Cis.listingAll}`)
    .then((items) => items.data).catch((error) => ({ error }))
}

// Thunk for fetching CIS list
export const getCisListing = createAsyncThunk("appCis/getCis", async () => {
  try {
    const response = await getCISListRequest();
    if (response && response.flag) {
      return {
        cisItems: response?.data || [],
        actionFlag: "CIS_LISTING",
        success: "",
        error: ""
      }
    } else {
      return {
        cisItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      cisItems: [],
      actionFlag: "",
      success: "",
      error: error.message
    }
  }
})

async function getComplinceSubcontrol(params) {
  return instance.get(`${API_ENDPOINTS.Cis.listingSubcontrols}`, { params })
    .then((items) => items.data).catch((error) => ({ error }))
}

// Thunk for fetching CIS list
export const getComplinceSubcontrolListing = createAsyncThunk("appCis/getCisSubcontrolsListing", async (params) => {
  try {
    const response = await getComplinceSubcontrol(params);
    if (response && response.flag) {
      return {
        cisSubcontrol: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "CIS_SUB_CONTROLL",
        success: "",
        error: ""
      }
    } else {
      return {
        cisItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      cisItems: [],
      actionFlag: "",
      success: "",
      error: error.message
    }
  }
})

// Function to download file with progress
async function downloadFromStorageRequest(params, onProgress) {
  return instance.get(`${API_ENDPOINTS.Cis.download}`, {
    params,
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      const loaded = progressEvent.loaded;
      const total = progressEvent.total || loaded;
      const percentage = Math.round((loaded * 100) / total) || 0;
      if (onProgress) { onProgress(percentage) }
    },
  }).then((response) => response).catch((error) => ({ error }))
}

// Thunk for downloading file
export const downloadFromStorage = createAsyncThunk("appCis/Download", async (params, { dispatch }) => {
  let progress = 0;
  const onProgress = (percentage) => {
    progress = percentage;
    dispatch(updateDownloadProgress(progress))
  }

  try {
    const response = await downloadFromStorageRequest(params, onProgress);
    const extensionIndex = params.fileName.lastIndexOf(".html");
    const modifiedFilename = params.fileName.substring(0, extensionIndex + 5);

    // Create a download link and click it to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", modifiedFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (response && response.flag) {
      return {
        actionFlag: "DOWNLOAD_FILE",
        success: "",
        error: ""
      }
    } else {
      return {
        cisItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      cisItems: [],
      actionFlag: "",
      success: "",
      error: error.message
    }
  }
})

async function updateCisDataRequest(payload) {
  return instance.put(`${API_ENDPOINTS.Cis.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateCisData = createAsyncThunk("appCompanys/updateCisData", async (payload) => {
  try {
    const response = await updateCisDataRequest(payload);
    if (response && response.flag) {
      return {
        cisUpdateItem: response?.data || [],
        actionFlag: "UPDT_CIS_DATA",
        success: "SUCCESS",
        error: ""
      }
    } else {
      return {
        cisUpdateItem: [],
        actionFlag: "UPDT_CIS_DATA_ERROR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      cisUpdateItem: [],
      actionFlag: "UPDT_CIS_DATA_ERROR",
      success: "",
      error: error.message // Ensure error message is string
    }
  }
})

// Create a slice
const appAuthSlice = createSlice({
  name: "appCIS",
  initialState: {
    cisItems: [],
    cisUpdateItem: [],
    cisSubcontrol: [],
    downloadProgress: 0,
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanCISMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
    updateDownloadProgress: (state, action) => {
      state.downloadProgress = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCisListing.fulfilled, (state, action) => {
        state.cisItems = action.payload?.cisItems || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getComplinceSubcontrolListing.fulfilled, (state, action) => {
        state.type = "LISTING";
        state.cisSubcontrol = action.payload.cisSubcontrol || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true; // Change loading to false after data is fetched
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(downloadFromStorage.pending, (state, action) => {
        state.actionFlag = "Downloading";
      })
      .addCase(downloadFromStorage.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateCisData.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateCisData.fulfilled, (state, action) => {
        state.cisUpdateItem = action.payload?.cisUpdateItem;
        state.actionFlag = action.payload?.actionFlag || "";
        state.loading = true;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateCisData.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
  }
})

export const { cleanCISMessage, updateDownloadProgress } = appAuthSlice.actions;

export default appAuthSlice.reducer;
