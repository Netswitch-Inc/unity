// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

import { initAssessmentItem } from "utility/reduxConstant";

async function getAssessmentListRequest(params) {
  return instance.get(`${API_ENDPOINTS.assessments.list}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getAssessmentList = createAsyncThunk("appAssessments/getAssessmentList", async (params) => {
  try {
    const response = await getAssessmentListRequest(params);
    if (response && response.flag) {
      return {
        params,
        assessmentItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "ASESMNT_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        assessmentItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      assessmentItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getAssessmentRequest(params) {
  return instance.get(`${API_ENDPOINTS.assessments.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getAssessment = createAsyncThunk("appAssessments/getAssessment", async (params) => {
  try {
    const response = await getAssessmentRequest(params);
    if (response && response.flag) {
      return {
        assessmentItem: response?.data || null,
        actionFlag: "ASESMNT_ITM_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        assessmentItem: null,
        actionFlag: "ASESMNT_ITM_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      assessmentItem: null,
      actionFlag: "ASESMNT_ITM_ERR",
      success: "",
      error: error
    }
  }
})

async function createAssessmentRequest(payload) {
  return instance.post(`${API_ENDPOINTS.assessments.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createAssessment = createAsyncThunk("appAssessments/createAssessment", async (payload) => {
  try {
    const response = await createAssessmentRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        assessmentItem: response.data || null,
        actionFlag: "ASESMNT_CRTD_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "ASESMNT_CRTD_ERR",
        success: "",
        error: response.message,
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "ASESMNT_CRTD_ERR",
      success: "",
      error: error
    }
  }
})

async function updateAssessmentRequest(payload) {
  return instance.put(`${API_ENDPOINTS.assessments.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateAssessment = createAsyncThunk("appAssessments/updateAssessment", async (payload) => {
  try {
    const response = await updateAssessmentRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        assessmentItem: response.data || null,
        actionFlag: "ASESMNT_UPDT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "ASESMNT_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "ASESMNT_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function deleteAssessmentRequest(id) {
  return instance.delete(`${API_ENDPOINTS.assessments.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteAssessment = createAsyncThunk("appAssessments/deleteAssessment", async (id) => {
  try {
    const response = await deleteAssessmentRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "ASESMNT_DLT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        id,
        actionFlag: "ASESMNT_DLT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      id,
      actionFlag: "ASESMNT_DLT_ERR",
      success: "",
      error: error
    }
  }
})

// Create a slice
const appAssessmentSlice = createSlice({
  name: "appAssessments",
  initialState: {
    assessmentItems: [],
    assessmentItem: initAssessmentItem,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanAssessmentMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssessmentList.pending, (state) => {
        state.assessmentItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getAssessmentList.fulfilled, (state, action) => {
        state.assessmentItems = action.payload?.assessmentItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getAssessmentList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getAssessment.pending, (state) => {
        state.assessmentItem = initAssessmentItem;
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getAssessment.fulfilled, (state, action) => {
        state.assessmentItem = action.payload?.assessmentItem || initAssessmentItem;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getAssessment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createAssessment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.assessmentItem = action.payload?.assessmentItem || initAssessmentItem;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createAssessment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateAssessment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateAssessment.fulfilled, (state, action) => {
        state.assessmentItem = action.payload?.assessmentItem || initAssessmentItem;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateAssessment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteAssessment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteAssessment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  }
});

export const { cleanAssessmentMessage } = appAssessmentSlice.actions;

export default appAssessmentSlice.reducer;
