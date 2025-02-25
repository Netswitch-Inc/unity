// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";
import { initialQuestion } from "utility/reduxConstant";

async function getQuestionListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.question.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getQuestionList = createAsyncThunk(
  "appQuestion/getConnectionList",
  async (params) => {
    try {
      const response = await getQuestionListRequest(params);
      if (response && response.flag) {
        return {
          params,
          questionItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          questionItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        questionItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function getQuestionListFilterRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.question.questionFilter}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getQuestionListFilter = createAsyncThunk(
  "appQuestion/getQuestionFilterList",
  async (params) => {
    try {
      const response = await getQuestionListFilterRequest(params);
      if (response && response.flag) {
        return {
          params,
          questionItemsFilterd: response?.data || [],
          actionFlag: "QUESTION_LIST_FILTERED_SUCCESS",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          questionItemsFilterd: [],
          actionFlag: "QUESTION_LIST_FILTERED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        questionItemsFilterd: [],
        actionFlag: "QUESTION_LIST_FILTERED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.question.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editQuestionRequest = createAsyncThunk(
  "appQuestion/editConnections",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          questionItem: response.data,
          actionFlag: "GET_QUESTION_DATA_SUCCESS",
          success: "",
          error: "",
        };
      } else {
        return {
          questionItem: null,
          actionFlag: "GET_QUESTION_DATA_ERROR",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        questionItem: null,
        actionFlag: "GET_QUESTION_DATA_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function createQuestionRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.question.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createQuestion = createAsyncThunk(
  "appQuestion/createQuestion",
  async (payload) => {
    try {
      const response = await createQuestionRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          questionItem: response.data || null,
          actionFlag: "QUESTION_CREATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "QUESTION_CREATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "QUESTION_CREATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateBulkOrderQuestionRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.question.bulkorderupdate}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateBulkOrderQuestion = createAsyncThunk(
  "appQuestion/updateBulkOrderQuestion",
  async (payload) => {
    try {
      const response = await updateBulkOrderQuestionRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          actionFlag: "QUESTION_BULK_ORDER_UPDATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "QUESTION_BULK_ORDER_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "QUESTION_BULK_ORDER_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateQuestionRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.question.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateQuestion = createAsyncThunk(
  "appQuestion/updateQuestion",
  async (payload) => {
    try {
      const response = await updateQuestionRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          questionItem: response.data || null,
          actionFlag: "QUESTION_UPDATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "QUESTION_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "QUESTION_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteQuestionRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.question.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteQuestion = createAsyncThunk(
  "appQuestion/deleteQuestion",
  async (id) => {
    try {
      const response = await deleteQuestionRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "SUCCESS_DELETED_QUESTION",
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
  name: "appQuestion",
  initialState: {
    questionItems: [],
    questionItemsFilterd: [],
    questionItem: initialQuestion,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanQuestionMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
      state.questionItemsFilterd = [];
    },
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
        state.actionFlag = action.payload?.actionFlag || "QUESTION_LISTING";
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
      .addCase(editQuestionRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.questionItem = action.payload.questionItem;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(createQuestion.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questionItem = action.payload?.questionItem || null;
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
        state.questionItem = action.payload?.questionItem || null;
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
  },
});

export const { cleanQuestionMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
