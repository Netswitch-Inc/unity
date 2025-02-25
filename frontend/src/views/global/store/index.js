// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getGlobalSettingsListRequest(params) {
    return instance.get(`${API_ENDPOINTS.globalSettings.lists}`, { params })
        .then((items) => items.data)
        .catch((error) => error);
}

export const getGlobalSettingsList = createAsyncThunk("appGlobalSettings/getGlobalSettingsList", async (params) => {
    try {
        const response = await getGlobalSettingsListRequest(params);
        if (response && response.flag) {
            return {
                params,
                globalSettingsList: response?.data || [],
                actionFlag: "GBL_STING_LST",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                globalSettingsList: [],
                actionFlag: "GBL_STING_LST_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            globalSettingsList: [],
            actionFlag: "GBL_STING_LST_ERR",
            success: "",
            error: error
        }
    }
})

async function updateGlobalSettingsRequest(payload) {
    return instance.put(`${API_ENDPOINTS.globalSettings.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const updateGlobalSettingsList = createAsyncThunk("appGlobalSettings/updateGlobalSettings", async (payload) => {
    try {
        const response = await updateGlobalSettingsRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                actionFlag: "UPDT_GBL_STING",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                actionFlag: "UPDT_GBL_STING_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            payload,
            actionFlag: "UPDT_GBL_STING_ERR",
            success: "",
            error: error
        }
    }
})

// Create a slice
const appAuthSlice = createSlice({
    name: 'appGlobalSettings',
    initialState: {
        globalSettingsList: [],
        settingItem: null,
        pagination: null,
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanGlobalSettingMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGlobalSettingsList.pending, (state) => {
                state.globalSettingsList = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getGlobalSettingsList.fulfilled, (state, action) => {
                state.globalSettingsList = action.payload?.globalSettingsList || [];
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getGlobalSettingsList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateGlobalSettingsList.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateGlobalSettingsList.fulfilled, (state, action) => {
                state.settingItem = action.payload?.settingItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag;
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateGlobalSettingsList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})

export const {
    cleanGlobalSettingMessage
} = appAuthSlice.actions;

export default appAuthSlice.reducer;
