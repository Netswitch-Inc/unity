import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../utility/AxiosConfig";
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getHelpdeskGraphData(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.helpdeskTicket}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getHelpdeskGraphList = createAsyncThunk("appHelpdesk/getHelpdeskGraph", async (params) => {
  try {
    const response = await getHelpdeskGraphData(params);
    if (response && response.flag) {
      return {
        params,
        helpdeskStatsData: response?.data || [],
        actionFlag: "HLP_DSK_STATS_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        helpdeskStatsData: [],
        actionFlag: "HLP_DSK_STATS_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      helpdeskStatsData: [],
      actionFlag: "HLP_DSK_STATS_ERR",
      success: "",
      error: error
    }
  }
})

const appHelpdeskSlice = createSlice({
  name: "appHelpdesk",
  initialState: {
    helpdeskStatsData: [],
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanHelpdeskMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHelpdeskGraphList.pending, (state, action) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getHelpdeskGraphList.fulfilled, (state, action) => {
        state.helpdeskStatsData = action.payload?.helpdeskStatsData || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(getHelpdeskGraphList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
  },
});

export const { cleanHelpdeskMessage } = appHelpdeskSlice.actions;

export default appHelpdeskSlice.reducer;
