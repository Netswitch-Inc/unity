// ** React Imports
import React from "react";

// ** Third Party Components
import ReactApexChart from "react-apexcharts";

function Gauge(props) {
    const options = {
        plotOptions: {
            radialBar: {
                startAngle: -130,
                endAngle: 130,
                hollow: {
                    margin: 0,
                    size: '77%',
                    position: 'front',
                    dropShadow: {
                        enabled: true,
                        top: 10,
                        left: 0,
                        blur: 4,
                        opacity: 0.9
                    }
                },
                track: {
                    background: '#343651',
                    strokeWidth: '100%',
                    margin: 0,
                    dropShadow: {
                        enabled: true,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.1
                    }
                },
                dataLabels: {
                    showOn: 'always',
                    name: {
                        offsetY: 0,
                        show: true,
                        color: '#fff',
                        fontSize: 'auto'
                    },
                    value: {
                        textAnchor: 'start',
                        distributed: false,
                        offsetY: 10,
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 600,
                        show: true
                    }
                }
            }
        },
        fill: {
            colors: [props?.val < 40 ? '#008FFB' : props?.val < 80 ? '#FFCA44' : '#FD3232']
        },
        stroke: { lineCap: 'round' },
        labels: ['Affected Risk']
    }

    let type = 'radialBar';
    let series = [props?.val || 0];

    return (<>
        <ReactApexChart series={series} type={type} options={options} height={260} />
    </>)
}

export default Gauge
