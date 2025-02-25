// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initialConnectionItem } from "utility/reduxConstant";

async function getConnectionListRequest(params) {
    return instance.get(`${API_ENDPOINTS.Connection.listing}`, { params })
        .then((items) => items.data)
        .catch((error) => error);
}

export const getConnectionList = createAsyncThunk("appConnections/getConnectionList", async (params) => {
    try {
        const response = await getConnectionListRequest(params);
        if (response && response.flag) {
            return {
                params,
                ConnectionItems: response?.data || [],
                pagination: response?.pagination || null,
                actionFlag: "",
                success: "",
                error: ""
            };
        } else {
            return {
                params,
                ConnectionItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            };
        }
    } catch (error) {
        return {
            params,
            ConnectionItems: [],
            actionFlag: "",
            success: "",
            error: error
        };
    }
});

async function editRequest(params) {
    return instance.get(`${API_ENDPOINTS.Connection.edit}/${params?.id}`)
        .then((items) => items.data)
        .catch((error) => error);
}

export const editConnectionRequest = createAsyncThunk("appConnections/editConnections", async (params) => {
    try {
        const response = await editRequest(params);
        if (response && response.flag) {
            return {
                ConnectionItem: response.data,
                actionFlag: "",
                success: "",
                error: "",
            };
        } else {
            return {
                ConnectionItem: null,
                actionFlag: "",
                success: "",
                error: "",
            };
        }
    } catch (error) {
        return {
            ConnectionItem: null,
            actionFlag: "",
            success: "",
            error: error,
        };
    }
}
);

async function createConnectionRequest(payload) {
    return instance.post(`${API_ENDPOINTS.Connection.create}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const createConnection = createAsyncThunk("appConnections/createConnection", async (payload) => {
    try {
        const response = await createConnectionRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                ConnectionItem: response.data || null,
                actionFlag: "",
                success: response?.message || "",
                error: ""
            };
        } else {
            return {
                payload,
                actionFlag: "",
                success: "",
                error: response.message
            };
        }
    } catch (error) {
        return {
            payload,
            actionFlag: "",
            success: "",
            error: error
        };
    }
});

async function updateConnectionRequest(payload) {
    return instance.put(`${API_ENDPOINTS.Connection.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const updateConnection = createAsyncThunk("appConnections/updateConnection", async (payload) => {
    try {
        const response = await updateConnectionRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                ConnectionItem: response.data || null,
                actionFlag: "",
                success: response?.message || "",
                error: ""
            };
        } else {
            return {
                payload,
                actionFlag: "",
                success: "",
                error: response.message
            };
        }
    } catch (error) {
        return {
            payload,
            actionFlag: "",
            success: "",
            error: error
        };
    }
});

async function deleteConnectionRequest(id) {
    return instance.delete(`${API_ENDPOINTS.Connection.delete}/${id}`)
        .then((items) => items.data)
        .catch((error) => error);
}

export const deleteConnection = createAsyncThunk("appConnections/deleteConnection", async (id) => {
    try {
        const response = await deleteConnectionRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "",
                success: response?.message || "",
                error: ""
            };
        } else {
            return {
                id,
                actionFlag: "",
                success: "",
                error: response.message
            };
        }
    } catch (error) {
        return {
            id,
            actionFlag: "",
            success: "",
            error: error
        };
    }
});

// Create a slice
const appAuthSlice = createSlice({
    name: 'appConnections',
    initialState: {
        ConnectionItems: [],
        ConnectionItem: null,
        addConnectionItem: initialConnectionItem,
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
                state.ConnectionItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getConnectionList.fulfilled, (state, action) => {
                state.ConnectionItems = action.payload?.ConnectionItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "CONNECTION_LISTING";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getConnectionList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(editConnectionRequest.fulfilled, (state, action) => {
                state.type = 'EDIT';
                state.loading = true;
                state.ConnectionItem = action.payload.ConnectionItem;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(createConnection.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createConnection.fulfilled, (state, action) => {
                state.ConnectionItem = action.payload?.ConnectionItem || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "CONNECTION_CREATED";
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
                state.ConnectionItem = action.payload?.ConnectionItem || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "Connection_UPDATED";
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
                state.actionFlag = action.payload?.actionFlag || "Connection_DELETED";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteConnection.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    },

});

export const {
    cleanConnectionMessage,
} = appAuthSlice.actions;

export default appAuthSlice.reducer;