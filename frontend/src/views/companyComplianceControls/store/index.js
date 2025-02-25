// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getCompanyComplianceControlListRequest(params) {
    return instance.get(`${API_ENDPOINTS.companyComplianceControls.lists}`, { params })
        .then((items) => items.data)
        .catch((error) => error);
}

export const getCompanyComplianceControlList = createAsyncThunk("appCompanyComplianceControls/getCompanyComplianceControlList", async (params) => {
    try {
        const response = await getCompanyComplianceControlListRequest(params);
        if (response && response.flag) {
            return {
                params,
                companyComplianceControlList: response?.data || [],
                companyFrameworkList: response?.frameworks || [],
                actionFlag: "CMPN_CONTRL_LST",
                success: "",
                error: ""
            };
        } else {
            return {
                params,
                companyComplianceControlList: [],
                companyFrameworkList: [],
                actionFlag: "",
                success: "",
                error: response.message
            };
        }
    } catch (error) {
        return {
            params,
            companyComplianceControlList: [],
            companyFrameworkList: [],
            actionFlag: "",
            success: "",
            error: error
        };
    }
});

async function createMultipleCompanyComplianceControlRequest(payload) {
    return instance.post(`${API_ENDPOINTS.companyComplianceControls.creates}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const createMultipleCompanyComplianceControl = createAsyncThunk("appCompanyComplianceControls/createMultipleCompanyComplianceControl", async (params) => {
    try {
        const response = await createMultipleCompanyComplianceControlRequest(params);
        if (response && response.flag) {
            return {
                companyComplianceControlList: response?.data || [],
                companyFrameworkList: response?.frameworks || [],
                actionFlag: "MULTIPLE_CREATED",
                success: response.message,
                error: "",
            };
        } else {
            return {
                companyComplianceControlList: [],
                companyFrameworkList: [],
                actionFlag: "MULTIPLE_CREATED_ERROR",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            companyComplianceControlList: [],
            companyFrameworkList: [],
            actionFlag: "MULTIPLE_CREATED_ERROR",
            success: "",
            error: error,
        };
    }
});

// Create a slice
const appAuthSlice = createSlice({
    name: 'appCompanyComplianceControls',
    initialState: {
        companyComplianceControlItems: [],
        companyComplianceControlList: [],
        companyFrameworkList: [],
        pagination: null,
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanCompanyComplianceControlMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCompanyComplianceControlList.pending, (state) => {
                state.companyComplianceControlList = [];
                state.companyFrameworkList = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getCompanyComplianceControlList.fulfilled, (state, action) => {
                state.companyComplianceControlList = action.payload?.companyComplianceControlList || [];
                state.companyFrameworkList = action.payload?.companyFrameworkList || [];
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getCompanyComplianceControlList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(createMultipleCompanyComplianceControl.pending, (state) => {
                state.companyComplianceControlList = [];
                state.companyFrameworkList = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createMultipleCompanyComplianceControl.fulfilled, (state, action) => {
                state.companyComplianceControlList = action.payload?.companyComplianceControlList || [];
                state.companyFrameworkList = action.payload?.companyFrameworkList || [];
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createMultipleCompanyComplianceControl.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }

});

export const {
    cleanCompanyComplianceControlMessage,
} = appAuthSlice.actions;

export default appAuthSlice.reducer;
