// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initAgentItem } from "utility/reduxConstant";

async function getAgentListRequest(params) {
    return instance.get(`${API_ENDPOINTS.agents.list}`, { params })
        .then((items) => items.data)
        .catch((error) => error)
}

export const getAgentList = createAsyncThunk("appAgents/getAgentList", async (params) => {
    try {
        const response = await getAgentListRequest(params);
        if (response && response.flag) {
            return {
                params,
                agentItems: response?.data || [],
                pagination: response?.pagination || null,
                actionFlag: "AGNT_LST",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                agentItems: [],
                actionFlag: "AGNT_LST_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            agentItems: [],
            actionFlag: "AGNT_LST_ERR",
            success: "",
            error: error
        }
    }
})

async function getAgentRequest(params) {
    return instance.get(`${API_ENDPOINTS.agents.get}/${params?.id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const getAgent = createAsyncThunk("appAgents/editAgents", async (params) => {
    try {
        const response = await getAgentRequest(params);
        if (response && response.flag) {
            return {
                agentItem: response.data,
                actionFlag: "AGNT_ITM",
                success: "",
                error: "",
            }
        } else {
            return {
                agentItem: null,
                actionFlag: "AGNT_ITM_ERR",
                success: "",
                error: "",
            }
        }
    } catch (error) {
        return {
            agentItem: null,
            actionFlag: "AGNT_ITM_ERR",
            success: "",
            error: error
        }
    }
})

async function createAgentRequest(payload) {
    return instance.post(`${API_ENDPOINTS.agents.create}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const createAgent = createAsyncThunk("appAgents/createAgent", async (payload) => {
    try {
        const response = await createAgentRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                agentItem: response.data || null,
                actionFlag: "AGNT_CRET",
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

async function updateAgentRequest(payload) {
    return instance.put(`${API_ENDPOINTS.agents.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const updateAgent = createAsyncThunk("appAgents/updateAgent", async (payload) => {
    try {
        const response = await updateAgentRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                agentItem: response.data || null,
                actionFlag: "AGNT_UPDT",
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

async function deleteAgentRequest(id) {
    return instance.delete(`${API_ENDPOINTS.agents.delete}/${id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const deleteAgent = createAsyncThunk("appAgents/deleteAgent", async (id) => {
    try {
        const response = await deleteAgentRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "AGNT_DLT",
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
const appAgent = createSlice({
    name: 'appAgents',
    initialState: {
        agentItems: [],
        pagination: null,
        agentItem: initAgentItem,
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanAgentMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAgentList.pending, (state) => {
                state.agentItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getAgentList.fulfilled, (state, action) => {
                state.agentItems = action.payload?.agentItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getAgentList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getAgent.pending, (state) => {
                state.agentItem = initAgentItem;
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getAgent.fulfilled, (state, action) => {
                state.agentItem = action.payload?.agentItem || initAgentItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getAgent.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createAgent.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createAgent.fulfilled, (state, action) => {
                state.agentItem = action.payload?.agentItem || initAgentItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createAgent.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateAgent.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateAgent.fulfilled, (state, action) => {
                state.agentItem = action.payload?.agentItem || initAgentItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateAgent.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteAgent.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteAgent.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteAgent.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})

export const {
    cleanAgentMessage,
} = appAgent.actions;

export default appAgent.reducer;
