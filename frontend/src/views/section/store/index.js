// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

import { initialSection } from "utility/reduxConstant";

async function getSectionListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Section.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getSectionList = createAsyncThunk(
  "appSection/getConnectionList",
  async (params) => {
    try {
      const response = await getSectionListRequest(params);
      if (response && response.flag) {
        return {
          params,
          sectionItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          sectionItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        sectionItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function getSectionListByAssessmentRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Section.byAssessment}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getSectionListByAssessment = createAsyncThunk(
  "appSection/getSectionListByAssessment",
  async (params) => {
    try {
      const response = await getSectionListByAssessmentRequest(params);
      if (response && response.flag) {
        return {
          params,
          sectionItemsByAssessment: response?.data || [],
          actionFlag: "SECTION_LIST_BY_ASSESSMENT_SUCCESS",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          sectionItemsByAssessment: [],
          actionFlag: "SECTION_LIST_BY_ASSESSMENT_SUCCESS",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        sectionItemsByAssessment: [],
        actionFlag: "SECTION_LIST_BY_ASSESSMENT_SUCCESS",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Section.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editSectionRequest = createAsyncThunk(
  "appSection/editConnections",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          sectionItem: response.data,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          sectionItem: null,
          actionFlag: "",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        sectionItem: null,
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function createSectionRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.Section.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createSection = createAsyncThunk(
  "appSection/createSection",
  async (payload) => {
    try {
      const response = await createSectionRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          sectionItem: response.data || null,
          actionFlag: "SECTION_CREATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "SECTION_CREATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "SECTION_CREATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateSectionRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.Section.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateSection = createAsyncThunk(
  "appSection/updateSection",
  async (payload) => {
    try {
      const response = await updateSectionRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          sectionItem: response.data || null,
          actionFlag: "SECTION_UPDATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "SECTION_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "SECTION_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteSectionRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.Section.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteSection = createAsyncThunk(
  "appSection/deleteSection",
  async (id) => {
    try {
      const response = await deleteSectionRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "SCTN_DLT_SCS",
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
  name: "appSection",
  initialState: {
    sectionItems: [],
    sectionItemsByAssessment: [],
    sectionItem: initialSection,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanSectionMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
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
        state.actionFlag = action.payload?.actionFlag || "SECTION_LISTING";
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
        state.sectionItemsByAssessment =
          action.payload?.sectionItemsByAssessment || [];
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
      .addCase(editSectionRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.sectionItem = action.payload.sectionItem;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(createSection.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.sectionItem = action.payload?.sectionItem || null;
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
        state.sectionItem = action.payload?.sectionItem || null;
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
        state.actionFlag = action.payload?.actionFlag || "SECTION_DELETED";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteSection.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  },
});

export const { cleanSectionMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
