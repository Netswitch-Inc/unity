import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../../utility/AxiosConfig';
import { API_ENDPOINTS } from 'utility/ApiEndPoints';
import { initCompanyItem } from 'utility/reduxConstant';



async function getCompanyListRequest(params) {
    return instance.get(`${API_ENDPOINTS.company.listing}`, { params })
        .then((items) => items.data)
        .catch((error) => error);
}

export const getCompanyList = createAsyncThunk("appCompany/getCompanyList", async (params) => {
    try {
        const response = await getCompanyListRequest(params);
        if (response && response.flag) {
            return {
                params,
                companyItems: response.data || [],
                pagination: response?.pagination || null,
                actionFlag: "COMPANY_LISTING",
                success: "",
                error: ""
            };
        } else {
            return {
                params,
                companyItems: [],
                actionFlag: "",
                success: "",
                error: ""
            };
        }
    } catch (error) {
        return {
            params,
            companyItems: [],
            actionFlag: "",
            success: "",
            error: error.message // Ensure error message is string
        };
    }
});

async function getCompanyRequest(params) {
    return instance.get(`${API_ENDPOINTS.company.edit}/${params?.id}`)
        .then((items) => items.data)
        .catch((error) => error);
}

export const getCompany = createAsyncThunk("edit", async (params) => {
    try {
        const response = await getCompanyRequest(params);
        if (response && response.flag) {
            return {
                companyItem: response.data,
                actionFlag: "GET_COMPANY",
                success: "",
                error: "",
            };
        } else {
            return {
                companyItem: null,
                actionFlag: "GET_NOT_COMPANY",
                success: "",
                error: "",
            };
        }
    } catch (error) {
        return {
            companyItem: null,
            actionFlag: "",
            success: "",
            error: error,
        };
    }
}
);

async function createComapanyRequest(payload) {
    return instance.post(`${API_ENDPOINTS.company.create}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}
export const createComapany = createAsyncThunk("creat", async (params) => {
    try {
        const response = await createComapanyRequest(params);
        if (response && response.flag) {
            return {
                companyItems: response.data,
                actionFlag: "CREAT",
                success: response.message,
                error: "",
            };
        } else {
            return {
                companyItems: [],
                actionFlag: "",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            companyItems: [],
            actionFlag: "",
            success: "",
            error: error,
        };
    }
}
);

async function updateCompanyRequest(payload) {
    return instance.put(`${API_ENDPOINTS.company.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const updateCompany = createAsyncThunk("appCompany/updateCompany", async (payload) => {
    try {
        const response = await updateCompanyRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                companyItem: response.data || null,
                actionFlag: "COMPANY_UPDATED",
                success: response?.message || "",
                error: ""
            };
        } else {
            return {
                payload,
                actionFlag: "",
                success: "",
                error: response?.message
            };
        }
    } catch (error) {
        return {
            payload,
            actionFlag: "",
            success: "",
            error: error
        };
    }
});

async function deleteComapanyRequest(params) {
    return instance.delete(`${API_ENDPOINTS.company.update}/${params}`)
        .then((items) => items.data)
        .catch((error) => error);
}

export const deleteComapany = createAsyncThunk("delete", async (params) => {
    try {
        const response = await deleteComapanyRequest(params);
        if (response && response.flag) {
            return {
                companyItem: response.data,
                actionFlag: "COMPANY_DELETED",
                success: response.message,
                error: "",
            };
        } else {
            return {
                companyItem: [],
                actionFlag: "",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            companyItem: [],
            actionFlag: "",
            success: "",
            error: error,
        };
    }
}
);

const appAuthSlice = createSlice({
    name: 'appCompany',
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
                state.actionFlag = action.payload?.actionFlag;
                state.companyItems = action.payload.companyItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true; // Change loading to false after data is fetched
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getCompanyList.rejected, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getCompany.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getCompany.fulfilled, (state, action) => {
                state.companyItem = action.payload.companyItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getCompany.rejected, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createComapany.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createComapany.fulfilled, (state, action) => {
                state.companyItems = action.payload?.companyItems;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(createComapany.rejected, (state) => {
                state.loading = false;
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
                state.companyItem = action.payload?.companyItem || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag;
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateCompany.rejected, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(deleteComapany.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(deleteComapany.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(deleteComapany.rejected, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            
    },
});

export const { cleanCompanyMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;

