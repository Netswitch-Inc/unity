// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initQuestion } from "utility/reduxConstant";

async function getQuestionListRequest(params) {
  return instance.get(`${API_ENDPOINTS.questions.list}`, { params })
    .then((items) => items.data).catch((error) => error);
}

export const getQuestionList = createAsyncThunk("appQuestions/getQuestionList", async (params) => {
  try {
    const response = await getQuestionListRequest(params);
    if (response && response.flag) {
      return {
        params,
        questionItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "QESTN_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        questionItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      questionItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getQuestionListFilterRequest(params) {
  return instance.get(`${API_ENDPOINTS.questions.questionFilter}`, { params })
    .then((items) => items.data).catch((error) => error);
}

export const getQuestionListFilter = createAsyncThunk("appQuestions/getQuestionListFilter", async (params) => {
  try {
    const response = await getQuestionListFilterRequest(params);
    if (response && response.flag) {
      return {
        params,
        questionItemsFilterd: response?.data || [],
        actionFlag: "QESTN_LST_FLTRD_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        questionItemsFilterd: [],
        actionFlag: "QESTN_LST_FLTRD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      questionItemsFilterd: [],
      actionFlag: "QESTN_LST_FLTRD_ERR",
      success: "",
      error: error
    }
  }
})

async function getQuestionRequest(params) {
  return instance.get(`${API_ENDPOINTS.questions.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error);
}

export const getQuestion = createAsyncThunk("appQuestions/getQuestion", async (params) => {
  try {
    const response = await getQuestionRequest(params);
    if (response && response.flag) {
      return {
        questionItem: response?.data || null,
        actionFlag: "QESTN_ITM_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        questionItem: null,
        actionFlag: "QESTN_ITM_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      questionItem: null,
      actionFlag: "QESTN_ITM_ERR",
      success: "",
      error: error
    }
  }
})

async function createQuestionRequest(payload) {
  return instance.post(`${API_ENDPOINTS.questions.create}`, payload)
    .then((items) => items.data).catch((error) => error);
}

export const createQuestion = createAsyncThunk("appQuestions/createQuestion", async (payload) => {
  try {
    const response = await createQuestionRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        questionItem: response.data || null,
        actionFlag: "QESTN_CRTD_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "QESTN_CRTD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "QESTN_CRTD_ERR",
      success: "",
      error: error
    }
  }
})

async function updateBulkOrderQuestionRequest(payload) {
  return instance.put(`${API_ENDPOINTS.questions.bulkorderupdate}`, payload)
    .then((items) => items.data).catch((error) => error);
}

export const updateBulkOrderQuestion = createAsyncThunk("appQuestions/updateBulkOrderQuestion", async (payload) => {
  try {
    const response = await updateBulkOrderQuestionRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        actionFlag: "QESTN_BLK_ODR_UPDT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "QESTN_BLK_ODR_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "QESTN_BLK_ODR_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function updateQuestionRequest(payload) {
  return instance.put(`${API_ENDPOINTS.questions.update}`, payload)
    .then((items) => items.data).catch((error) => error);
}

export const updateQuestion = createAsyncThunk("appQuestions/updateQuestion", async (payload) => {
  try {
    const response = await updateQuestionRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        questionItem: response?.data || null,
        actionFlag: "QESTN_UPDT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "QESTN_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "QESTN_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function deleteQuestionRequest(id) {
  return instance.delete(`${API_ENDPOINTS.questions.delete}/${id}`)
    .then((items) => items.data).catch((error) => error);
}

export const deleteQuestion = createAsyncThunk("appQuestions/deleteQuestion", async (id) => {
  try {
    const response = await deleteQuestionRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "QESTN_DLT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        id,
        actionFlag: "QESTN_DLT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      id,
      actionFlag: "QESTN_DLT_ERR",
      success: "",
      error: error
    }
  }
})

// Create a slice
const appAuthSlice = createSlice({
  name: "appQuestions",
  initialState: {
    questionItems: [],
    questionItemsFilterd: [],
    questionItem: initQuestion,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanQuestionMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
      state.questionItemsFilterd = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuestionList.pending, (state) => {
        state.questionItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getQuestionList.fulfilled, (state, action) => {
        state.questionItems = action.payload?.questionItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getQuestionList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getQuestionListFilter.pending, (state) => {
        state.questionItemsFilterd = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getQuestionListFilter.fulfilled, (state, action) => {
        state.questionItemsFilterd = action.payload?.questionItemsFilterd || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getQuestionListFilter.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getQuestion.pending, (state) => {
        state.questionItem = initQuestion;
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getQuestion.fulfilled, (state, action) => {
        state.questionItem = action.payload?.questionItem || initQuestion;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getQuestion.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createQuestion.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questionItem = action.payload?.questionItem || initQuestion;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createQuestion.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateQuestion.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.questionItem = action.payload?.questionItem || initQuestion;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateQuestion.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateBulkOrderQuestion.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateBulkOrderQuestion.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateBulkOrderQuestion.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteQuestion.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  }
});

export const { cleanQuestionMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
