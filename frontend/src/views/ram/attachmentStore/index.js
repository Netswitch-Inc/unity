// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import instance from "../../../utility/AxiosConfig";

import { API_ENDPOINTS } from "utility/ApiEndPoints";

// import { initialAttachment } from "utility/reduxConstant";

async function getAttachmentListRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Attachment.listing}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getAttachmentList = createAsyncThunk(
  "appAttachment/getAttachmentList",
  async (params) => {
    try {
      const response = await getAttachmentListRequest(params);
      if (response && response.flag) {
        return {
          params,
          attachmentItems: response?.data || [],
          pagination: response?.pagination || null,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          params,
          attachmentItems: [],
          actionFlag: "",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        params,
        attachmentItems: [],
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function editRequest(params) {
  return instance
    .get(`${API_ENDPOINTS.Attachment.edit}/${params?.id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const editAttachmentRequest = createAsyncThunk(
  "appAttachment/editAttachments",
  async (params) => {
    try {
      const response = await editRequest(params);
      if (response && response.flag) {
        return {
          attachmentItem: response.data,
          actionFlag: "",
          success: "",
          error: "",
        };
      } else {
        return {
          attachmentItem: null,
          actionFlag: "",
          success: "",
          error: "",
        };
      }
    } catch (error) {
      return {
        attachmentItem: null,
        actionFlag: "",
        success: "",
        error: error,
      };
    }
  }
);

async function createAttachmentRequest(payload) {
  return instance
    .post(`${API_ENDPOINTS.Attachment.create}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const createAttachment = createAsyncThunk(
  "appAttachment/createAttachment",
  async (payload) => {
    try {
      const response = await createAttachmentRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          attachmentItem: response.data || null,
          actionFlag: "ATTACHMENT_CREATED_SUCCESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "ATTACHMENT_CREATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "ATTACHMENT_CREATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function updateAttachmentRequest(payload) {
  return instance
    .put(`${API_ENDPOINTS.Attachment.update}`, payload)
    .then((items) => items.data)
    .catch((error) => error);
}

export const updateAttachment = createAsyncThunk(
  "appAttachment/updateAttachment",
  async (payload) => {
    try {
      const response = await updateAttachmentRequest(payload);
      if (response && response.flag) {
        return {
          payload,
          attachmentItem: response.data || null,
          actionFlag: "ATTACHMENT_UPDATED",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          payload,
          actionFlag: "ATTACHMENT_UPDATED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        payload,
        actionFlag: "ATTACHMENT_UPDATED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

async function deleteAttachmentRequest(id) {
  return instance
    .delete(`${API_ENDPOINTS.Attachment.delete}/${id}`)
    .then((items) => items.data)
    .catch((error) => error);
}

export const deleteAttachment = createAsyncThunk(
  "appAttachment/deleteAttachment",
  async (id) => {
    try {
      const response = await deleteAttachmentRequest(id);
      if (response && response.flag) {
        return {
          id,
          actionFlag: "ATTACHMENT_DELETED_SUCCSESS",
          success: response?.message || "",
          error: "",
        };
      } else {
        return {
          id,
          actionFlag: "ATTACHMENT_DELETED_ERROR",
          success: "",
          error: response.message,
        };
      }
    } catch (error) {
      return {
        id,
        actionFlag: "ATTACHMENT_DELETED_ERROR",
        success: "",
        error: error,
      };
    }
  }
);

// Create a slice
const appAuthSlice = createSlice({
  name: "appAttachment",
  initialState: {
    attachmentItems: [],
    attachmentItem: '',
    pagination: null,
    actionFlag: "",
    loading: true,
    success: "",
    error: "",
  },
  reducers: {
    cleanAttachmentMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttachmentList.pending, (state) => {
        state.attachmentItems = [];
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getAttachmentList.fulfilled, (state, action) => {
        state.attachmentItems = action.payload?.attachmentItems || [];
        state.pagination = action.payload?.pagination || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "ATTACHMENT_LISTING";
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(getAttachmentList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(editAttachmentRequest.fulfilled, (state, action) => {
        state.type = "EDIT";
        state.loading = true;
        state.attachmentItem = action.payload.attachmentItem;
        state.success = action.payload.success;
        state.error = action.payload.error;
      })
      .addCase(createAttachment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(createAttachment.fulfilled, (state, action) => {
        state.attachmentItem = action.payload?.attachmentItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(createAttachment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateAttachment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateAttachment.fulfilled, (state, action) => {
        state.attachmentItem = action.payload?.attachmentItem || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateAttachment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteAttachment.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(deleteAttachment.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      });
  },
});

export const { cleanAttachmentMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
