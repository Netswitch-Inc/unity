// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "utility/AxiosConfig";

// ** Constant
import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initCompliancePriorityItem } from "utility/reduxConstant";

async function getCompliancePriorityListRequest(params) {
  return instance.get(`${API_ENDPOINTS.compliancePriorities.list}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getCompliancePriorityList = createAsyncThunk("appCompliancePriorities/getCompliancePriorityList", async (params) => {
  try {
    const response = await getCompliancePriorityListRequest(params);
    if (response && response.flag) {
      return {
        params,
        compliancePriorityItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "CMLNC_PRIOTY_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        compliancePriorityItems: [],
        actionFlag: "CMLNC_PRIOTY_LST_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      compliancePriorityItems: [],
      actionFlag: "CMLNC_PRIOTY_LST_ERR",
      success: "",
      error: error
    }
  }
})

async function getCompliancePriorityRequest(params) {
  return instance.get(`${API_ENDPOINTS.compliancePriorities.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getCompliancePriority = createAsyncThunk("appCompliancePriorities/getCompliancePriority", async (params) => {
  try {
    const response = await getCompliancePriorityRequest(params);
    if (response && response.flag) {
      return {
        compliancePriorityItem: response.data,
        actionFlag: "CMLNC_PRIOTY_ITM",
        success: "",
        error: ""
      }
    } else {
      return {
        compliancePriorityItem: null,
        actionFlag: "CMLNC_PRIOTY_ITM_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      compliancePriorityItem: null,
      actionFlag: "CMLNC_PRIOTY_ITM_ERR",
      success: "",
      error: error
    }
  }
})

async function createCompliancePriorityRequest(payload) {
  return instance.post(`${API_ENDPOINTS.compliancePriorities.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createCompliancePriority = createAsyncThunk("appCompliancePriorities/createCompliancePriority", async (payload) => {
  try {
    const response = await createCompliancePriorityRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        compliancePriorityItem: response.data || null,
        actionFlag: "CMLNC_PRIOTY_CRET",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "CMLNC_PRIOTY_CRET_ERR",
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

async function updateCompliancePriorityRequest(payload) {
  return instance.put(`${API_ENDPOINTS.compliancePriorities.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateCompliancePriority = createAsyncThunk("appCompliancePriorities/updateCompliancePriority", async (payload) => {
  try {
    const response = await updateCompliancePriorityRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        compliancePriorityItem: response.data || null,
        actionFlag: "CMLNC_PRIOTY_UPDT",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "CMLNC_PRIOTY_UPDT_ERR",
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

async function deleteCompliancePriorityRequest(id) {
  return instance.delete(`${API_ENDPOINTS.compliancePriorities.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteCompliancePriority = createAsyncThunk("appCompliancePriorities/deleteCompliancePriority", async (id) => {
  try {
    const response = await deleteCompliancePriorityRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "CMLNC_PRIOTY_DLT",
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

async function createsCompanyCompliancePriorityRequest(payload) {
  return instance.post(`${API_ENDPOINTS.compliancePriorities.companyComplianceCreates}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createsCompanyCompliancePriority = createAsyncThunk("appCompliancePriorities/createsCompanyCompliancePriority", async (payload) => {
  try {
    const response = await createsCompanyCompliancePriorityRequest(payload);
    if (response && response.flag) {
      return {
        companyCompliancePriorityItems: response?.data || [],
        actionFlag: "CMP_CMLNC_PRIOTY_CRETS",
        success: "",
        error: ""
      }
    } else {
      return {
        companyCompliancePriorityItems: [],
        actionFlag: "CMP_CMLNC_PRIOTY_CRETS_ERROR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      companyCompliancePriorityItems: [],
      actionFlag: "CMP_CMLNC_PRIOTY_CRETS_ERROR",
      success: "",
      error: error.message
    }
  }
})

const appCompliancePrioritiesSlice = createSlice({
  name: "appCompliancePriorities",
  initialState: {
    compliancePriorityItems: [],
    compliancePriorityItem: initCompliancePriorityItem,
    companyCompliancePriorityItems: [],
    pagination: null,
    loading: true,
    actionFlag: "",
    success: "",
    error: ""
  },
  reducers: {
    cleanCompliancePriorityMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompliancePriorityList.pending, (state) => {
        state.compliancePriorityItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getCompliancePriorityList.fulfilled, (state, action) => {
        state.compliancePriorityItems = action.payload?.compliancePriorityItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getCompliancePriorityList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getCompliancePriority.pending, (state) => {
        state.compliancePriorityItem = initCompliancePriorityItem;
        state.loading = false;
        state.actionFlag = "";
        state.success = "";
        state.error = "";
      })
      .addCase(getCompliancePriority.fulfilled, (state, action) => {
        state.compliancePriorityItem = action.payload?.compliancePriorityItem || initCompliancePriorityItem;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getCompliancePriority.rejected, (state) => {
        state.loading = true;
        state.actionFlag = "";
        state.success = "";
        state.error = "";
      })
      .addCase(createCompliancePriority.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createCompliancePriority.fulfilled, (state, action) => {
        state.compliancePriorityItem = action.payload?.compliancePriorityItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createCompliancePriority.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateCompliancePriority.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateCompliancePriority.fulfilled, (state, action) => {
        state.compliancePriorityItem = action.payload?.compliancePriorityItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateCompliancePriority.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteCompliancePriority.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteCompliancePriority.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteCompliancePriority.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createsCompanyCompliancePriority.pending, (state) => {
        state.companyCompliancePriorityItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createsCompanyCompliancePriority.fulfilled, (state, action) => {
        state.companyCompliancePriorityItems = action.payload?.companyCompliancePriorityItems || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createsCompanyCompliancePriority.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
  }
});

export const { cleanCompliancePriorityMessage } = appCompliancePrioritiesSlice.actions;

export default appCompliancePrioritiesSlice.reducer;
