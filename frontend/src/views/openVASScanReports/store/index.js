// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initOpenVASScanReportItem } from "utility/reduxConstant";

async function getOpenVASScanReportListRequest(params) {
    return instance.get(`${API_ENDPOINTS.openVASScanReports.list}`, { params })
        .then((items) => items.data)
        .catch((error) => error)
}

export const getOpenVASScanReportList = createAsyncThunk("appOpenVASScanReport/getOpenVASScanReport", async (params) => {
    try {
        const response = await getOpenVASScanReportListRequest(params);
        if (response && response.flag) {
            return {
                params,
                openVASScanReportItems: response?.data || [],
                pagination: response?.pagination || null,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                openVASScanReportItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            openVASScanReportItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getOpenVASScanReportRequest(params) {
    return instance.get(`${API_ENDPOINTS.openVASScanReports.get}/${params?.id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const getOpenVASScanReport = createAsyncThunk("appOpenVASScanReport/editOpenVASScanReport", async (params) => {
    try {
        console.log("params : ", params);
        const response = await getOpenVASScanReportRequest(params);
        if (response && response.flag) {
            return {
                openVASScanReportItem: response.data,
                actionFlag: "OVSR_SCH_ITM",
                success: "",
                error: "",
            }
        } else {
            return {
                openVASScanReportItem: null,
                actionFlag: "OVSR_SCH_ITM_ERR",
                success: "",
                error: "",
            }
        }
    } catch (error) {
        return {
            openVASScanReportItem: null,
            actionFlag: "OVSR_SCH_ITM_ERR",
            success: "",
            error: error
        }
    }
})

async function createOpenVASScanReportRequest(payload) {
    return instance.post(`${API_ENDPOINTS.openVASScanReports.create}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const createOpenVASScanReport = createAsyncThunk("appOpenVASScanReport/createOpenVASScanReport", async (payload) => {
    try {
        const response = await createOpenVASScanReportRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                openVASScanReportItem: response.data || null,
                actionFlag: "OVSR_SCH_CRET",
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

async function insertOpenVASScanReportReq(payload) {
    return instance.post(`${API_ENDPOINTS.openVASScanReports.insert}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const insertOpenVASScanReport = createAsyncThunk("appOpenVASScanReport/insertOpenVASScanReport", async (payload) => {
    try {
        const response = await insertOpenVASScanReportReq(payload);
        if (response && response.flag) {
            return {
                payload,
                openVASScanReportItem: response.data || null,
                actionFlag: "OVSR_SCH_ISRT_MNLT",
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

async function updateOpenVASScanReportRequest(payload) {
    return instance.put(`${API_ENDPOINTS.openVASScanReports.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const updateOpenVASScanReport = createAsyncThunk("appOpenVASScanReport/updateOpenVASScanReport", async (payload) => {
    try {
        const response = await updateOpenVASScanReportRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                openVASScanReportItem: response.data || null,
                actionFlag: "OVSR_SCH_UPDT",
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

async function deleteOpenVASScanReportRequest(id) {
    return instance.delete(`${API_ENDPOINTS.openVASScanReports.delete}/${id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const deleteOpenVASScanReport = createAsyncThunk("appOpenVASScanReport/deleteOpenVASScanReport", async (id) => {
    try {
        const response = await deleteOpenVASScanReportRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "OVSR_SCH_DLT",
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
const appOpenVASScanReport = createSlice({
    name: 'appOpenVASScanReport',
    initialState: {
        openVASScanReportItems: [],
        pagination: null,
        openVASScanReportItem: initOpenVASScanReportItem,
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanOpenVASScanReportMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOpenVASScanReportList.pending, (state) => {
                state.openVASScanReportItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getOpenVASScanReportList.fulfilled, (state, action) => {
                state.openVASScanReportItems = action.payload?.openVASScanReportItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getOpenVASScanReportList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getOpenVASScanReport.pending, (state) => {
                state.openVASScanReportItem = initOpenVASScanReportItem;
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getOpenVASScanReport.fulfilled, (state, action) => {
                state.openVASScanReportItem = action.payload?.openVASScanReportItem || initOpenVASScanReportItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getOpenVASScanReport.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createOpenVASScanReport.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createOpenVASScanReport.fulfilled, (state, action) => {
                state.openVASScanReportItem = action.payload?.openVASScanReportItem || initOpenVASScanReportItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createOpenVASScanReport.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateOpenVASScanReport.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateOpenVASScanReport.fulfilled, (state, action) => {
                state.openVASScanReportItem = action.payload?.openVASScanReportItem || initOpenVASScanReportItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateOpenVASScanReport.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteOpenVASScanReport.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteOpenVASScanReport.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteOpenVASScanReport.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(insertOpenVASScanReport.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(insertOpenVASScanReport.fulfilled, (state, action) => {
                state.openVASScanReportItem = action.payload?.openVASScanReportItem || initOpenVASScanReportItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(insertOpenVASScanReport.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})

export const {
    cleanOpenVASScanReportMessage,
} = appOpenVASScanReport.actions;

export default appOpenVASScanReport.reducer;
