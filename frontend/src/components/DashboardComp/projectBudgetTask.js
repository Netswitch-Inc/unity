// ** Reactstrap Imports
import {
    CardBody,
    CardTitle,
    CardHeader,
} from "reactstrap";

// ** Third Party Components
import { Bar } from "react-chartjs-2";

const ProjectBudgetByTask = ({
    isEmptyBlankDataDisplay
}) => {
    const budgetTaskChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        tooltips: {
            backgroundColor: "#f5f5f5",
            titleFontColor: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
        },
        responsive: true,
        scales: {
            yAxes: {
                grid: {
                    display: true,
                    color: "rgba(225,78,202,0.1)",
                    borderColor: "transparent",
                    borderDash: [],
                },
                ticks: {
                    padding: 20,
                    color: "#9e9e9e",
                    beginAtZero: true,
                },
            },
            xAxes: {
                grid: {
                    display: true,
                    color: "rgba(225,78,202,0.1)",
                    borderColor: "transparent",
                    borderDash: [],
                },
                ticks: {
                    padding: 20,
                    color: "#9e9e9e",
                },
            },
        },
    };

    return (<>
        <CardHeader>
            {/* <ExportPdf className="d-flex justify-content-end" /> */}
            {/* <h5 className="card-category">Projected Budget by Task</h5> */}
            <CardTitle tag="h5">Projected Budget by Task</CardTitle>
            {!isEmptyBlankDataDisplay ? (
                <CardTitle tag="h3">
                    <i className="tim-icons icon-coins text-primary" /> $776K
                </CardTitle>
            ) : null}
        </CardHeader>

        <CardBody>
            {isEmptyBlankDataDisplay ? (
                <p className="text-center align-middle">N/A</p>
            ) : null}

            {!isEmptyBlankDataDisplay ? (
                <div className="chart-area">
                    <Bar
                        data={(canvas) => {
                            let ctx = canvas.getContext("2d");
                            let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
                            gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
                            gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
                            gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

                            return {
                                //the chart label
                                labels: isEmptyBlankDataDisplay ? [] : ["CIS", "SIEM", "VAS", "IPDF", "Pentest"],
                                datasets: [
                                    {
                                        label: "Budget",
                                        fill: true,
                                        backgroundColor: gradientStroke,
                                        hoverBackgroundColor: gradientStroke,
                                        borderColor: "#d048b6",
                                        borderWidth: 2,
                                        borderDash: [],
                                        borderDashOffset: 0.0,
                                        //the chart data
                                        data: isEmptyBlankDataDisplay ? [] : [10000, 15000, 25000, 1600, 26000],
                                    },
                                ],
                            };
                        }}
                        options={budgetTaskChartOptions}
                    />
                </div>
            ) : null}
        </CardBody>
    </>)
}

export default ProjectBudgetByTask