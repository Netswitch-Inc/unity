// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initNetswitchThreatIntelItem } from "utility/reduxConstant";

async function getNetswitchThreatIntelListRequest(params) {
    return instance.get(`${API_ENDPOINTS.netswitchThreatIntels.list}`, { params })
        .then((items) => items.data).catch((error) => error)
}

export const getNetswitchThreatIntelList = createAsyncThunk("appNetswitchThreatIntels/getNetswitchThreatIntelList", async (params) => {
    try {
        const response = await getNetswitchThreatIntelListRequest(params);
        if (response && response.flag) {
            return {
                params,
                netswitchThreatIntelItems: response?.data || [],
                pagination: response?.pagination || null,
                threatCountries: response?.countries || [],
                selectedCountry: response?.selectedCountry || "",
                actionFlag: "NTSWT_THRT_INTL_LST",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                netswitchThreatIntelItems: [],
                threatCountries: [],
                selectedCountry: "",
                actionFlag: "NTSWT_THRT_INTL_LST_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            netswitchThreatIntelItems: [],
            threatCountries: [],
            selectedCountry: "",
            actionFlag: "NTSWT_THRT_INTL_LST_ERR",
            success: "",
            error: error
        }
    }
})

async function getNetswitchThreatIntelRequest(params) {
    return instance.get(`${API_ENDPOINTS.netswitchThreatIntels.get}/${params?.id}`)
        .then((items) => items.data).catch((error) => error)
}

export const getNetswitchThreatIntel = createAsyncThunk("appNetswitchThreatIntels/editNetswitchThreatIntels", async (params) => {
    try {
        const response = await getNetswitchThreatIntelRequest(params);
        if (response && response.flag) {
            return {
                netswitchThreatIntelItem: response.data,
                actionFlag: "NTSWT_THRT_INTL_ITM",
                success: "",
                error: "",
            }
        } else {
            return {
                netswitchThreatIntelItem: null,
                actionFlag: "NTSWT_THRT_INTL_ITM_ERR",
                success: "",
                error: "",
            }
        }
    } catch (error) {
        return {
            netswitchThreatIntelItem: null,
            actionFlag: "NTSWT_THRT_INTL_ITM_ERR",
            success: "",
            error: error
        }
    }
})

async function createNetswitchThreatIntelRequest(payload) {
    return instance.post(`${API_ENDPOINTS.netswitchThreatIntels.create}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const createNetswitchThreatIntel = createAsyncThunk("appNetswitchThreatIntels/createNetswitchThreatIntel", async (payload) => {
    try {
        const response = await createNetswitchThreatIntelRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                netswitchThreatIntelItem: response.data || null,
                actionFlag: "NTSWT_THRT_INTL_CRET",
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

async function updateNetswitchThreatIntelRequest(payload) {
    return instance.put(`${API_ENDPOINTS.netswitchThreatIntels.update}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const updateNetswitchThreatIntel = createAsyncThunk("appNetswitchThreatIntels/updateNetswitchThreatIntel", async (payload) => {
    try {
        const response = await updateNetswitchThreatIntelRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                netswitchThreatIntelItem: response.data || null,
                actionFlag: "NTSWT_THRT_INTL_UPDT",
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

async function deleteNetswitchThreatIntelRequest(id) {
    return instance.delete(`${API_ENDPOINTS.netswitchThreatIntels.delete}/${id}`)
        .then((items) => items.data).catch((error) => error)
}

export const deleteNetswitchThreatIntel = createAsyncThunk("appNetswitchThreatIntels/deleteNetswitchThreatIntel", async (id) => {
    try {
        const response = await deleteNetswitchThreatIntelRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "NTSWT_THRT_INTL_DLT",
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
const appNetswitchThreatIntel = createSlice({
    name: 'appNetswitchThreatIntels',
    initialState: {
        netswitchThreatIntelItems: [],
        pagination: null,
        threatCountries: [],
        selectedCountry: "",
        netswitchThreatIntelItem: initNetswitchThreatIntelItem,
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanNetswitchThreatIntelMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNetswitchThreatIntelList.pending, (state) => {
                state.netswitchThreatIntelItems = [];
                state.threatCountries = [];
                state.selectedCountry = "";
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getNetswitchThreatIntelList.fulfilled, (state, action) => {
                state.netswitchThreatIntelItems = action.payload?.netswitchThreatIntelItems || [];
                state.pagination = action.payload?.pagination || null;
                state.threatCountries = action.payload?.threatCountries || [];
                state.selectedCountry = action.payload?.selectedCountry || "";
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getNetswitchThreatIntelList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getNetswitchThreatIntel.pending, (state) => {
                state.netswitchThreatIntelItem = initNetswitchThreatIntelItem;
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getNetswitchThreatIntel.fulfilled, (state, action) => {
                state.netswitchThreatIntelItem = action.payload?.netswitchThreatIntelItem || initNetswitchThreatIntelItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getNetswitchThreatIntel.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createNetswitchThreatIntel.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createNetswitchThreatIntel.fulfilled, (state, action) => {
                state.netswitchThreatIntelItem = action.payload?.netswitchThreatIntelItem || initNetswitchThreatIntelItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createNetswitchThreatIntel.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateNetswitchThreatIntel.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateNetswitchThreatIntel.fulfilled, (state, action) => {
                state.netswitchThreatIntelItem = action.payload?.netswitchThreatIntelItem || initNetswitchThreatIntelItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateNetswitchThreatIntel.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteNetswitchThreatIntel.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteNetswitchThreatIntel.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteNetswitchThreatIntel.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})

export const {
    cleanNetswitchThreatIntelMessage,
} = appNetswitchThreatIntel.actions;

export default appNetswitchThreatIntel.reducer;
