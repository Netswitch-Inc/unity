// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

import { initialAssessment } from "utility/reduxConstant";

async function getAssessmentListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Assessment.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getAssessmentList = createAsyncThunk(
  "appAssessment/getConnectionList",
  async (params) => {
    try {
      const response = await getAssessmentListRequest(params);
      if (response && response.flag) {
        return {
          params,
          assessmentItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          assessmentItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        assessmentItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Assessment.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editAssessmentRequest = createAsyncThunk(
  "appAssessment/editConnections",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          assessmentItem: response.data,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          assessmentItem: null,
          actionFlag: "",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        assessmentItem: null,
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function createAssessmentRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.Assessment.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createAssessment = createAsyncThunk(
  "appAssessment/createAssessment",
  async (payload) => {
    try {
      const response = await createAssessmentRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          assessmentItem: response.data || null,
          actionFlag: "ASSESSMENT_CREATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "ASSESSMENT_CREATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "ASSESSMENT_CREATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateAssessmentRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.Assessment.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateAssessment = createAsyncThunk(
  "appAssessment/updateAssessment",
  async (payload) => {
    try {
      const response = await updateAssessmentRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          assessmentItem: response.data || null,
          actionFlag: "ASSESSMENT_UPDATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "ASSESSMENT_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "ASSESSMENT_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteAssessmentRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.Assessment.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteAssessment = createAsyncThunk(
  "appAssessment/deleteAssessment",
  async (id) => {
    try {
      const response = await deleteAssessmentRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "ASSESSMENT_DELETED_SUCCSESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          id,
          actionFlag: "ASSESSMENT_DELETED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        id,
        actionFlag: "ASSESSMENT_DELETED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

// Create a slice
const appAuthSlice = createSlice({
  name: "appAssessment",
  initialState: {
    assessmentItems: [],
    assessmentItem: initialAssessment,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanAssessmentMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
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
        state.actionFlag = action.payload?.actionFlag || "ASSESSMENT_LISTING";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getAssessmentList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(editAssessmentRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.assessmentItem = action.payload.assessmentItem;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(createAssessment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.assessmentItem = action.payload?.assessmentItem || null;
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
        state.assessmentItem = action.payload?.assessmentItem || null;
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
  },
});

export const { cleanAssessmentMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
