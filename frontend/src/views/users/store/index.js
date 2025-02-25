// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import { API_ENDPOINTS } from "utility/ApiEndPoints";
import instance from "utility/AxiosConfig";

// ** Constant
import { userItem } from "utility/reduxConstant";

const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_name: '',
    password: '',
    role: '',
    status: 1,
    image: '',
    weightIndex: 1,
    priviledges: [],
};

/* All get */
async function getListRequest(params) {
    return instance.get(`${API_ENDPOINTS.customer.listing}`, { params })
        .then((items) => items.data)
        .catch((error) => error);
}

export const getActionRequest = createAsyncThunk("getAll", async (params) => {
    try {
        const response = await getListRequest(params);
        if (response && response.flag) {
            return {
                userItems: response?.data || [],
                customerItem: response.data,
                pageData: response.pagination,
                actionFlag: "",
                success: "",
                error: "",
            };
        } else {
            return {
                userItems: [],
                actionFlag: "",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            userItems: [],
            actionFlag: "",
            success: "",
            error: error,
        };
    }
});

/*  delete */
async function deleteListRequest(params) {
    return instance.delete(`${API_ENDPOINTS.customer.delete}/${params}`)
        .then((items) => items.data)
        .catch((error) => error);
}

export const deleteActionRequest = createAsyncThunk("delete", async (params) => {
    try {
        const response = await deleteListRequest(params);
        if (response && response.flag) {
            return {
                customerItem: response.data,
                actionFlag: "success",
                success: response.message,
                error: "",
            };
        } else {
            return {
                customerItem: [],
                actionFlag: "",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            customerItem: [],
            actionFlag: "",
            success: "",
            error: error,
        };
    }
});

async function creatRequest(payload) {
    return instance.post(`${API_ENDPOINTS.customer.create}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const creatActionRequest = createAsyncThunk("creat", async (params) => {
    try {
        const response = await creatRequest(params);
        if (response && response.flag) {
            return {
                customerItem: response.data,
                actionFlag: "CREAT",
                success: response.message,
                error: "",
            };
        } else {
            return {
                customerItem: [],
                actionFlag: "",
                success: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            customerItem: [],
            actionFlag: "",
            success: "",
            error: error,
        };
    }
});

async function editRequest(params) {
    return instance.get(`${API_ENDPOINTS.customer.edit}/${params?.id}`)
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
});

async function updateRequest(payload) {
    return instance.put(`${API_ENDPOINTS.customer.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error);
}

export const updateActionRequest = createAsyncThunk("update", async (payload) => {
    try {
        const response = await updateRequest(payload);
        if (response && response.flag) {
            return {
                customerItem: response.data,
                actionFlag: "UPDATE",
                success: response.message,
                error: "",
            };
        } else {
            return {
                customerItem: [],
                success: "",
                actionFlag: "",
                error: response.message,
            };
        }
    } catch (error) {
        return {
            success: "",
            actionFlag: "",
            error: error,
        };
    }
});

// Create a slice
const appAuthSlice = createSlice({
    name: 'customer',
    initialState: {
        userItems: [],
        userItem: userItem,
        customerItem: [],
        getCountryItem: [],
        pagination: null,
        editItem: "",
        actionFlag: "",
        loading: true,
        success: "",
        error: "",
    },
    reducers: {
        cleanMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
            state.editItem = initialValues
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getActionRequest.pending, (state, action) => {
                state.type = 'LISTING';
                state.loading = false;
            })
            .addCase(getActionRequest.fulfilled, (state, action) => {
                state.type = 'LISTING';
                state.userItems = action.payload?.userItems || []
                state.customerItem = action.payload.customerItem
                state.pagination = action.payload.pageData
                state.loading = true;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(deleteActionRequest.fulfilled, (state, action) => {
                state.type = 'DELETE';
                state.loading = true;
                state.actionFlag = "success";
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
            .addCase(editActionRequest.fulfilled, (state, action) => {
                state.type = 'EDIT';
                state.loading = true;
                state.editItem = action.payload.editItem;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(updateActionRequest.fulfilled, (state, action) => {
                state.actionFlag = 'UPDATE';
                state.loading = true;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
    },

});

export const {
    cleanMessage,
} = appAuthSlice.actions;

export default appAuthSlice.reducer;
