// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

// import { initAnswerItem } from "utility/reduxConstant";

async function getAnswerListRequest(params) {
  return instance.get(`${API_ENDPOINTS.answers.list}`, { params })
    .then((items) => items.data).catch((error) => error);
}

export const getAnswerList = createAsyncThunk("appAnswers/getAnswerList", async (params) => {
  try {
    const response = await getAnswerListRequest(params);
    if (response && response.flag) {
      return {
        params,
        answerItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "ANSR_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        answerItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      answerItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getAnswerRequest(params) {
  return instance.get(`${API_ENDPOINTS.answers.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getAnswer = createAsyncThunk("appAnswers/getAnswer", async (params) => {
  try {
    const response = await getAnswerRequest(params);
    if (response && response.flag) {
      return {
        answerItem: response?.data || null,
        actionFlag: "ANSR_ITM_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        answerItem: null,
        actionFlag: "ANSR_ITM_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      answerItem: null,
      actionFlag: "ANSR_ITM_ERR",
      success: "",
      error: error
    }
  }
})

async function createAnswerRequest(payload) {
  return instance.post(`${API_ENDPOINTS.answers.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createAnswer = createAsyncThunk("appAnswers/createAnswer", async (payload) => {
  try {
    const response = await createAnswerRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        answerItem: response?.data || null,
        actionFlag: "ANSR_CRTD_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "ANSR_CRTD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "ANSR_CRTD_ERR",
      success: "",
      error: error
    }
  }
})

async function updateAnswerRequest(payload) {
  return instance.put(`${API_ENDPOINTS.answers.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateAnswer = createAsyncThunk("appAnswers/updateAnswer", async (payload) => {
  try {
    const response = await updateAnswerRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        answerItem: response?.data || null,
        actionFlag: "ANSR_UPDT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "ANSR_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "ANSR_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function deleteAnswerRequest(id) {
  return instance.delete(`${API_ENDPOINTS.answers.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteAnswer = createAsyncThunk("appAnswers/deleteAnswer", async (id) => {
  try {
    const response = await deleteAnswerRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "ANSR_DLT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        id,
        actionFlag: "ANSR_DLT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      id,
      actionFlag: "ANSR_DLT_ERR",
      success: "",
      error: error
    }
  }
})

// Create a slice
const appAnswerSlice = createSlice({
  name: "appAnswers",
  initialState: {
    answerItems: [],
    answerItem: null,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
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
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getAnswerList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getAnswer.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getAnswer.fulfilled, (state, action) => {
        state.answerItem = action.payload.answerItem;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getAnswer.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createAnswer.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        state.answerItem = action.payload?.answerItem || null;
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
        state.answerItem = action.payload?.answerItem || null;
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
  }
});

export const { cleanAnswerMessage } = appAnswerSlice.actions;

export default appAnswerSlice.reducer;
