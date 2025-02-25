// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

// import { initialAnswer } from "utility/reduxConstant";

async function getAnswerListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Answer.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getAnswerList = createAsyncThunk(
  "appAnswer/getAnswerList",
  async (params) => {
    try {
      const response = await getAnswerListRequest(params);
      if (response && response.flag) {
        return {
          params,
          answerItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          answerItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        answerItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Answer.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editAnswerRequest = createAsyncThunk(
  "appAnswer/editAnswers",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          answerItem: response.data,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          answerItem: null,
          actionFlag: "",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        answerItem: null,
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function createAnswerRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.Answer.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createAnswer = createAsyncThunk(
  "appAnswer/createAnswer",
  async (payload) => {
    try {
      const response = await createAnswerRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          // answerItem: response.data || null,
          actionFlag: "ANSWER_CREATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "ANSWER_CREATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "ANSWER_CREATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateAnswerRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.Answer.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateAnswer = createAsyncThunk(
  "appAnswer/updateAnswer",
  async (payload) => {
    try {
      const response = await updateAnswerRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          // answerItem: response.data || null,
          actionFlag: "ANSWER_UPDATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "ANSWER_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "ANSWER_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteAnswerRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.Answer.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteAnswer = createAsyncThunk(
  "appAnswer/deleteAnswer",
  async (id) => {
    try {
      const response = await deleteAnswerRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "ANSWER_DELETED_SUCCSESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          id,
          actionFlag: "ANSWER_DELETED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        id,
        actionFlag: "ANSWER_DELETED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

// Create a slice
const appAuthSlice = createSlice({
  name: "appAnswer",
  initialState: {
    answerItems: [],
    answerItem: null,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanAnswerMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAnswerList.pending, (state) => {
        state.answerItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getAnswerList.fulfilled, (state, action) => {
        state.answerItems = action.payload?.answerItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "ANSWER_LISTING";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getAnswerList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(editAnswerRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.answerItem = action.payload.answerItem;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(createAnswer.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        // state.answerItem = action.payload?.answerItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createAnswer.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateAnswer.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateAnswer.fulfilled, (state, action) => {
        // state.answerItem = action.payload?.answerItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateAnswer.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteAnswer.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteAnswer.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteAnswer.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  },
});

export const { cleanAnswerMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
