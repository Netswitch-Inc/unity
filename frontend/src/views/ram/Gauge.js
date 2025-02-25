import ReactApexChart from "react-apexcharts";
import React from "react";

function Gauge(props) {
    const options = {
        plotOptions: {
            radialBar: {
                startAngle: -130,
                endAngle: 130,
                hollow: {
                    margin: 0,
                    size: '70%',
                    position: 'front',
                    dropShadow: {
                        enabled: true,
                        top: 10,
                        left: 0,
                        blur: 4,
                        opacity: 0.9,
                    },
                },
                track: {
                    background: '#fff',
                    strokeWidth: '100%',
                    margin: 0,
                    dropShadow: {
                        enabled: true,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.1,
                    },
                },
                dataLabels: {
                    showOn: 'always',
                    name: {
                        offsetY: 0,
                        show: true,
                        color: '#888',
                        fontSize: 'auto',
                    },
                    value: {
                        textAnchor: 'start',
                        distributed: false,
                        offsetY: 10,
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 100,
                        show: true,
                    },
                },
            },
        },
        fill: {
            colors: [props?.val < 40 ? '#008ffb' : props?.val < 80 ? '#ffca44' : '#fd3232'],
        },
        stroke: {
            lineCap: 'round',
        },
        labels: ['Affected Risk'],
    };
    let series = [props?.val || 0];
    let type = 'radialBar';

    return (
        <>
            <ReactApexChart series={series} type={type} options={options} height="280" />
        </>
    );
}


export default Gauge
