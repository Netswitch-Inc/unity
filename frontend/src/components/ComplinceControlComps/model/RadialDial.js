import React from 'react';
import ReactApexChart from 'react-apexcharts';
function InfoDial(props) {

    const formatter = (value) => {
        return `${value.toFixed(0)}%`; // Adjust as needed
    };


    // Ensure val has a default value if undefined
    // const val = props.val || 0;
    const label = props.label || "Default Label";
    let series
    // Generate series based on the label
    if ("Resilience Index") {
        series = props.values;
    }
    if (label !== "Resilience Index") {
        series = [Math.random() * (85 - 70) + 70];
    }
    const options = {
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
                    margin: 0, // margin is in pixels
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
    };

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
}

export default InfoDial