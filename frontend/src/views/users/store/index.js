// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import { API_ENDPOINTS } from "utility/ApiEndPoints";
import instance from "utility/AxiosConfig";

// ** Constant
import { initUserItem } from "utility/reduxConstant";

async function getUserListRequest(params) {
    return instance.get(`${API_ENDPOINTS.users.list}`, { params })
        .then((items) => items.data)
        .catch((error) => error)
}

export const getUserList = createAsyncThunk("appUsers/getUserList", async (params) => {
    try {
        const response = await getUserListRequest(params);
        if (response && response.flag) {
            return {
                params,
                userItems: response?.data || [],
                pagination: response?.pagination || null,
                actionFlag: "",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                userItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            userItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getUserRequest(params) {
    return instance.get(`${API_ENDPOINTS.users.get}/${params?.id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const getUser = createAsyncThunk("appUsers/getUser", async (params) => {
    try {
        const response = await getUserRequest(params);
        if (response && response.flag) {
            return {
                userItem: response.data,
                actionFlag: "USR_ITM",
                success: "",
                error: "",
            }
        } else {
            return {
                userItem: null,
                actionFlag: "USR_ITM_ERR",
                success: "",
                error: "",
            }
        }
    } catch (error) {
        return {
            userItem: null,
            actionFlag: "USR_ITM_ERR",
            success: "",
            error: error
        }
    }
})

async function createUserRequest(payload) {
    return instance.post(`${API_ENDPOINTS.users.create}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const createUser = createAsyncThunk("appUsers/createUser", async (payload) => {
    try {
        const response = await createUserRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                userItem: response.data || null,
                actionFlag: "USR_CRET",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                actionFlag: "",
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

async function updateUserRequest(payload) {
    return instance.put(`${API_ENDPOINTS.users.update}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const updateUser = createAsyncThunk("appUsers/updateUser", async (payload) => {
    try {
        const response = await updateUserRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                userItem: response.data || null,
                actionFlag: "USR_UPDT",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                actionFlag: "",
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

async function deleteUserRequest(id) {
    return instance.delete(`${API_ENDPOINTS.users.delete}/${id}`)
        .then((items) => items.data)
        .catch((error) => error)
}

export const deleteUser = createAsyncThunk("appUsers/deleteCronScheduler", async (id) => {
    try {
        const response = await deleteUserRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "USR_DLT",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                id,
                actionFlag: "USR_DLT_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            id,
            actionFlag: "USR_DLT_ERR",
            success: "",
            error: error
        }
    }
})

const appUserSlice = createSlice({
    name: 'appUsers',
    initialState: {
        userItems: [],
        userItem: initUserItem,
        getCountryItem: [],
        pagination: null,
        editItem: "",
        actionFlag: "",
        loading: true,
        success: "",
        error: "",
    },
    reducers: {
        cleanUserMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserList.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getUserList.fulfilled, (state, action) => {
                state.userItems = action.payload?.userItems || []
                state.pagination = action.payload?.pagination || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getUserList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getUser.pending, (state) => {
                state.userItem = initUserItem
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.userItem = action.payload?.userItem || initUserItem
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getUser.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(createUser.pending, (state) => {
                state.userItem = initUserItem
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.userItem = action.payload?.userItem || initUserItem
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(createUser.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.userItem = action.payload?.userItem || initUserItem
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(updateUser.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = false;
                state.actionFlag = "";
                state.success = "";
                state.error = "";
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(deleteUser.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
});

export const {
    cleanUserMessage,
} = appUserSlice.actions;

export default appUserSlice.reducer;
