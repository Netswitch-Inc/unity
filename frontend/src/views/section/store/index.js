// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

import { initSection } from "utility/reduxConstant";

async function getSectionListRequest(params) {
  return instance.get(`${API_ENDPOINTS.sections.list}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getSectionList = createAsyncThunk("appSections/getSectionList", async (params) => {
  try {
    const response = await getSectionListRequest(params);
    if (response && response.flag) {
      return {
        params,
        sectionItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "SCTN_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        sectionItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      sectionItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getSectionListByAssessmentRequest(params) {
  return instance.get(`${API_ENDPOINTS.sections.byAssessment}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getSectionListByAssessment = createAsyncThunk("appSections/getSectionListByAssessment", async (params) => {
  try {
    const response = await getSectionListByAssessmentRequest(params);
    if (response && response.flag) {
      return {
        params,
        sectionItemsByAssessment: response?.data || [],
        actionFlag: "SCTN_LST_BY_ASSMNT_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        sectionItemsByAssessment: [],
        actionFlag: "SCTN_LST_BY_ASSMNT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      sectionItemsByAssessment: [],
      actionFlag: "SCTN_LST_BY_ASSMNT_ERR",
      success: "",
      error: error
    }
  }
})

async function getSectionRequest(params) {
  return instance.get(`${API_ENDPOINTS.sections.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getSection = createAsyncThunk("appSections/getSection", async (params) => {
  try {
    const response = await getSectionRequest(params);
    if (response && response.flag) {
      return {
        sectionItem: response?.data || null,
        actionFlag: "SCTN_ITM",
        success: "",
        error: ""
      }
    } else {
      return {
        sectionItem: null,
        actionFlag: "",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      sectionItem: null,
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function createSectionRequest(payload) {
  return instance.post(`${API_ENDPOINTS.sections.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createSection = createAsyncThunk("appSections/createSection", async (payload) => {
  try {
    const response = await createSectionRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        sectionItem: response.data || null,
        actionFlag: "SCTN_CRTD",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "SCTN_CRTD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "SCTN_CRTD_ERR",
      success: "",
      error: error
    }
  }
})

async function updateSectionRequest(payload) {
  return instance.put(`${API_ENDPOINTS.sections.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateSection = createAsyncThunk("appSections/updateSection", async (payload) => {
  try {
    const response = await updateSectionRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        sectionItem: response.data || null,
        actionFlag: "SCTN_UPDT",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "SCTN_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "SCTN_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function deleteSectionRequest(id) {
  return instance.delete(`${API_ENDPOINTS.sections.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteSection = createAsyncThunk("appSections/deleteSection", async (id) => {
  try {
    const response = await deleteSectionRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "SCTN_DLT_SCS",
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
const appSectionSlice = createSlice({
  name: "appSections",
  initialState: {
    sectionItems: [],
    sectionItemsByAssessment: [],
    sectionItem: initSection,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanSectionMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSectionList.pending, (state) => {
        state.sectionItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getSectionList.fulfilled, (state, action) => {
        state.sectionItems = action.payload?.sectionItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getSectionList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getSectionListByAssessment.pending, (state) => {
        state.sectionItemsByAssessment = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getSectionListByAssessment.fulfilled, (state, action) => {
        state.sectionItemsByAssessment = action.payload?.sectionItemsByAssessment || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getSectionListByAssessment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getSection.pending, (state) => {
        state.sectionItem = initSection;
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getSection.fulfilled, (state, action) => {
        state.loading = true;
        state.sectionItem = action.payload?.sectionItem || initSection;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getSection.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createSection.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.sectionItem = action.payload?.sectionItem || initSection;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createSection.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateSection.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.sectionItem = action.payload?.sectionItem || initSection;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateSection.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteSection.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteSection.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  }
});

export const { cleanSectionMessage } = appSectionSlice.actions;

export default appSectionSlice.reducer;
