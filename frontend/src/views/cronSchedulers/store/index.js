// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initCronSchedulerItem } from "utility/reduxConstant";

async function getCronSchedulerListRequest(params) {
    return instance.get(`${API_ENDPOINTS.cronSchedulers.list}`, { params })
        .then((items) => items.data).catch((error) => error)
}

export const getCronSchedulerList = createAsyncThunk("appCronSchedulers/getCronSchedulerList", async (params) => {
    try {
        const response = await getCronSchedulerListRequest(params);
        if (response && response.flag) {
            return {
                params,
                cronSchedulerItems: response?.data || [],
                pagination: response?.pagination || null,
                cronSchedulerErrorItems: response?.cronSchedulerErrors || [],
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                cronSchedulerItems: [],
                cronSchedulerErrors: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            cronSchedulerItems: [],
            cronSchedulerErrors: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getCronSchedulerRequest(params) {
    return instance.get(`${API_ENDPOINTS.cronSchedulers.get}/${params?.id}`)
        .then((items) => items.data).catch((error) => error)
}

export const getCronScheduler = createAsyncThunk("appCronSchedulers/getCronScheduler", async (params) => {
    try {
        const response = await getCronSchedulerRequest(params);
        if (response && response.flag) {
            return {
                cronSchedulerItem: response.data,
                actionFlag: "CRN_SCH_ITM",
                success: "",
                error: "",
            }
        } else {
            return {
                cronSchedulerItem: null,
                actionFlag: "CRN_SCH_ITM_ERR",
                success: "",
                error: "",
            }
        }
    } catch (error) {
        return {
            cronSchedulerItem: null,
            actionFlag: "CRN_SCH_ITM_ERR",
            success: "",
            error: error
        }
    }
})

async function createCronSchedulerRequest(payload) {
    return instance.post(`${API_ENDPOINTS.cronSchedulers.create}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const createCronScheduler = createAsyncThunk("appCronSchedulers/createCronScheduler", async (payload) => {
    try {
        const response = await createCronSchedulerRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                cronSchedulerItem: response.data || null,
                actionFlag: "CRN_SCH_CRET",
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

async function updateCronSchedulerRequest(payload) {
    return instance.put(`${API_ENDPOINTS.cronSchedulers.update}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const updateCronScheduler = createAsyncThunk("appCronSchedulers/updateCronScheduler", async (payload) => {
    try {
        const response = await updateCronSchedulerRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                cronSchedulerItem: response.data || null,
                actionFlag: "CRN_SCH_UPDT",
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

async function deleteCronSchedulerRequest(id) {
    return instance.delete(`${API_ENDPOINTS.cronSchedulers.delete}/${id}`)
        .then((items) => items.data).catch((error) => error)
}

export const deleteCronScheduler = createAsyncThunk("appCronSchedulers/deleteCronScheduler", async (id) => {
    try {
        const response = await deleteCronSchedulerRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "CRN_SCH_DLT",
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

async function getCronSchedulerAlertWarningRequest(params) {
    return instance.get(`${API_ENDPOINTS.cronSchedulers.alertWarning}`, { params })
        .then((items) => items.data).catch((error) => error)
}

export const getCronSchedulerAlertWarning = createAsyncThunk("appCronSchedulers/getCronSchedulerAlertWarning", async (params) => {
    try {
        const response = await getCronSchedulerAlertWarningRequest(params);
        if (response && response.flag) {
            return {
                cronSchedulerErrorItems: response?.data || [],
                cronSchedulerItem: response?.cronScheduler || null,
                actionFlag: "CRN_SCH_ART_WRNG",
                success: "",
                error: ""
            }
        } else {
            return {
                cronSchedulerErrorItems: [],
                cronSchedulerItem: null,
                actionFlag: "CRN_SCH_ART_WRNG_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            cronSchedulerErrorItems: [],
            cronSchedulerItem: null,
            actionFlag: "CRN_SCH_ART_WRNG_ERR",
            success: "",
            error: error
        }
    }
})

// Create a slice
const appCronScheduler = createSlice({
    name: 'appCronSchedulers',
    initialState: {
        cronSchedulerItems: [],
        pagination: null,
        cronSchedulerErrorItems: [],
        cronSchedulerItem: initCronSchedulerItem,
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanCronSchedulerMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCronSchedulerList.pending, (state) => {
                state.cronSchedulerItems = [];
                state.cronSchedulerErrorItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getCronSchedulerList.fulfilled, (state, action) => {
                state.cronSchedulerItems = action.payload?.cronSchedulerItems || [];
                state.pagination = action.payload?.pagination || null;
                state.cronSchedulerErrorItems = action.payload?.cronSchedulerErrorItems || [];
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getCronSchedulerList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getCronScheduler.pending, (state) => {
                state.cronSchedulerItem = initCronSchedulerItem;
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getCronScheduler.fulfilled, (state, action) => {
                state.cronSchedulerItem = action.payload?.cronSchedulerItem || initCronSchedulerItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getCronScheduler.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createCronScheduler.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createCronScheduler.fulfilled, (state, action) => {
                state.cronSchedulerItem = action.payload?.cronSchedulerItem || initCronSchedulerItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createCronScheduler.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateCronScheduler.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateCronScheduler.fulfilled, (state, action) => {
                state.cronSchedulerItem = action.payload?.cronSchedulerItem || initCronSchedulerItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateCronScheduler.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteCronScheduler.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteCronScheduler.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteCronScheduler.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getCronSchedulerAlertWarning.pending, (state) => {
                state.cronSchedulerItem = initCronSchedulerItem;
                state.cronSchedulerErrorItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getCronSchedulerAlertWarning.fulfilled, (state, action) => {
                state.cronSchedulerItem = action.payload?.cronSchedulerItem || initCronSchedulerItem;
                state.cronSchedulerErrorItems = action.payload?.cronSchedulerErrorItems || [];
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getCronSchedulerAlertWarning.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})

export const {
    cleanCronSchedulerMessage,
} = appCronScheduler.actions;

export default appCronScheduler.reducer;
