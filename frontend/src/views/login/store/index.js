/* eslint-disable object-shorthand */

// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Api endpoints
import { API_ENDPOINTS } from "utility/ApiEndPoints";

// ** Utils
import {
    setCurrentUser,
    setAccessToken,
    getAccessToken,
    getCurrentUser,
    logoutCurrentUser
} from "utility/Utils";

// ** Constant
import { userItem, profileItem } from "utility/reduxConstant";

async function loginRequest(payload) {
    return instance.post(`${API_ENDPOINTS.auth.login}`, payload)
        .then((auth) => auth.data)
        .catch((error) => error)
}

export const login = createAsyncThunk("appAuth/login", async (payload) => {
    try {
        const response = await loginRequest(payload);
        if (response && response.flag) {
            setCurrentUser(response.data);
            setAccessToken(response.token);
            return {
                authUserItem: response.data,
                accessToken: response.token,
                actionFlag: "LOGGED",
                success: response.message,
                error: ""
            }
        } else {
            return {
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getAuthRoleRequest(params) {
    return instance.get(`${API_ENDPOINTS.auth.role}`, { params })
        .then((auth) => auth.data)
        .catch((error) => error)
}

export const getAuthRole = createAsyncThunk("appAuth/getAuthRole", async (params) => {
    try {
        const response = await getAuthRoleRequest(params);
        if (response && response.flag) {
            return {
                authUserRole: response.data,
                actionFlag: "AUTH_ROLE",
                success: response.message,
                error: ""
            }
        } else {
            return {
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getAuthRolePermissionRequest(params) {
    return instance.get(`${API_ENDPOINTS.auth.rolePermission}`, { params })
        .then((auth) => auth.data)
        .catch((error) => error)
}

export const getAuthRolePermission = createAsyncThunk("appAuth/getAuthRolePermission", async (params) => {
    try {
        const response = await getAuthRolePermissionRequest(params);
        if (response && response.flag) {
            return {
                authUserRole: response?.role || null,
                authRolePermission: response?.data || null,
                actionFlag: "AUTH_ROLE_PERMISSION",
                success: response.message,
                error: ""
            }
        } else {
            return {
                actionFlag: "AUTH_ROLE_PERMISSION_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            actionFlag: "AUTH_ROLE_PERMISSION_ERR",
            success: "",
            error: error
        }
    }
})

async function updateProfileRequest(payload) {
    return instance.put(`${API_ENDPOINTS.auth.profile}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const updateProfile = createAsyncThunk("appAuth/updateProfile", async (payload) => {
    try {
        const response = await updateProfileRequest(payload);
        if (response && response.flag) {
            setCurrentUser(response.data);
            return {
                payload,
                authUserItem: response?.data,
                actionFlag: "PROFILE_UPDATED",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                payload,
                actionFlag: "PROFILE_UPDATED",
                success: response?.message || "",
                error: ""
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

async function changePasswordRequest(payload) {
    return instance.post(`${API_ENDPOINTS.auth.changepassword}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const updatePassword = createAsyncThunk("appAuth/updatePassword", async (payload) => {
    try {
        const response = await changePasswordRequest(payload);
        if (response && response.flag) {
            return {
                actionFlag: "PASSWORD_UPDATED",
                success: response?.message || "",
                error: ""
            }
        } else {
            return {
                actionFlag: "PASSWORD_UPDATED",
                success: "",
                error: response?.message
            }
        }
    } catch (error) {
        return {
            actionFlag: "PASSWORD_UPDATED",
            success: "",
            error: error
        }
    }
})

async function EditProfileRequest() {
    return instance.get(`${API_ENDPOINTS.auth.get}`)
        .then((items) => items.data)
        .catch((error) => error);
}

export const editProfile = createAsyncThunk("appAuth/editProfile", async () => {
    try {
        const response = await EditProfileRequest();
        if (response && response.flag) {
            return {
                profile: response.data,
                actionFlag: "PROFILE_UPDATED",
                success: "",
                error: ""
            }
        } else {
            return {
                profile: profileItem,
                actionFlag: "",
                success: "",
                error: response?.message
            }
        }
    } catch (error) {
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function verifyEmailRequest(payload) {
    return instance.post(`${API_ENDPOINTS.auth.verifyemail}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const verifyemail = createAsyncThunk("appAuth/verifyEmail", async (payload) => {
    try {
        const response = await verifyEmailRequest(payload);
        if (response && response.flag) {
            return {
                forgotUserEmail: response.data.email,
                actionFlag: "",
                success: response?.message,
                error: ""
            }
        } else {
            return {
                actionFlag: "",
                success: "",
                error: response?.message
            }
        }
    } catch (error) {
        return {
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function resetPasswordRequest(payload) {
    return instance.post(`${API_ENDPOINTS.auth.resetpassword}`, payload)
        .then((items) => items.data)
        .catch((error) => error)
}

export const resetPassword = createAsyncThunk("appAuth/resetPassword", async (payload) => {
    try {
        const response = await resetPasswordRequest(payload);
        if (response && response.flag) {
            return {
                actionFlag: "RESET_PASSWORD",
                success: response?.message,
                error: ""
            }
        } else {
            return {
                actionFlag: "RESET_PASSWORD",
                success: "",
                error: response?.message
            }
        }
    } catch (error) {
        return {
            actionFlag: "RESET_UPDATED",
            success: "",
            error: "Token is expired or not valid."
        }
    }
})

async function getEmailExistRequest(params) {
    return instance.get(`${API_ENDPOINTS.auth.emailExist}`, { params })
        .then((auth) => auth.data)
        .catch((error) => error)
}

export const getEmailExist = createAsyncThunk("appAuth/getEmailExist", async (params) => {
    try {
        const response = await getEmailExistRequest(params);
        if (response && response.flag) {
            return {
                isEmailExist: response?.data || false,
                actionFlag: "EML_EXST",
                success: response.message,
                error: ""
            }
        } else {
            return {
                isEmailExist: response?.data || false,
                actionFlag: "EML_EXST_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        console.log("getEmailExist catch >>> ", error);
        return {
            isEmailExist: false,
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function getUsernameExistRequest(params) {
    return instance.get(`${API_ENDPOINTS.auth.usernamExist}`, { params })
        .then((auth) => auth.data)
        .catch((error) => error)
}

export const getUsernameExist = createAsyncThunk("appAuth/getUsernameExist", async (params) => {
    try {
        const response = await getUsernameExistRequest(params);
        if (response && response.flag) {
            return {
                isUsernameExist: response?.data || false,
                actionFlag: "USRNM_EXST",
                success: response.message,
                error: ""
            }
        } else {
            return {
                isUsernameExist: response?.data || false,
                actionFlag: "USRNM_EXST_ERR",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            isUsernameExist: false,
            actionFlag: "USRNM_EXST_ERR",
            success: "",
            error: error
        }
    }
})

// Create a slice
const appAuthSlice = createSlice({
    name: 'appAuth',
    initialState: {
        authUserItem: getCurrentUser() ? getCurrentUser() : userItem,
        accessToken: getAccessToken(),
        authUserRole: null,
        authRolePermission: null,
        userItem: userItem,
        profile: '',
        forgotUserEmail: '',
        isEmailExist: false,
        isUsernameExist: false,
        actionFlag: "",
        sidebarLoading: true,
        loading: true,
        success: "",
        error: "",
        connectError: ""
    },
    reducers: {
        authUserLogout: (state) => {
            logoutCurrentUser();
            state.authUserItem = null;
            state.accessToken = null;
            state.authRolePermission = null;
        },
        cleanAuthMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
            state.forgotUserEmail = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.authUserItem = action.payload?.authUserItem || null;
                state.accessToken = action.payload?.accessToken || "";
                state.actionFlag = action.payload?.actionFlag || "";
                state.loading = true;
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(login.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getAuthRole.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getAuthRole.fulfilled, (state, action) => {
                state.authUserRole = action.payload?.authUserRole || null;
                state.actionFlag = action.payload?.actionFlag || "";
                state.loading = true;
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getAuthRole.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getAuthRolePermission.pending, (state) => {
                state.sidebarLoading = false;
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getAuthRolePermission.fulfilled, (state, action) => {
                state.authUserRole = action.payload?.authUserRole || null;
                state.authRolePermission = action.payload?.authRolePermission || null;
                state.actionFlag = action.payload?.actionFlag || "";
                state.sidebarLoading = true;
                state.loading = true;
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getAuthRolePermission.rejected, (state) => {
                state.sidebarLoading = true;
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(editProfile.fulfilled, (state, action) => {
                state.type = 'EDIT_PROFILE';
                state.loading = true;
                state.actionFlag = 'EDIT_PROFILE';
                state.profile = action.payload.profile;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = true;
                state.authUserItem = action.payload?.authUserItem || state.authUserItem;
                state.actionFlag = action.payload?.actionFlag || "PROFILE_UPDATED";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "PASSWORD_UPDATED";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(verifyemail.fulfilled, (state, action) => {
                state.type = 'FORGOT_PASSWORD_EMAIL';
                state.loading = true;
                state.actionFlag = 'VERIFY_EMAIL';
                state.forgotUserEmail = action.payload.forgotUserEmail;
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.type = 'RESET_PASSWORD';
                state.loading = true;
                state.actionFlag = 'RESET_PASSWORD';
                state.success = action.payload.success;
                state.error = action.payload.error;
            })
            .addCase(getEmailExist.pending, (state) => {
                state.isEmailExist = false;
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getEmailExist.fulfilled, (state, action) => {
                state.isEmailExist = action.payload?.isEmailExist || false;
                state.actionFlag = action.payload?.actionFlag || "";
                state.loading = true;
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getEmailExist.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getUsernameExist.pending, (state) => {
                state.isUsernameExist = false;
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getUsernameExist.fulfilled, (state, action) => {
                state.isUsernameExist = action.payload?.isUsernameExist || false;
                state.actionFlag = action.payload?.actionFlag || "";
                state.loading = true;
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getUsernameExist.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
    }
})


export const {
    authUserLogout,
    cleanAuthMessage,
} = appAuthSlice.actions;

export default appAuthSlice.reducer;
