// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initCompanyComplianceControlItem } from "utility/reduxConstant";

async function getCompanyComplianceControlsListRequest(params) {
    return instance.get(`${API_ENDPOINTS.companyComplianceControls.list}`, { params })
        .then((items) => items.data).catch((error) => error)
}

export const getCompanyComplianceControlsList = createAsyncThunk("appCompanyComplianceControls/getCompanyComplianceControlsList", async (params) => {
    try {
        const response = await getCompanyComplianceControlsListRequest(params);
        if (response && response.flag) {
            return {
                params,
                companyComplianceControlItems: response?.data || [],
                pagination: response?.pagination || null,
                actionFlag: "CMPN_CONTRLS_LST",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                companyComplianceControlItems: [],
                actionFlag: "CMPN_CONTRLS_LST_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            companyComplianceControlItems: [],
            actionFlag: "CMPN_CONTRLS_LST_ERR",
            success: "",
            error: error
        }
    }
})

async function getCompanyComplianceControlRequest(params) {
    return instance.get(`${API_ENDPOINTS.companyComplianceControls.get}/${params?.id}`)
        .then((items) => items.data).catch((error) => error)
}

export const getCompanyComplianceControl = createAsyncThunk("appCompanyComplianceControls/getCompanyComplianceControl", async (params) => {
    try {
        const response = await getCompanyComplianceControlRequest(params);
        if (response && response.flag) {
            return {
                companyComplianceControlItem: response.data,
                actionFlag: "CMPN_CONTRL_ITM",
                success: "",
                error: ""
            }
        } else {
            return {
                companyComplianceControlItem: null,
                actionFlag: "CMPN_CONTRL_ITM_ERR",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        return {
            companyComplianceControlItem: null,
            actionFlag: "CMPN_CONTRL_ITM_ERR",
            success: "",
            error: error
        }
    }
})

async function createCompanyComplianceControlRequest(payload) {
    return instance.post(`${API_ENDPOINTS.companyComplianceControls.create}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const createCompanyComplianceControl = createAsyncThunk("appCompanyComplianceControls/createCompanyComplianceControl", async (payload) => {
    try {
        const response = await createCompanyComplianceControlRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                companyComplianceControlItem: response.data || null,
                actionFlag: "CMPN_CONTRL_CRET",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                actionFlag: "CMPN_CONTRL_CRET_ERR",
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

async function updateCompanyComplianceControlRequest(payload) {
    return instance.put(`${API_ENDPOINTS.companyComplianceControls.update}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const updateCompanyComplianceControl = createAsyncThunk("appCompanyComplianceControls/updateCompanyComplianceControl", async (payload) => {
    try {
        const response = await updateCompanyComplianceControlRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                companyComplianceControlItem: response.data || null,
                actionFlag: "CMPN_CONTRL_UPDT",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                actionFlag: "CMPN_CONTRL_UPDT_ERR",
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

async function deleteCompanyComplianceControlRequest(id) {
    return instance.delete(`${API_ENDPOINTS.companyComplianceControls.delete}/${id}`)
        .then((items) => items.data).catch((error) => error)
}

export const deleteCompanyComplianceControl = createAsyncThunk("appCompanyComplianceControls/deleteCompanyComplianceControl", async (id) => {
    try {
        const response = await deleteCompanyComplianceControlRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "CMPN_CONTRL_DLT",
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

async function getCompanyComplianceControlListRequest(params) {
    return instance.get(`${API_ENDPOINTS.companyComplianceControls.lists}`, { params })
        .then((items) => items.data).catch((error) => error)
}

export const getCompanyComplianceControlList = createAsyncThunk("appCompanyComplianceControls/getCompanyComplianceControlList", async (params) => {
    try {
        const response = await getCompanyComplianceControlListRequest(params);
        const companyCompControlData = {
            data: response?.data || null,
            compliancePriority: response?.compliancePriority || null,
            compliancePriorities: response?.compliancePriorities || []
        }

        if (response && response.flag) {
            return {
                params,
                companyComplianceControlData: companyCompControlData,
                companyFrameworkList: response?.frameworks || [],
                actionFlag: "CMPN_CONTRL_LST",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                companyComplianceControlData: companyCompControlData,
                companyFrameworkList: [],
                actionFlag: "CMPN_CONTRL_LST_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            companyComplianceControlData: null,
            companyFrameworkList: [],
            actionFlag: "CMPN_CONTRL_LST_ERR",
            success: "",
            error: error
        }
    }
})

async function createMultipleCompanyComplianceControlRequest(payload) {
    return instance.post(`${API_ENDPOINTS.companyComplianceControls.creates}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const createMultipleCompanyComplianceControl = createAsyncThunk("appCompanyComplianceControls/createMultipleCompanyComplianceControl", async (params) => {
    try {
        const response = await createMultipleCompanyComplianceControlRequest(params);
        const companyCompControlData = {
            data: response?.data || null
        }

        if (response && response.flag) {
            return {
                companyComplianceControlData: companyCompControlData,
                companyFrameworkList: response?.frameworks || [],
                actionFlag: "MULTIPLE_CREATED",
                success: response.message,
                error: "",
            };
        } else {
            return {
                companyComplianceControlData: companyCompControlData,
                companyFrameworkList: [],
                actionFlag: "MULTIPLE_CREATED_ERROR",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            companyComplianceControlData: null,
            companyFrameworkList: [],
            actionFlag: "MULTIPLE_CREATED_ERROR",
            success: "",
            error: error,
        };
    }
})

async function updateMultipleCompanyComplianceControlRequest(payload) {
    return instance.post(`${API_ENDPOINTS.companyComplianceControls.updates}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const updateMultipleCompanyComplianceControl = createAsyncThunk("appCompanyComplianceControls/updateMultipleCompanyComplianceControl", async (params) => {
    try {
        const response = await updateMultipleCompanyComplianceControlRequest(params);
        if (response && response.flag) {
            return {
                actionFlag: "CCC_MNY_UPDT",
                success: response.message,
                error: "",
            };
        } else {
            return {
                actionFlag: "CCC_MNY_UPDT_ERR",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            actionFlag: "CCC_MNY_UPDT_ERR",
            success: "",
            error: error,
        };
    }
})

// Create a slice
const appAuthSlice = createSlice({
    name: 'appCompanyComplianceControls',
    initialState: {
        companyFrameworkList: [],
        companyComplianceControlData: null,
        companyComplianceControlItems: [],
        companyComplianceControlItem: initCompanyComplianceControlItem,
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
            .addCase(getCompanyComplianceControlsList.pending, (state) => {
                state.companyComplianceControlItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getCompanyComplianceControlsList.fulfilled, (state, action) => {
                state.companyComplianceControlItems = action.payload?.companyComplianceControlItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getCompanyComplianceControlsList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getCompanyComplianceControl.pending, (state) => {
                state.companyComplianceControlItem = initCompanyComplianceControlItem;
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getCompanyComplianceControl.fulfilled, (state, action) => {
                state.companyComplianceControlItem = action.payload?.companyComplianceControlItem || initCompanyComplianceControlItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getCompanyComplianceControl.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createCompanyComplianceControl.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createCompanyComplianceControl.fulfilled, (state, action) => {
                state.companyComplianceControlItem = action.payload?.companyComplianceControlItem || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createCompanyComplianceControl.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateCompanyComplianceControl.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateCompanyComplianceControl.fulfilled, (state, action) => {
                state.companyComplianceControlItem = action.payload?.companyComplianceControlItem || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateCompanyComplianceControl.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteCompanyComplianceControl.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteCompanyComplianceControl.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteCompanyComplianceControl.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getCompanyComplianceControlList.pending, (state) => {
                state.companyComplianceControlData = null;
                state.companyFrameworkList = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getCompanyComplianceControlList.fulfilled, (state, action) => {
                state.companyComplianceControlData = action.payload?.companyComplianceControlData || null;
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
                state.companyComplianceControlData = null;
                state.companyFrameworkList = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createMultipleCompanyComplianceControl.fulfilled, (state, action) => {
                state.companyComplianceControlData = action.payload?.companyComplianceControlData || null;
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
            .addCase(updateMultipleCompanyComplianceControl.pending, (state) => {
                state.companyComplianceControlData = null;
                state.companyFrameworkList = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateMultipleCompanyComplianceControl.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateMultipleCompanyComplianceControl.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
});

export const {
    cleanCompanyComplianceControlMessage
} = appAuthSlice.actions;

export default appAuthSlice.reducer;
