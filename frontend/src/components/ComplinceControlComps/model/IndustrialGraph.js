/* eslint-disable react-hooks/exhaustive-deps */

import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const InfoDialForIndustryStandard = React.memo((props) => {

    const formatter = (value) => {
        return `${value.toFixed(0)}%`; // Adjust as needed
    };

    const label = props.label || "Default Label";

    // Generate series value
    const series = useMemo(() => {
        return [props.values];
    }, [props.controllerId]); // This value will only be recalculated once on mount

    // Create options using useMemo
    const options = useMemo(() => ({
        plotOptions: {
            radialBar: {
                startAngle: -130,
                endAngle: 130,
                hollow: {
                    margin: 0,
                    size: "80%",
                    position: "front",
                    dropShadow: {
                        enabled: true,
                        top: 10,
                        left: 0,
                        blur: 4,
                        opacity: 0.24,
                    },
                },
                track: {
                    background: "#fff",
                    strokeWidth: "67%",
                    margin: 0,
                    dropShadow: {
                        enabled: true,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.35,
                    },
                },
                dataLabels: {
                    showOn: "always",
                    name: {
                        offsetY: 0,
                        show: true,
                        color: "#888",
                        fontSize: "auto",
                    },
                    value: {
                        textAnchor: "start",
                        distributed: false,
                        offsetY: 10,
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 100,
                        show: true,
                        formatter: formatter,
                    },
                },
            },
        },
        fill: {
            colors: [
                series[0] < 40 ? "#fd3232" : series[0] < 80 ? "#c74f00" : "#42af25",
            ],
        },
        stroke: {
            lineCap: "round",
        },
        labels: [label],
    }), [series, label, props.controllerId]); // Dependencies for options

    return (
        <>
            <ReactApexChart
                series={series}
                type="radialBar"
                options={options}
                height={props.height || 350} // Provide a default height if not provided
            />
        </>
    );
});

export default InfoDialForIndustryStandard;
