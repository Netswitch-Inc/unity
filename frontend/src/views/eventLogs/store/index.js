// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getEventLogListRequest(params) {
    return instance.get(`${API_ENDPOINTS.eventLog.listing}`, { params })
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

// Create a slice
const appAuthSlice = createSlice({
    name: 'appEventLogs',
    initialState: {
        eventLogItems: [],
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
    }

});

export const {
    cleanEventLogMessage,
} = appAuthSlice.actions;

export default appAuthSlice.reducer;
