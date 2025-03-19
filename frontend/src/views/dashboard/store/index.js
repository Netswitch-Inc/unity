import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../../utility/AxiosConfig";
import { API_ENDPOINTS } from "utility/ApiEndPoints";

async function getDashboardWidgetDataRequest(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.widgetsOrder}`, { params })
    .then((items) => items.data)
    .catch((error) => error)
}

export const getDashboardWidgetData = createAsyncThunk("appDashboard/DashboardWidgetsOrder", async (params) => {
  try {
    const response = await getDashboardWidgetDataRequest(params);
    if (response && response.flag) {
      return {
        widgetItems: response.data || [],
        actionFlag: "WGT_ITMS",
        success: "",
        error: ""
      }
    } else {
      return {
        widgetItems: [],
        actionFlag: "WGT_ITMS_ERR",
        success: "",
        error: ""
      }
    }
  } catch (error) {
    return {
      widgetItems: [],
      actionFlag: "WGT_ITMS_ERR",
      success: "",
      error: error.message // Ensure error message is string
    }
  }
})

async function updateWidgetsOrderRequest(payload) {
  return instance.post(`${API_ENDPOINTS.dashboard.updateWidgetsOrder}`, payload)
    .then((items) => items.data)
    .catch((error) => error)
}

export const updateWidgetsOrder = createAsyncThunk("appDashboard/updateDashboardWidgetsOrder", async (payload) => {
  try {
    const response = await updateWidgetsOrderRequest(payload);
    if (response && response.flag) {
      return {
        payload,
        actionFlag: "WGT_ITM_ODR",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        payload,
        actionFlag: "WGT_ITM_ODR_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "WGT_ITM_ODR_ERR",
      success: "",
      error: error
    }
  }
})

async function updateWidgetsToggleRequest(payload) {
  return instance.put(`${API_ENDPOINTS.dashboard.updateWidgetsToggle}`, payload)
    .then((items) => items.data)
    .catch((error) => error)
}

export const updateWidgetsToggle = createAsyncThunk("appDashboard/updateDashboardWidgetsToggle", async (payload) => {
  try {
    const response = await updateWidgetsToggleRequest(payload);
    if (response && response.flag) {
      return {
        actionFlag: "WGT_ITM_TGL",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        actionFlag: "WGT_ITM_TGL",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      payload,
      actionFlag: "WGT_ITM_TGL_ERR",
      success: "",
      error: error
    }
  }
})

async function wazuhIndexerSeverityCountDataRequest(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.wazuhSeverityCount}`, { params })
    .then((items) => items.data)
    .catch((error) => error)
}

export const wazuhIndexerSeverityCountData = createAsyncThunk("appDashboard/wazuhIndexerSeverityCountData", async (params) => {
  try {
    const response = await wazuhIndexerSeverityCountDataRequest(params);
    if (response && response.flag) {
      return {
        params,
        wazuhSeverityCount: response?.data || null,
        actionFlag: "WZH_INXR_SVRTY_CNT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        params,
        wazuhSeverityCount: null,
        actionFlag: "WZH_INXR_SVRTY_CNT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      wazuhSeverityCount: null,
      actionFlag: "WZH_INXR_SVRTY_CNT_ERR",
      success: "",
      error: error
    }
  }
})

async function wazuhSeverityDashboardGraphDataRequest(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.wazuhIndexerGraph}`, { params })
    .then((items) => items.data)
    .catch((error) => error)
}

export const wazuhSeverityDashboardGraphData = createAsyncThunk("appDashboard/wazuhSeverityDashboardGraphData", async (params) => {
  try {
    const response = await wazuhSeverityDashboardGraphDataRequest(params);
    if (response && response.flag) {
      return {
        params,
        wazuhSeverityGraphData: response?.data || null,
        actionFlag: "WZH_INXR_GRPH_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        params,
        wazuhSeverityGraphData: null,
        actionFlag: "WZH_INXR_GRPH_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      wazuhSeverityGraphData: null,
      actionFlag: "WZH_INXR_GRPH_ERR",
      success: "",
      error: error
    }
  }
})

async function incidentTrendWazuhStatsDataRequest(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.incidentTrendStats}`, { params })
    .then((items) => items.data)
    .catch((error) => error)
}

export const incidentTrendWazuhStatsData = createAsyncThunk("appDashboard/incidentTrendWazuhStatsData", async (params) => {
  try {
    const response = await incidentTrendWazuhStatsDataRequest(params);
    if (response && response.flag) {
      return {
        params,
        incidentTrendWazuhData: response?.data || null,
        actionFlag: "INCDT_TRND_WZH_GRPH_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        params,
        incidentTrendWazuhData: null,
        actionFlag: "INCDT_TRND_WZH_GRPH_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      incidentTrendWazuhData: null,
      actionFlag: "INCDT_TRND_WZH_GRPH_ERR",
      success: "",
      error: error
    }
  }
})

async function configureAssessmentStatsDataRequest(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.configureAssesmntStats}`, { params })
    .then((items) => items.data)
    .catch((error) => error)
}

export const configureAssessmentStatsData = createAsyncThunk("appDashboard/configureAssessmentStatsData", async (params) => {
  try {
    const response = await configureAssessmentStatsDataRequest(params);
    if (response && response.flag) {
      return {
        params,
        configureAssesmntStatsData: response?.data || [],
        actionFlag: "CNFG_ASMNT_STATS_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        params,
        configureAssesmntStatsData: [],
        actionFlag: "CNFG_ASMNT_STATS_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      configureAssesmntStatsData: [],
      actionFlag: "CNFG_ASMNT_STATS_ERR",
      success: "",
      error: error
    }
  }
})

async function openVASScanReportStatsDataRequest(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.openVASScnReportStats}`, { params })
    .then((items) => items.data)
    .catch((error) => error)
}

export const openVASScanReportStatsData = createAsyncThunk("appDashboard/openVASScanReportStatsData", async (params) => {
  try {
    const response = await openVASScanReportStatsDataRequest(params);    
    if (response && response.flag) {
      return {
        params,
        opnVASScnReportStatsData: response?.data || [],
        actionFlag: "OVSR_STATS_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        params,
        opnVASScnReportStatsData: [],
        actionFlag: "OVSR_STATS_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      opnVASScnReportStatsData: [],
      actionFlag: "OVSR_STATS_ERR",
      success: "",
      error: error
    }
  }
})

async function netSwitchThreatIntelCountryCountDataRequest(params) {
  return instance.get(`${API_ENDPOINTS.dashboard.netSwitchThreatIntelCount}`, { params })
    .then((items) => items.data)
    .catch((error) => error)
}

export const netSwitchThreatIntelCountryCount = createAsyncThunk("appDashboard/netSwitchThreatIntelCountryCount", async (params) => {
  try {
    const response = await netSwitchThreatIntelCountryCountDataRequest(params);
    if (response && response.flag) {
      return {
        params,
        netSwitchThreatIntelCount: response?.data || null,
        actionFlag: "NSTI_CNT_SCS",
        success: response?.message || "",
        error: ""
      }
    } else {
      return {
        params,
        netSwitchThreatIntelCount: null,
        actionFlag: "NSTI_CNT_ERR",
        success: "",
        error: response.message
      }
    }
  } catch (error) {
    return {
      params,
      netSwitchThreatIntelCount: null,
      actionFlag: "NSTI_CNT_ERR",
      success: "",
      error: error
    }
  }
})

const appAuthSlice = createSlice({
  name: "appDashboard",
  initialState: {
    WidgetsOrder: [],
    widgetItems: [],
    netSwitchThreatIntelCount : null,
    wazuhSeverityCount: null,
    wazuhSeverityGraphData: null,
    incidentTrendWazuhData: null,
    configureAssesmntStatsData: [],
    opnVASScnReportStatsData: [],
    actionFlag: "",
    loading: true,
    success: "",
    error: ""
  },
  reducers: {
    cleanDashboardMessage: (state) => {
      state.actionFlag = "";
      state.success = "";
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateWidgetsOrder.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateWidgetsOrder.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateWidgetsOrder.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(updateWidgetsToggle.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(updateWidgetsToggle.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success;
        state.error = action.payload?.error;
      })
      .addCase(updateWidgetsToggle.rejected, (state) => {
        state.loading = true;
        state.success = "";
        state.error = "";
      })
      .addCase(getDashboardWidgetData.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(getDashboardWidgetData.fulfilled, (state, action) => {
        state.widgetItems = action.payload?.widgetItems || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(getDashboardWidgetData.rejected, (state, action) => {
        state.loading = true;
        state.success = "";
        state.error = action.payload?.error || "";
      })
      .addCase(wazuhIndexerSeverityCountData.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(wazuhIndexerSeverityCountData.fulfilled, (state, action) => {
        state.wazuhSeverityCount = action.payload?.wazuhSeverityCount || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(wazuhIndexerSeverityCountData.rejected, (state, action) => {
        state.loading = true;
        state.success = "";
        state.error = action.payload?.error || "";
      })
      .addCase(wazuhSeverityDashboardGraphData.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(wazuhSeverityDashboardGraphData.fulfilled, (state, action) => {
        state.wazuhSeverityGraphData = action.payload?.wazuhSeverityGraphData || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(wazuhSeverityDashboardGraphData.rejected, (state, action) => {
        state.loading = true;
        state.success = "";
        state.error = action.payload?.error || "";
      })
      .addCase(incidentTrendWazuhStatsData.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(incidentTrendWazuhStatsData.fulfilled, (state, action) => {
        state.incidentTrendWazuhData = action.payload?.incidentTrendWazuhData || null;
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(incidentTrendWazuhStatsData.rejected, (state, action) => {
        state.loading = true;
        state.success = "";
        state.error = action.payload?.error || "";
      })
      .addCase(configureAssessmentStatsData.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(configureAssessmentStatsData.fulfilled, (state, action) => {
        state.configureAssesmntStatsData = action.payload?.configureAssesmntStatsData || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(configureAssessmentStatsData.rejected, (state, action) => {
        state.loading = true;
        state.success = "";
        state.error = action.payload?.error || "";
      })
      .addCase(openVASScanReportStatsData.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(openVASScanReportStatsData.fulfilled, (state, action) => {
        state.opnVASScnReportStatsData = action.payload?.opnVASScnReportStatsData || [];
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(openVASScanReportStatsData.rejected, (state, action) => {
        state.loading = true;
        state.success = "";
        state.error = action.payload?.error || "";
      })
      .addCase(netSwitchThreatIntelCountryCount.pending, (state) => {
        state.loading = false;
        state.success = "";
        state.error = "";
      })
      .addCase(netSwitchThreatIntelCountryCount.fulfilled, (state, action) => {
        state.loading = true;
        state.actionFlag = action.payload?.actionFlag;
        state.netSwitchThreatIntelCount = action.payload?.netSwitchThreatIntelCount || null;
        state.success = action.payload?.success || "";
        state.error = action.payload?.error || "";
      })
      .addCase(netSwitchThreatIntelCountryCount.rejected, (state, action) => {
        state.loading = true;
        state.success = "";
        state.error = action.payload?.error || "";
      })
  }
});

export const { cleanDashboardMessage } = appAuthSlice.actions;

export default appAuthSlice.reducer;
