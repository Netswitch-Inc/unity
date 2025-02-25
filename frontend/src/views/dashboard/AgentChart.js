import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { wazuhIndexerSeverityCountData } from "./store/index";

import Chart from "react-apexcharts";
import { CardBody, CardTitle, CardHeader } from "reactstrap";

const AgentChart = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const store = useSelector((state) => state.dashboard);

    const handleGetWazuhIndexerCountData = useCallback((refreshType = "") => {
        const payload = {}
        if (refreshType) { payload.refresh_type = refreshType; }

        dispatch(wazuhIndexerSeverityCountData(payload))
    }, [dispatch])

    // Get the dynamic data from the store
    const agentCounts = store?.wazuhSeverityCount?.agentCounts || { active: 0, disconnected: 0 };

    // Configure chart options
    const chartOptions = {
        series: [agentCounts.active, agentCounts.disconnected],
        labels: ["Active", "Disconnected"],
        colors: ["#9cc904", "#ea5f16"], // Green for Active, Red for Disconnected
        chart: {
            type: "donut"
        },
        legend: {
            position: "bottom",
            markers: {
                radius: 12
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "70%"
                }
            }
        }
    }

    return (<>
        <CardHeader>
            <CardTitle tag="h3" className="cursor-pointer" onClick={() => navigate("/admin/configuration-assessment-chart")}>
                <i className="tim-icons icon-alert-circle-exc text-primary" />
                Agents Summary
            </CardTitle>
        </CardHeader>

        <CardBody>
            <Chart
                options={chartOptions}
                series={chartOptions.series}
                type="donut"
                height={300}
            />

            <div className="refresh-buttons mt-3">
                <div className="cursor-pointer" onClick={() => handleGetWazuhIndexerCountData("agent")}>
                    <i className="tim-icons icon-refresh-01"></i>Refresh
                </div>
            </div>
        </CardBody>
    </>)
}

export default AgentChart;
