// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function verifyAssessmentReport(payload) {
  return instance.post(`${API_ENDPOINTS.assessmentReports.verify}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const verifyCodeAssessmentReport = createAsyncThunk("appAssessmentReports/verifyCodeAssessmentReport", async (payload) => {
  try {
    const response = await verifyAssessmentReport(payload);
    if (response && response.flag) {
      return {
        actionFlag: "CD_VRFYD_SCS",
        success: response?.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "CD_VRFYD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      actionFlag: "CD_VRFYD_ERR",
      success: "",
      error: error
    }
  }
})

async function createAssessmentPdf(payload) {
  return instance.post(`${API_ENDPOINTS.assessmentReports.pdfcreate}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const assessmentReportPdf = createAsyncThunk("appAssessmentReports/assessmentReportPdf", async (payload) => {
  try {
    const response = await createAssessmentPdf(payload);
    if (response && response.flag) {
      return {
        actionFlag: "ASSMT_RPRT_PDF_SCS",
        success: response?.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "ASSMT_RPRT_PDF_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      actionFlag: "ASSMT_RPRT_PDF_ERR",
      success: "",
      error: error
    }
  }
})

async function createAssessmentPdfSentemail(payload) {
  return instance.post(`${API_ENDPOINTS.assessmentReports.sendpdfemail}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const assessmentReportPdfSentEmail = createAsyncThunk("appAssessmentReports/assessmentReportPdfSentEmail", async (payload) => {
  try {
    const response = await createAssessmentPdfSentemail(payload);
    if (response && response.flag) {
      return {
        actionFlag: "ASSMT_RPRT_PDF_SNT_EML_SCS",
        success: response?.message,
        error: ""
      }
    } else {
      return {
        actionFlag: "ASSMT_RPRT_PDF_SNT_EML_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      actionFlag: "ASSMT_RPRT_PDF_SNT_EML_ERR",
      success: "",
      error: error
    }
  }
})

async function getAssessmentReportListRequest(params) {
  return instance.get(`${API_ENDPOINTS.assessmentReports.list}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getAssessmentReportList = createAsyncThunk("appAssessmentReports/getAssessmentReportList", async (params) => {
  try {
    const response = await getAssessmentReportListRequest(params);
    if (response && response.flag) {
      return {
        params,
        assessmentReportItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "ASSMT_RPRT_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        assessmentReportItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      assessmentReportItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getAssessmentReportAnswersListRequest(params) {
  return instance.get(`${API_ENDPOINTS.assessmentReports.assessmentAnswers}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getAssessmentReportAnswersList = createAsyncThunk("appAssessmentReports/getAssessmentReportAnswersList", async (params) => {
  try {
    const response = await getAssessmentReportAnswersListRequest(params);
    if (response && response.flag) {
      return {
        params,
        asessmentReportAnswers: response?.data || [],
        actionFlag: "ASSMT_RPRT_ANSR_LST",
        success: "",
        error: "",
      };
    } else {
      return {
        params,
        asessmentReportAnswers: [],
        actionFlag: "ASSMT_RPRT_ANSR_LST_ERR",
        success: "",
        error: response.message,
      };
    }
  } catch (error) {
    return {
      params,
      asessmentReportAnswers: [],
      actionFlag: "ASSMT_RPRT_ANSR_LST_ERR",
      success: "",
      error: error
    }
  }
})

async function getAssessmentReportRequest(params) {
  return instance.get(`${API_ENDPOINTS.assessmentReports.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getAssessmentReport = createAsyncThunk("appAssessmentReports/getAssessmentReport", async (params) => {
  try {
    const response = await getAssessmentReportRequest(params);
    if (response && response.flag) {
      return {
        assessmentReportItem: response.data,
        actionFlag: "ASSMT_RPRT_ITM_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        assessmentReportItem: null,
        actionFlag: "ASSMT_RPRT_ITM_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      assessmentReportItem: null,
      actionFlag: "ASSMT_RPRT_ITM_ERR",
      success: "",
      error: error
    }
  }
})

async function createAssessmentReportRequest(payload) {
  return instance.post(`${API_ENDPOINTS.assessmentReports.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createAssessmentReport = createAsyncThunk("appAssessmentReports/createAssessmentReport", async (payload) => {
  try {
    const response = await createAssessmentReportRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        addAssessmentReportItem: response?.data || null,
        assessmentReportItem: response?.data || null,
        actionFlag: "ASSMT_RPRT_CRTD_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "ASSMT_RPRT_CRTD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "ASSMT_RPRT_CRTD_ERR",
      success: "",
      error: error
    }
  }
})

async function updateAssessmentReportRequest(payload) {
  return instance.put(`${API_ENDPOINTS.assessmentReports.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateAssessmentReport = createAsyncThunk("appAssessmentReports/updateAssessmentReport", async (payload) => {
  try {
    const response = await updateAssessmentReportRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        assessmentReportItem: response?.data || null,
        actionFlag: "ASSMT_RPRT_UPDT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "ASSMT_RPRT_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "ASSMT_RPRT_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function deleteAssessmentReportRequest(id) {
  return instance.delete(`${API_ENDPOINTS.assessmentReports.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteAssessmentReport = createAsyncThunk("appAssessmentReports/deleteAssessmentReport", async (id) => {
  try {
    const response = await deleteAssessmentReportRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "ASSMT_RPRT_DLT_SCS",
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

// Create a slice
const appAssessmentReportSlice = createSlice({
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
    }
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
        state.assessmentReportItems = action.payload?.assessmentReportItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
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
        state.asessmentReportAnswers = action.payload?.asessmentReportAnswers || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getAssessmentReportAnswersList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getAssessmentReport.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getAssessmentReport.fulfilled, (state, action) => {
        state.assessmentReportItem = action.payload?.assessmentReportItem;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getAssessmentReport.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createAssessmentReport.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createAssessmentReport.fulfilled, (state, action) => {
        state.addAssessmentReportItem = action.payload?.assessmentReportItem || null;
        state.assessmentReportItem = action.payload?.assessmentReportItem || null;
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
        state.assessmentReportItem = action.payload?.assessmentReportItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
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
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteAssessmentReport.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  }
});

export const { cleanAssessmentReportMessage } = appAssessmentReportSlice.actions;

export default appAssessmentReportSlice.reducer;
