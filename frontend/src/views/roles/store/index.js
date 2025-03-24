// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { roleItem } from "utility/reduxConstant";

async function getRoleListRequest(params) {
    return instance.get(`${API_ENDPOINTS.roles.list}`, { params })
        .then((items) => items.data).catch((error) => error)
}

export const getRoleList = createAsyncThunk("appRoles/getRoleList", async (params) => {
    try {
        const response = await getRoleListRequest(params);
        if (response && response.flag) {
            return {
                params,
                roleItems: response?.data || [],
                pagination: response?.pagination || null,
                actionFlag: "ROLE_LST",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                roleItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            roleItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})

async function createRoleRequest(payload) {
    return instance.post(`${API_ENDPOINTS.roles.create}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const createRole = createAsyncThunk("appRoles/createRole", async (payload) => {
    try {
        const response = await createRoleRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                roleItem: response.data || null,
                actionFlag: "ROLE_CREATED",
                success: response?.message || "",
                error: ""
            };
        } else {
            return {
                payload,
                actionFlag: "",
                success: "",
                error: response.message
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
})

async function updateRoleRequest(payload) {
    return instance.put(`${API_ENDPOINTS.roles.update}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const updateRole = createAsyncThunk("appRoles/updateRole", async (payload) => {
    try {
        const response = await updateRoleRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                roleItem: response.data || null,
                actionFlag: "ROLE_UPDATED",
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

async function deleteRoleRequest(id) {
    return instance.delete(`${API_ENDPOINTS.roles.delete}/${id}`)
        .then((items) => items.data).catch((error) => error)
}

export const deleteRole = createAsyncThunk("appRoles/deleteRole", async (id) => {
    try {
        const response = await deleteRoleRequest(id);
        if (response && response.flag) {
            return {
                id,
                actionFlag: "ROLE_DELETED",
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

/* Permission */
async function createRolePermissionRequest(payload) {
    return instance.post(`${API_ENDPOINTS.permissions.create}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const createRolePermission = createAsyncThunk("appRoles/createRolePermission", async (payload) => {
    try {
        const response = await createRolePermissionRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                actionFlag: "PERMISSION_CREATED",
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

async function updateRolePermissionRequest(payload) {
    return instance.put(`${API_ENDPOINTS.permissions.update}`, payload)
        .then((items) => items.data).catch((error) => error)
}

export const updateRolePermission = createAsyncThunk("appRoles/updateRolePermission", async (payload) => {
    try {
        const response = await updateRolePermissionRequest(payload);
        if (response && response.flag) {
            return {
                payload,
                actionFlag: "PERMISSION_UPDATED",
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

async function getRolePermissionsRequest(params) {
    return instance.get(`${API_ENDPOINTS.permissions.rolePermission}`, { params })
        .then((items) => items.data).catch((error) => error)
}

export const getRolePermissions = createAsyncThunk("appRoles/getRolePermissions", async (params) => {
    try {
        const response = await getRolePermissionsRequest(params);
        if (response && response.flag) {
            return {
                params,
                groupPermissions: response?.data || null,
                roleItem: response?.role || roleItem,
                actionFlag: "ROLE_PERMISSION",
                success: "",
                error: ""
            }
        } else {
            return {
                params,
                roleItems: [],
                actionFlag: "",
                success: "",
                error: response.message
            }
        }
    } catch (error) {
        return {
            params,
            roleItems: [],
            actionFlag: "",
            success: "",
            error: error
        }
    }
})
/* /Permission */

// Create a slice
const appRoleSlice = createSlice({
    name: 'appRoles',
    initialState: {
        roleItems: [],
        pagination: null,
        roleItem: roleItem,
        groupPermissions: null,
        editItem: "",
        actionFlag: "",
        loading: true,
        success: "",
        error: ""
    },
    reducers: {
        cleanRoleMessage: (state) => {
            state.actionFlag = "";
            state.success = "";
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRoleList.pending, (state) => {
                state.roleItems = [];
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getRoleList.fulfilled, (state, action) => {
                state.roleItems = action.payload?.roleItems || [];
                state.pagination = action.payload?.pagination || null;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getRoleList.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(createRole.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.roleItem = action.payload?.roleItem || roleItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createRole.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateRole.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.roleItem = action.payload?.roleItem || roleItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateRole.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteRole.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(deleteRole.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })

            /* Permission */
            .addCase(createRolePermission.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(createRolePermission.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(createRolePermission.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(updateRolePermission.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(updateRolePermission.fulfilled, (state, action) => {
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(updateRolePermission.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
            .addCase(getRolePermissions.pending, (state) => {
                state.loading = false;
                state.success = "";
                state.error = "";
            })
            .addCase(getRolePermissions.fulfilled, (state, action) => {
                state.groupPermissions = action.payload?.groupPermissions || null;
                state.roleItem = action.payload?.roleItem || roleItem;
                state.loading = true;
                state.actionFlag = action.payload?.actionFlag || "";
                state.success = action.payload?.success;
                state.error = action.payload?.error;
            })
            .addCase(getRolePermissions.rejected, (state) => {
                state.loading = true;
                state.success = "";
                state.error = "";
            })
        /* /Permission */
    }
});

export const { cleanRoleMessage } = appRoleSlice.actions;

export default appRoleSlice.reducer;
