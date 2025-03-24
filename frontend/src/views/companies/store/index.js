import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../../utility/AxiosConfig';
import { API_ENDPOINTS } from 'utility/ApiEndPoints';
import { initCompanyItem } from 'utility/reduxConstant';

async function getCompanyListRequest(params) {
    return instance.get(`${API_ENDPOINTS.companies.list}`, { params })
        .then((items) => items.data).catch((error) => error)
}

export const getCompanyList = createAsyncThunk("appCompanies/getCompanyList", async (params) => {
    try {
        const response = await getCompanyListRequest(params);
        if (response && response.flag) {
            return {
                params,
                companyItems: response.data || [],
                pagination: response?.pagination || null,
                actionFlag: "COMPANY_LST",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                companyItems: [],
                actionFlag: "",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        return {
            params,
            companyItems: [],
            actionFlag: "",
            success: "",
            error: error.message // Ensure error message is string
        }
    }
})

async function getCompanyRequest(params) {
    return instance.get(`${API_ENDPOINTS.companies.get}/${params?.id}`)
        .then((items) => items.data).catch((error) => error)
}

export const getCompany = createAsyncThunk("appCompanies/getCompany", async (params) => {
    try {
        const response = await getCompanyRequest(params);
        if (response && response.flag) {
            return {
                companyItem: response?.data || null,
                actionFlag: "COMPANY_ITM",
                success: "",
                error: ""
            };
        } else {
            return {
                companyItem: null,
                actionFlag: "COMPANY_ITM_ERR",
                success: "",
                error: ""
            }
        }
    } catch (error) {
        return {
            companyItem: null,
            actionFlag: "COMPANY_ITM_ERR",
            success: "",
            error: error
        }
    }
})

async function createCompanyRequest(payload) {
    return instance.post(`${API_ENDPOINTS.companies.create}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const createCompany = createAsyncThunk("appCompanies/createCompany", async (params) => {
    try {
        const response = await createCompanyRequest(params);
        if (response && response.flag) {
            return {
                companyItem: response?.data || null,
                actionFlag: "COMPANY_CRTD",
                success: response.message,
                error: ""
            }
        } else {
            return {
                companyItem: null,
                actionFlag: "COMPANY_CRTD_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            companyItem: null,
            actionFlag: "COMPANY_CRTD_ERR",
            success: "",
            error: error
        }
    }
})

async function updateCompanyRequest(payload) {
    return instance.put(`${API_ENDPOINTS.companies.update}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const updateCompany = createAsyncThunk("appCompanies/updateCompany", async (payload) => {
    try {
        const response = await updateCompanyRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                companyItem: response.data || null,
                actionFlag: "COMPANY_UPDT",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                actionFlag: "COMPANY_UPDT_ERR",
                success: "",
                error: response?.message
            }
        }
    } catch (error) {
        return {
            payload,
            actionFlag: "COMPANY_UPDT_ERR",
            success: "",
            error: error
        }
    }
})

async function deleteCompanyRequest(id) {
    return instance.delete(`${API_ENDPOINTS.companies.delete}/${id}`)
        .then((items) => items.data).catch((error) => error)
}

export const deleteCompany = createAsyncThunk("appCompanies/deleteCompany", async (id) => {
    try {
        const response = await deleteCompanyRequest(id);
        if (response && response.flag) {
            return {
                actionFlag: "COMPANY_DLT",
                success: response.message,
                error: ""
            }
        } else {
            return {
                actionFlag: "COMPANY_DLT_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            actionFlag: "COMPANY_DLT_ERR",
            success: "",
            error: error
        }
    }
})

const appAuthSlice = createSlice({
    name: 'appCompanies',
    initialState: {
        companyItems: [],
        pagination: null,
        companyItem: initCompanyItem,
        isEmailUnique: false,
        isUserUnique: false,
        actionFlag: "",
        loading: true,
        success: "",
        error: "",
    },
    reducers: {
        cleanCompanyMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCompanyList.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getCompanyList.fulfilled, (state, action) => {
                state.companyItems = action.payload.companyItems || [];
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag;
                state.pagination = action.payload?.pagination || null;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getCompanyList.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getCompany.pending, (state) => {
                state.companyItem = initCompanyItem;
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getCompany.fulfilled, (state, action) => {
                state.companyItem = action.payload?.companyItem || initCompanyItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getCompany.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createCompany.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createCompany.fulfilled, (state, action) => {
                state.companyItem = action.payload?.companyItem || initCompanyItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(createCompany.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(updateCompany.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(updateCompany.fulfilled, (state, action) => {
                state.companyItem = action.payload?.companyItem || initCompanyItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag;
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateCompany.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(deleteCompany.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(deleteCompany.rejected, (state) => {
                state.loading = true;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
    }
})

export const { cleanCompanyMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
