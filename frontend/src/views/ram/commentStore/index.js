// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

// import { initialComment } from "utility/reduxConstant";

async function getCommentListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Comment.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getCommentList = createAsyncThunk(
  "appComment/getCommentList",
  async (params) => {
    try {
      const response = await getCommentListRequest(params);
      if (response && response.flag) {
        return {
          params,
          commentItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          commentItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        commentItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Comment.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editCommentRequest = createAsyncThunk(
  "appComment/editComments",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          commentItem: response.data,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          commentItem: null,
          actionFlag: "",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        commentItem: null,
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function createCommentRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.Comment.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createComment = createAsyncThunk(
  "appComment/createComment",
  async (payload) => {
    try {
      const response = await createCommentRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          commentItem: response.data || null,
          actionFlag: "COMMENT_CREATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "COMMENT_CREATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "COMMENT_CREATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateCommentRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.Comment.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateComment = createAsyncThunk(
  "appComment/updateComment",
  async (payload) => {
    try {
      const response = await updateCommentRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          commentItem: response.data || null,
          actionFlag: "COMMENT_UPDATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "COMMENT_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "COMMENT_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteCommentRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.Comment.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteComment = createAsyncThunk(
  "appComment/deleteComment",
  async (id) => {
    try {
      const response = await deleteCommentRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "COMMENT_DELETED_SUCCSESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          id,
          actionFlag: "COMMENT_DELETED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        id,
        actionFlag: "COMMENT_DELETED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

// Create a slice
const appAuthSlice = createSlice({
  name: "appComment",
  initialState: {
    commentItems: [],
    commentItem: '',
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanCommentMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
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
        state.actionFlag = action.payload?.actionFlag || "COMMENT_LISTING";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getCommentList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(editCommentRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.commentItem = action.payload.commentItem;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(createComment.pending, (state) => {
        state.loading = false;
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
  },
});

export const { cleanCommentMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
