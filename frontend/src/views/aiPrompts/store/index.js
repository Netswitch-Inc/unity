// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function writeDescriptionWithAIRequest(payload) {
    return instance.post(`${API_ENDPOINTS.aiPrompts.writeDescription}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const writeDescriptionWithAI = createAsyncThunk("appAIPrompts/writeDescriptionWithAI", async (payload) => {
    try {
        const response = await writeDescriptionWithAIRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                aiDescriptionItems: response?.data || [],
                actionFlag: "WRT_AI_DEC_SCS",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                aiDescriptionItems: [],
                actionFlag: "WRT_AI_DEC_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            payload,
            aiDescriptionItems: [],
            actionFlag: "WRT_AI_DEC_ERR",
            success: "",
            error: error
        }
    }
})

// Create a slice
const appAIPrompt = createSlice({
    name: 'appAIPrompts',
    initialState: {
        aiDescriptionItems: [],
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanAIPromptMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(writeDescriptionWithAI.pending, (state) => {
                state.aiDescriptionItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(writeDescriptionWithAI.fulfilled, (state, action) => {
                state.aiDescriptionItems = action.payload?.aiDescriptionItems || [];
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(writeDescriptionWithAI.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})

export const {
    cleanAIPromptMessage,
} = appAIPrompt.actions;

export default appAIPrompt.reducer;
