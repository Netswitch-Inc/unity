// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

// import { initialHistory } from "utility/reduxConstant";

async function getHistoryListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.History.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getHistoryList = createAsyncThunk(
  "appHistory/getHistoryList",
  async (params) => {
    try {
      const response = await getHistoryListRequest(params);
      if (response && response.flag) {
        return {
          params,
          historyItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          historyItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        historyItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.History.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editHistoryRequest = createAsyncThunk(
  "appHistory/editHistorys",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          historyItem: response.data,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          historyItem: null,
          actionFlag: "",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        historyItem: null,
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function createHistoryRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.History.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createHistory = createAsyncThunk(
  "appHistory/createHistory",
  async (payload) => {
    try {
      const response = await createHistoryRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          historyItem: response.data || null,
          actionFlag: "HISTORY_CREATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "HISTORY_CREATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "HISTORY_CREATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateHistoryRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.History.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateHistory = createAsyncThunk(
  "appHistory/updateHistory",
  async (payload) => {
    try {
      const response = await updateHistoryRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          historyItem: response.data || null,
          actionFlag: "HISTORY_UPDATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "HISTORY_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "HISTORY_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteHistoryRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.History.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteHistory = createAsyncThunk(
  "appHistory/deleteHistory",
  async (id) => {
    try {
      const response = await deleteHistoryRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "HISTORY_DELETED_SUCCSESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          id,
          actionFlag: "HISTORY_DELETED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        id,
        actionFlag: "HISTORY_DELETED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

// Create a slice
const appAuthSlice = createSlice({
  name: "appHistory",
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
        state.actionFlag = action.payload?.actionFlag || "HISTORY_LISTING";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getHistoryList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(editHistoryRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.historyItem = action.payload.historyItem;
        state.success = action.payload.success;
        state.error = action.payload.error;
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
  },
});

export const { cleanHistoryMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
