// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

// import { initComment } from "utility/reduxConstant";

async function getCommentListRequest(params) {
  return instance.get(`${API_ENDPOINTS.comments.list}`, { params })
    .then((items) => items.data).catch((error) => error)
}

export const getCommentList = createAsyncThunk("appComments/getCommentList", async (params) => {
  try {
    const response = await getCommentListRequest(params);
    if (response && response.flag) {
      return {
        params,
        commentItems: response?.data || [],
        pagination: response?.pagination || null,
        actionFlag: "COMMENT_LST",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        commentItems: [],
        actionFlag: "",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      commentItems: [],
      actionFlag: "",
      success: "",
      error: error
    }
  }
})

async function getCommentRequest(params) {
  return instance.get(`${API_ENDPOINTS.comments.get}/${params?.id}`)
    .then((items) => items.data).catch((error) => error)
}

export const getComment = createAsyncThunk("appComments/getComment", async (params) => {
  try {
    const response = await getCommentRequest(params);
    if (response && response.flag) {
      return {
        commentItem: response?.data || "",
        actionFlag: "COMMENT_ITM",
        success: "",
        error: ""
      }
    } else {
      return {
        commentItem: null,
        actionFlag: "COMMENT_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      commentItem: null,
      actionFlag: "COMMENT_ERR",
      success: "",
      error: error
    }
  }
})

async function createCommentRequest(payload) {
  return instance.post(`${API_ENDPOINTS.comments.create}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const createComment = createAsyncThunk("appComments/createComment", async (payload) => {
  try {
    const response = await createCommentRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        commentItem: response.data || null,
        actionFlag: "COMMENT_CRTD_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "COMMENT_CRTD_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "COMMENT_CRTD_ERR",
      success: "",
      error: error
    }
  }
})

async function updateCommentRequest(payload) {
  return instance.put(`${API_ENDPOINTS.comments.update}`, payload)
    .then((items) => items.data).catch((error) => error)
}

export const updateComment = createAsyncThunk("appComments/updateComment", async (payload) => {
  try {
    const response = await updateCommentRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        commentItem: response.data || null,
        actionFlag: "COMMENT_UPDT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "COMMENT_UPDT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "COMMENT_UPDT_ERR",
      success: "",
      error: error
    }
  }
})

async function deleteCommentRequest(id) {
  return instance.delete(`${API_ENDPOINTS.comments.delete}/${id}`)
    .then((items) => items.data).catch((error) => error)
}

export const deleteComment = createAsyncThunk("appComments/deleteComment", async (id) => {
  try {
    const response = await deleteCommentRequest(id);
    if (response && response.flag) {
      return {
        id,
        actionFlag: "COMMENT_DLT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        id,
        actionFlag: "COMMENT_DLT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      id,
      actionFlag: "COMMENT_DLT_ERR",
      success: "",
      error: error
    }
  }
})

// Create a slice
const appCommentSlice = createSlice({
  name: "appComments",
  initialState: {
    commentItems: [],
    commentItem: null,
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanCommentMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCommentList.pending, (state) => {
        state.commentItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getCommentList.fulfilled, (state, action) => {
        state.commentItems = action.payload?.commentItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getCommentList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getComment.pending, (state) => {
        state.commentItem = null;
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.commentItem = action.payload?.commentItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(getComment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(createComment.pending, (state) => {
        state.loading = false;
        state.actionFlag = "";
        state.success = "";
        state.error = "";
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.commentItem = action.payload?.commentItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createComment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.commentItem = action.payload?.commentItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateComment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteComment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  }
});

export const { cleanCommentMessage } = appCommentSlice.actions;

export default appCommentSlice.reducer;
