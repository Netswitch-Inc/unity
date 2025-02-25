import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../../utility/AxiosConfig';
import { API_ENDPOINTS } from 'utility/ApiEndPoints';

const initialValues = {
    user_name: '',
    password: '',
    name: "",
    logo: "",
    contact_no: "",
    email: "",
    address: "",
    header_color: "#ffffff",
    footer_color: "#ffffff",
}
async function getCompanyListRequest(params) {
    return instance.get(`${API_ENDPOINTS.company.listing}`, { params })
        .then((items) => items.data)
        .catch((error) => error);
}

export const getCompanyList = createAsyncThunk("appCompanys/getCompanyList", async (params) => {
    try {
        const response = await getCompanyListRequest(params);
        if (response && response.flag) {
            return {
                params,
                CompanyItems: response.data || [],
                pagination: response?.pagination || null,
                actionFlag: "",
                success: "",
                error: ""
            };
        } else {
            return {
                params,
                CompanyItems: [],
                actionFlag: "",
                success: "",
                error: ""
            };
        }
    } catch (error) {
        return {
            params,
            CompanyItems: [],
            actionFlag: "",
            success: "",
            error: error.message // Ensure error message is string
        };
    }
});
async function editRequest(params) {
    return instance.get(`${API_ENDPOINTS.company.edit}/${params?.id}`)
        .then((items) => items.data)
        .catch((error) => error);
}

export const editActionRequest = createAsyncThunk("edit", async (params) => {
    try {
        const response = await editRequest(params);
        if (response && response.flag) {
            return {
                editItem: response.data,
                actionFlag: "",
                success: "",
                error: "",
            };
        } else {
            return {
                editItem: null,
                actionFlag: "",
                success: "",
                error: "",
            };
        }
    } catch (error) {
        return {
            editItem: null,
            actionFlag: "",
            success: "",
            error: error,
        };
    }
}
);

async function creatRequest(payload) {
    return instance.post(`${API_ENDPOINTS.company.create}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}
export const creatActionRequest = createAsyncThunk("creat", async (params) => {
    try {
        const response = await creatRequest(params);
        if (response && response.flag) {
            return {
                CompanyItems: response.data,
                actionFlag: "CREAT",
                success: response.message,
                error: "",
            };
        } else {
            return {
                CompanyItems: [],
                actionFlag: "",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            CompanyItems: [],
            actionFlag: "",
            success: "",
            error: error,
        };
    }
}
);
// emailunique

async function updateCompanyRequest(payload) {
    return instance.put(`${API_ENDPOINTS.company.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const updateCompany = createAsyncThunk("appCompanys/updateCompany", async (payload) => {
    try {
        const response = await updateCompanyRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                editItem: response.data || null,
                actionFlag: "",
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

async function isEmailUnique(payload) {
    return instance.post(`${API_ENDPOINTS.company.emailunique}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const isEmailUniqueAction = createAsyncThunk("appCompanys/isEmailUnique", async (payload) => {
    try {
        const response = await isEmailUnique(payload);
        if (response && response.flag) {
            return {
                isEmailUnique: response.flag,
                actionFlag: "",
                success: response?.message || "",
                error: ""
            };
        } else {
            return {
                isEmailUnique: response.flag,
                actionFlag: "",
                success: "",
                error: response?.message
            };
        }
    } catch (error) {
        return {
            isEmailUnique: false,
            actionFlag: "",
            success: "",
            error: error
        };
    }
});

async function isUserUnique(payload) {
    return instance.post(`${API_ENDPOINTS.company.userunique}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const isUserUniqueAction = createAsyncThunk("appCompanys/isUserUnique", async (payload) => {
    try {
        const response = await isUserUnique(payload);
        if (response && response.flag) {
            return {
                isUserUnique: response.flag,
                actionFlag: "",
                success: response?.message || "",
                error: ""
            };
        } else {
            return {
                isUserUnique: response.flag,
                actionFlag: "",
                success: "",
                error: response?.message
            };
        }
    } catch (error) {
        return {
            isUserUnique: false,
            actionFlag: "",
            success: "",
            error: error
        };
    }
});


async function deleteListRequest(params) {
    return instance.delete(`${API_ENDPOINTS.company.update}/${params}`)
        .then((items) => items.data)
        .catch((error) => error);
}

export const deleteActionRequest = createAsyncThunk("delete", async (params) => {
    try {
        const response = await deleteListRequest(params);
        if (response && response.flag) {
            return {
                CompanyItem: response.data,
                actionFlag: "COMPANY_DELETED",
                success: response.message,
                error: "",
            };
        } else {
            return {
                CompanyItem: [],
                actionFlag: "",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            CompanyItem: [],
            actionFlag: "",
            success: "",
            error: error,
        };
    }
}
);

const appAuthSlice = createSlice({
    name: 'appCompanys',
    initialState: {
        CompanyItems: [],
        pagination: null,
        editItem: initialValues,
        addItem: initialValues,
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
            state.editItem = ""
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCompanyList.pending, (state) => {
                state.type = 'LISTING';
                state.loading = false;
            })
            .addCase(getCompanyList.fulfilled, (state, action) => {
                state.type = 'LISTING';
                state.actionFlag = 'COMPANY_LISTING'
                state.CompanyItems = action.payload.CompanyItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true; // Change loading to false after data is fetched
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(isEmailUniqueAction.fulfilled, (state, action) => {
                state.isEmailUnique = action.payload?.isEmailUnique
                state.loading = true;
                state.actionFlag = "CHECK_EMIAL_IS_UNIQUE";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(isUserUniqueAction.fulfilled, (state, action) => {
                state.isUserUnique = action.payload?.isUserUnique
                state.loading = true;
                state.actionFlag = "CHECK_USER_IS_UNIQUE";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(editActionRequest.fulfilled, (state, action) => {
                state.type = 'EDIT';
                state.loading = true;
                state.editItem = action.payload.editItem;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(creatActionRequest.fulfilled, (state, action) => {
                state.actionFlag = 'CREAT';
                state.loading = true;
                state.success = action.payload.success;
                state.error = action.payload.error;
                state.editItem = initialValues
            })
            .addCase(updateCompany.fulfilled, (state, action) => {
                state.editItem = action.payload?.editItem || null;
                state.loading = true;
                state.actionFlag = "COMPANY_UPDATED";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteActionRequest.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
    },
});

export const { cleanCompanyMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
