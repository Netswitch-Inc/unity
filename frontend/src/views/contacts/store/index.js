// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function toolSolutionContactRequest(payload) {
    return instance.post(`${API_ENDPOINTS.contacts.toolSolution}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const toolSolutionContact = createAsyncThunk("appContacts/toolSolutionContact", async (payload) => {
    try {
        const response = await toolSolutionContactRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                actionFlag: "TOOL_SOL_CONT",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                actionFlag: "TOOL_SOL_CONT_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            payload,
            actionFlag: "TOOL_SOL_CONT_ERR",
            success: "",
            error: error
        }
    }
})

// Create a slice
const appContact = createSlice({
    name: 'appContacts',
    initialState: {
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanContactMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(toolSolutionContact.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(toolSolutionContact.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(toolSolutionContact.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})

export const {
    cleanContactMessage,
} = appContact.actions;

export default appContact.reducer;
