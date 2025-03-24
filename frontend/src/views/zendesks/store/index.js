import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../utility/AxiosConfig";
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getHelpdeskGraphData(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.zendeskTicket}`, { params })
    .then((items) => items.data)
    .catch((error) => error);
}

export const getZendeskGraphList = createAsyncThunk("appZendesk/getHelpdeskGraph", async (params) => {
  try {
    const response = await getHelpdeskGraphData(params);

    if (response && response.flag) {
      return {
        params,
        zendeskStatsData: response?.data || [],
        actionFlag: "ZEN_DSK_STATS_SCS",
        success: "",
        error: ""
      }
    } else {
      return {
        params,
        zendeskStatsData: [],
        actionFlag: "ZEN_DSK_STATS_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      zendeskStatsData: [],
      actionFlag: "ZEN_DSK_STATS_ERR",
      success: "",
      error: error
    }
  }
})

const appZendeskSlice = createSlice({
  name: "appZendesk",
  initialState: {
    zendeskStatsData: [],
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanZendeskMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getZendeskGraphList.pending, (state, action) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getZendeskGraphList.fulfilled, (state, action) => {
        state.zendeskStatsData = action.payload?.zendeskStatsData || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag || "";
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(getZendeskGraphList.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
  },
});

export const { cleanZendeskMessage } = appZendeskSlice.actions;

export default appZendeskSlice.reducer;
