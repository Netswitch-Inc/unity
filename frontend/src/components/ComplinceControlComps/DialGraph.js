import ReactApexChart from 'react-apexcharts'


function formatter(val) {
    return parseFloat(val).toFixed(2) + "%";
}

function DialBar(props) {
    const options = {
        plotOptions: {
            radialBar: {
                hollow: {
                    size: "60%",
                },
                startAngle: -180,
                endAngle: 180,

                dataLabels: {
                    showOn: "always",
                    name: {
                        show: false,
                    },
                    value: {
                        color: "#fff",
                        offsetY: 5,
                        //   fontSize: "auto",
                        show: true,
                        formatter: formatter,
                    },
                },
            },
        },
        chart: {
            animations: {
                enabled: false,
            },
        },
        fill: {
            colors: [props.val === 0 ? "#fff" : props.val < 40 ? "#b21d1d" : props.val < 80 ? "#c74f00" : "#42af25"]
        }
    }
    const series = [props?.val];
    const type = "radialBar";

    return (
        <div className='d-none'>
            <ReactApexChart
                series={series}
                type={type}
                options={options}
                height={150}
                width={150}
                style={{ margin: '0 auto' }}
            />
        </div>
    );
}
export default DialBar