
import Loader from "react-loader";
import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const ScoreHistoryLineChartComp = (props) => {
    const { data, loadedSUbControl, height, values } = props;

    // Memoize categories and computedValues
    const { categories, computedValues } = useMemo(() => {
        let categories = [];
        let computedValues = [];

        if (data) {
            data&&data.slice(0).reverse().forEach((element) => {
                categories.push(`${element?.Month}-${element?.Year}`);
                computedValues.push(element?.Score == null ? 0 : parseFloat(element.Score).toFixed(2));
            });
        }
        return { categories, computedValues };
    }, [data]); // Recalculate when data changes

    // Memoize chart options
    const options = useMemo(() => ({
        chart: {
            id: "my-chart",
            type: "line",
            height: 350,
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
        },
        grid: {
            show: true,
        },
        theme: {
            palette: "palette1",
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: "#ffffff",
                    rotate: -45,
                    rotateAlways: true,
                },
            },
        },
        yaxis: {
            title: {
                text: "Program Score",
                style: {
                    fontWeight: 450,
                    color: "#ffffff",
                },
            },
            labels: {
                style: {
                    colors: "#ffffff",
                },
            },
        },
    }), [categories]); // Only recalculate when categories change

    // Memoize series
    const series = useMemo(() => [{
        data: values || computedValues,
    }], [values, computedValues]); // Recalculate when values or computedValues change

    return (
        <>
            <Loader
                loaded={loadedSUbControl}
                lines={13}
                length={10}
                width={5}
                radius={30}
                corners={1}
                rotate={0}
                direction={1}
                color="#2774f6"
                speed={1}
                trail={60}
                shadow={false}
                hwaccel={false}
                className="spinner spinner-compliance"
                zIndex={2e9}
                scale={1.0}
                loadedClassName="loadedContent"
            />
            <ReactApexChart
                options={options}
                type="line"
                series={series}
                height={height}
            />
        </>
    );
}

export default ScoreHistoryLineChartComp;
