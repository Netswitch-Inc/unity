// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

// import { initHistoryItem } from "utility/reduxConstant";

async function getHistoryListRequest(params) {
  return instance.get(`${API_ENDPOINTS.histories.list}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getHistoryList = createAsyncThunk("appHistories/getHistoryList", async (params) => {
  try {
    const response = await getHistoryListRequest(params);
    if (response && response.flag) {
      return {
        params,
        historyItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "HISTRY_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        historyItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      historyItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getHistoryRequest(params) {
  return instance.get(`${API_ENDPOINTS.histories.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getHistory = createAsyncThunk("appHistories/getHistory", async (params) => {
  try {
    const response = await getHistoryRequest(params);
    if (response && response.flag) {
      return {
        historyItem: response.data,
        actionFlag: "HISTRY_ITM",
        success: "",
        error: ""
      }
    } else {
      return {
        historyItem: null,
        actionFlag: "HISTRY_ITM_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      historyItem: null,
      actionFlag: "HISTRY_ITM_ERR",
      success: "",
      error: error
    }
  }
})

async function createHistoryRequest(payload) {
  return instance.post(`${API_ENDPOINTS.histories.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createHistory = createAsyncThunk("appHistories/createHistory", async (payload) => {
  try {
    const response = await createHistoryRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        historyItem: response.data || null,
        actionFlag: "HISTRY_CRTD_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "HISTRY_CRTD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "HISTRY_CRTD_ERR",
      success: "",
      error: error
    }
  }
})

async function updateHistoryRequest(payload) {
  return instance.put(`${API_ENDPOINTS.histories.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateHistory = createAsyncThunk("appHistories/updateHistory", async (payload) => {
  try {
    const response = await updateHistoryRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        historyItem: response.data || null,
        actionFlag: "HISTRY_UPDT",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "HISTRY_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "HISTRY_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function deleteHistoryRequest(id) {
  return instance.delete(`${API_ENDPOINTS.histories.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteHistory = createAsyncThunk("appHistories/deleteHistory", async (id) => {
  try {
    const response = await deleteHistoryRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "HISTRY_DLT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        id,
        actionFlag: "HISTRY_DLT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      id,
      actionFlag: "HISTRY_DLT_ERR",
      success: "",
      error: error
    }
  }
})

// Create a slice
const appHistorySlice = createSlice({
  name: "appHistories",
  initialState: {
    historyItems: [],
    historyItem: '',
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanHistoryMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHistoryList.pending, (state) => {
        state.historyItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getHistoryList.fulfilled, (state, action) => {
        state.historyItems = action.payload?.historyItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getHistoryList.rejected, (state) => {
        state.historyItem = null;
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getHistory.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.historyItem = action.payload?.historyItem || null;
        state.loading = true;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getHistory.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createHistory.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createHistory.fulfilled, (state, action) => {
        state.historyItem = action.payload?.historyItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createHistory.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateHistory.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateHistory.fulfilled, (state, action) => {
        state.historyItem = action.payload?.historyItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateHistory.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteHistory.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteHistory.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  }
});

export const { cleanHistoryMessage } = appHistorySlice.actions;

export default appHistorySlice.reducer;
