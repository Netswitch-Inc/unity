// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function verifyAssessmentReport(payload) {
  return instance
    .post(`${API_ENDPOINTS.AssessmentReport.verify}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const verifyCodeAssessmentReport = createAsyncThunk(
  "appAssessmentReports/VerifyAssessmentReport",
  async (payload) => {
    try {
      const response = await verifyAssessmentReport(payload);
      if (response && response.flag) {
        return {
          actionFlag: "VARIFIED",
          success: response?.message,
          error: "",
        };
      } else {
        return {
          actionFlag: "VARIFIED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        actionFlag: "VARIFIED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function createAssessmentPdf(payload) {
  return instance
    .post(`${API_ENDPOINTS.AssessmentReport.pdfcreate}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const assessmentReportPdf = createAsyncThunk(
  "appAssessmentReports/AssessmentReportPdf",
  async (payload) => {
    try {
      const response = await createAssessmentPdf(payload);
      if (response && response.flag) {
        return {
          actionFlag: "ASSESSMENT_REPORT_PDF",
          success: response?.message,
          error: "",
        };
      } else {
        return {
          actionFlag: "ASSESSMENT_REPORT_PDF_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        actionFlag: "ASSESSMENT_REPORT_PDF_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function createAssessmentPdfSentemail(payload) {
  return instance
    .post(`${API_ENDPOINTS.AssessmentReport.sendpdfemail}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const assessmentReportPdfSentEmail = createAsyncThunk(
  "appAssessmentReports/AssessmentReportPdfSentEmail",
  async (payload) => {
    try {
      const response = await createAssessmentPdfSentemail(payload);
      if (response && response.flag) {
        return {
          actionFlag: "ASSESSMENT_REPORT_PDF_SENT_EMAIL",
          success: response?.message,
          error: "",
        };
      } else {
        return {
          actionFlag: "ASSESSMENT_REPORT_PDF_SENT_EMAIL_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        actionFlag: "ASSESSMENT_REPORT_PDF_SENT_EMAIL_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function getAssessmentReportListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.AssessmentReport.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getAssessmentReportList = createAsyncThunk(
  "appAssessmentReports/getAssessmentReportList",
  async (params) => {
    try {
      const response = await getAssessmentReportListRequest(params);
      if (response && response.flag) {
        return {
          params,
          assessmentReportItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          assessmentReportItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        assessmentReportItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function getAssessmentReportAnswersListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.AssessmentReport.assessmentAnswers}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getAssessmentReportAnswersList = createAsyncThunk(
  "appAssessmentReports/getAssessmentAnswerReportList",
  async (params) => {
    try {
      const response = await getAssessmentReportAnswersListRequest(params);
      if (response && response.flag) {
        return {
          params,
          asessmentReportAnswers: response?.data || [],
          // pagination: response?.pagination || null,
          actionFlag: "ASSESSMENT_REPORT_ANSWER_LISTING",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          asessmentReportAnswers: [],
          actionFlag: "ASSESSMENT_REPORT_ANSWER_LISTING_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        asessmentReportAnswers: [],
        actionFlag: "ASSESSMENT_REPORT_ANSWER_LISTING_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.AssessmentReport.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editAssessmentReportRequest = createAsyncThunk(
  "appAssessmentReports/editAssessmentReports",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          assessmentReportItem: response.data,
          actionFlag: "ASSESSMENT_REPORT_GET",
          success: "",
          error: "",
        };
      } else {
        return {
          assessmentReportItem: null,
          actionFlag: "ASSESSMENT_REPORT_GET_ERROR",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        assessmentReportItem: null,
        actionFlag: "ASSESSMENT_REPORT_GET_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function createAssessmentReportRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.AssessmentReport.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createAssessmentReport = createAsyncThunk(
  "appAssessmentReports/createAssessmentReport",
  async (payload) => {
    try {
      const response = await createAssessmentReportRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          addAssessmentReportItem: response.data || null,
          actionFlag: "ASSESSMENT_REPORT_CREATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "ASSESSMENT_REPORT_CREATED_ERRROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "ASSESSMENT_REPORT_CREATED_ERRROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateAssessmentReportRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.AssessmentReport.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateAssessmentReport = createAsyncThunk(
  "appAssessmentReports/updateAssessmentReport",
  async (payload) => {
    try {
      const response = await updateAssessmentReportRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          // AssessmentReportItem: response.data || null,
          actionFlag: "ASSESSMENT_REPORT_UPDATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "ASSESSMENT_REPORT_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "ASSESSMENT_REPORT_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteAssessmentReportRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.AssessmentReport.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteAssessmentReport = createAsyncThunk(
  "appAssessmentReports/deleteAssessmentReport",
  async (id) => {
    try {
      const response = await deleteAssessmentReportRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "ASSMT_RPRT_DLT_SCS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          id,
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        id,
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

// Create a slice
const appAuthSlice = createSlice({
  name: "appAssessmentReports",
  initialState: {
    assessmentReportItems: [],
    assessmentReportItem: null,
    addAssessmentReportItem: null,
    asessmentReportAnswers: [],
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanAssessmentReportMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
      state.addAssessmentReportItem = null;
      state.assessmentReportItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssessmentReportList.pending, (state) => {
        state.assessmentReportItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getAssessmentReportList.fulfilled, (state, action) => {
        state.assessmentReportItems =
          action.payload?.assessmentReportItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag =
          action.payload?.actionFlag || "ASSESSMENT_REPORT_LISTING";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getAssessmentReportList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getAssessmentReportAnswersList.pending, (state) => {
        state.asessmentReportAnswers = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getAssessmentReportAnswersList.fulfilled, (state, action) => {
        state.asessmentReportAnswers =
          action.payload?.asessmentReportAnswers || [];
        // state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = "ASSESSMENT_REPORT_ANSWER_LISTING";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getAssessmentReportAnswersList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(editAssessmentReportRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.assessmentReportItem = action.payload.assessmentReportItem;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(createAssessmentReport.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createAssessmentReport.fulfilled, (state, action) => {
        state.addAssessmentReportItem =
          action.payload?.addAssessmentReportItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createAssessmentReport.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(assessmentReportPdf.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(assessmentReportPdf.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(assessmentReportPdf.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(assessmentReportPdfSentEmail.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(assessmentReportPdfSentEmail.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(assessmentReportPdfSentEmail.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(verifyCodeAssessmentReport.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(verifyCodeAssessmentReport.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(verifyCodeAssessmentReport.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateAssessmentReport.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateAssessmentReport.fulfilled, (state, action) => {
        // state.AssessmentReportItem = action.payload?.AssessmentReportItem || null;
        state.loading = true;
        state.actionFlag =
          action.payload?.actionFlag || "ASSESSMENT_REPORT_UPDATED";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateAssessmentReport.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteAssessmentReport.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteAssessmentReport.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag =
          action.payload?.actionFlag || "ASSESSMENT_REPORT_DELETED";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteAssessmentReport.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  },
});

export const { cleanAssessmentReportMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
