// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initialConnectionItem } from "utility/reduxConstant";

async function getConnectionListRequest(params) {
  return instance.get(`${API_ENDPOINTS.connections.list}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getConnectionList = createAsyncThunk("appConnections/getConnectionList", async (params) => {
  try {
    const response = await getConnectionListRequest(params);
    if (response && response.flag) {
      return {
        params,
        connectionItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "CONN_LSTN",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        connectionItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      connectionItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getConnectionRequest(params) {
  return instance.get(`${API_ENDPOINTS.connections.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getConnection = createAsyncThunk("appConnections/getConnection", async (params) => {
  try {
    const response = await getConnectionRequest(params);
    if (response && response.flag) {
      return {
        connectionItem: response.data,
        actionFlag: "CONN_ITM",
        success: "",
        error: ""
      }
    } else {
      return {
        connectionItem: null,
        actionFlag: "CONN_ITM_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      connectionItem: null,
      actionFlag: "CONN_ITM_ERR",
      success: "",
      error: error
    }
  }
})

async function createConnectionRequest(payload) {
  return instance.post(`${API_ENDPOINTS.connections.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createConnection = createAsyncThunk("appConnections/createConnection", async (payload) => {
  try {
    const response = await createConnectionRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        connectionItem: response.data || null,
        actionFlag: "CONN_CRET",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function updateConnectionRequest(payload) {
  return instance.put(`${API_ENDPOINTS.connections.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateConnection = createAsyncThunk("appConnections/updateConnection", async (payload) => {
  try {
    const response = await updateConnectionRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        connectionItem: response.data || null,
        actionFlag: "CONN_UPDT",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "CONN_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function deleteConnectionRequest(id) {
  return instance.delete(`${API_ENDPOINTS.connections.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteConnection = createAsyncThunk("appConnections/deleteConnection", async (id) => {
  try {
    const response = await deleteConnectionRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "CONN_DLT",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        id,
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      id,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

// Create a slice
const appAuthSlice = createSlice({
  name: "appConnections",
  initialState: {
    connectionItems: [],
    connectionItem: initialConnectionItem,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanConnectionMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConnectionList.pending, (state) => {
        state.connectionItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getConnectionList.fulfilled, (state, action) => {
        state.connectionItems = action.payload?.connectionItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getConnectionList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getConnection.pending, (state) => {
        state.connectionItem = initialConnectionItem;
        state.loading = false;
        state.actionFlag = "";
        state.success = "";
        state.error = "";
      })
      .addCase(getConnection.fulfilled, (state, action) => {
        state.connectionItem = action.payload?.connectionItem || initialConnectionItem;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getConnection.rejected, (state) => {
        state.loading = true;
        state.actionFlag = "";
        state.success = "";
        state.error = "";
      })
      .addCase(createConnection.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createConnection.fulfilled, (state, action) => {
        state.connectionItem = action.payload?.connectionItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createConnection.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateConnection.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateConnection.fulfilled, (state, action) => {
        state.connectionItem = action.payload?.connectionItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateConnection.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteConnection.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteConnection.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteConnection.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  }
})

export const { cleanConnectionMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
