// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initConfigurationAssessmentItem } from "utility/reduxConstant";

async function getConfigurationAssessmentListRequest(params) {
    return instance.get(`${API_ENDPOINTS.configurationAssessments.list}`, { params })
        .then((items) => items.data)
        .catch((error) => error)
}

export const getConfigurationAssessmentList = createAsyncThunk("appConfigurationAssessments/getConfigurationAssessmentList", async (params) => {
    try {
        const response = await getConfigurationAssessmentListRequest(params);
        if (response && response.flag) {
            return {
                params,
                configurationAssessmentItems: response?.data || [],
                pagination: response?.pagination || null,
                actionFlag: "CNFG_ASSMT_LST",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                configurationAssessmentItems: [],
                actionFlag: "CNFG_ASSMT_LST_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            configurationAssessmentItems: [],
            actionFlag: "CNFG_ASSMT_LST_ERR",
            success: "",
            error: error
        }
    }
})

async function getConfigurationAssessmentRequest(params) {
    return instance.get(`${API_ENDPOINTS.configurationAssessments.get}/${params?.id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const getConfigurationAssessment = createAsyncThunk("appConfigurationAssessments/editConfigurationAssessments", async (params) => {
    try {
        const response = await getConfigurationAssessmentRequest(params);
        if (response && response.flag) {
            return {
                configurationAssessmentItem: response.data,
                actionFlag: "CNFG_ASSMT_ITM",
                success: "",
                error: "",
            }
        } else {
            return {
                configurationAssessmentItem: null,
                actionFlag: "CNFG_ASSMT_ITM_ERR",
                success: "",
                error: "",
            }
        }
    } catch (error) {
        return {
            configurationAssessmentItem: null,
            actionFlag: "CNFG_ASSMT_ITM_ERR",
            success: "",
            error: error
        }
    }
})

async function createConfigurationAssessmentRequest(payload) {
    return instance.post(`${API_ENDPOINTS.configurationAssessments.create}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const createConfigurationAssessment = createAsyncThunk("appConfigurationAssessments/createConfigurationAssessment", async (payload) => {
    try {
        const response = await createConfigurationAssessmentRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                configurationAssessmentItem: response.data || null,
                actionFlag: "CNFG_ASSMT_CRET",
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

async function updateConfigurationAssessmentRequest(payload) {
    return instance.put(`${API_ENDPOINTS.configurationAssessments.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const updateConfigurationAssessment = createAsyncThunk("appConfigurationAssessments/updateConfigurationAssessment", async (payload) => {
    try {
        const response = await updateConfigurationAssessmentRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                configurationAssessmentItem: response.data || null,
                actionFlag: "CNFG_ASSMT_UPDT",
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

async function deleteConfigurationAssessmentRequest(id) {
    return instance.delete(`${API_ENDPOINTS.configurationAssessments.delete}/${id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const deleteConfigurationAssessment = createAsyncThunk("appConfigurationAssessments/deleteConfigurationAssessment", async (id) => {
    try {
        const response = await deleteConfigurationAssessmentRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "CNFG_ASSMT_DLT",
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
const appConfigurationAssessment = createSlice({
    name: 'appConfigurationAssessments',
    initialState: {
        configurationAssessmentItems: [],
        pagination: null,
        configurationAssessmentItem: initConfigurationAssessmentItem,
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanConfigurationAssessmentMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getConfigurationAssessmentList.pending, (state) => {
                state.configurationAssessmentItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getConfigurationAssessmentList.fulfilled, (state, action) => {
                state.configurationAssessmentItems = action.payload?.configurationAssessmentItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getConfigurationAssessmentList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getConfigurationAssessment.pending, (state) => {
                state.configurationAssessmentItem = initConfigurationAssessmentItem;
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getConfigurationAssessment.fulfilled, (state, action) => {
                state.configurationAssessmentItem = action.payload?.configurationAssessmentItem || initConfigurationAssessmentItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getConfigurationAssessment.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createConfigurationAssessment.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createConfigurationAssessment.fulfilled, (state, action) => {
                state.configurationAssessmentItem = action.payload?.configurationAssessmentItem || initConfigurationAssessmentItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createConfigurationAssessment.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateConfigurationAssessment.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateConfigurationAssessment.fulfilled, (state, action) => {
                state.configurationAssessmentItem = action.payload?.configurationAssessmentItem || initConfigurationAssessmentItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateConfigurationAssessment.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteConfigurationAssessment.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteConfigurationAssessment.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteConfigurationAssessment.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})

export const {
    cleanConfigurationAssessmentMessage,
} = appConfigurationAssessment.actions;

export default appConfigurationAssessment.reducer;
