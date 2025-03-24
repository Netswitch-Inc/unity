// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initEventLogItem } from "utility/reduxConstant";

async function getEventLogListRequest(params) {
    return instance.get(`${API_ENDPOINTS.eventLogs.list}`, { params })
        .then((items) => items.data)
        .catch((error) => error)
}

export const getEventLogList = createAsyncThunk("appEventLogs/getEventLogList", async (params) => {
    try {
        const response = await getEventLogListRequest(params);
        if (response && response.flag) {
            return {
                params,
                eventLogItems: response?.data || [],
                pagination: response?.pagination || null,
                actionFlag: "EVNT_LOG_LISTING",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                eventLogItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            eventLogItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getEventLogRequest(params) {
    return instance.get(`${API_ENDPOINTS.eventLogs.get}/${params?.id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const getEventLog = createAsyncThunk("appCronSchedulers/getEventLog", async (params) => {
    try {
        const response = await getEventLogRequest(params);
        if (response && response.flag) {
            return {
                eventLogItem: response.data,
                actionFlag: "EVNT_LG_ITM",
                success: "",
                error: "",
            }
        } else {
            return {
                eventLogItem: null,
                actionFlag: "EVNT_LG_ITM_ERR",
                success: "",
                error: "",
            }
        }
    } catch (error) {
        return {
            eventLogItem: null,
            actionFlag: "EVNT_LG_ITM_ERR",
            success: "",
            error: error
        }
    }
})

// Create a slice
const appAuthSlice = createSlice({
    name: 'appEventLogs',
    initialState: {
        eventLogItems: [],
        eventLogItem: initEventLogItem,
        pagination: null,
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanEventLogMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEventLogList.pending, (state) => {
                state.eventLogItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getEventLogList.fulfilled, (state, action) => {
                state.eventLogItems = action.payload?.eventLogItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getEventLogList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getEventLog.pending, (state) => {
                state.eventLogItem = initEventLogItem;
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getEventLog.fulfilled, (state, action) => {
                state.eventLogItem = action.payload?.eventLogItem || initEventLogItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getEventLog.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }

});

export const {
    cleanEventLogMessage,
} = appAuthSlice.actions;

export default appAuthSlice.reducer;
