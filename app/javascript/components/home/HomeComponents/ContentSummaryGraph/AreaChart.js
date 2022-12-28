import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./style.css";

const AreaChart = ({ fetchDashboardReport }) => {
    const [xAxisCategories, setXAxisCategories] = React.useState([])
    const [activeCustomers, setActiveCustomers] = React.useState([]);
    const [revenueChurn, setRevenueChurn] = React.useState([]);
    const [chartOptions, setChartOptions] = React.useState({});

    React.useEffect(() => {
        let customers = []
        let dates = []
        let churn = []
        fetchDashboardReport?.activeCustomers?.map(
            (val) => {
                dates.push(val?.date)
                customers.push(+val?.data?.value)
            }
        )
        fetchDashboardReport?.revenueChurn?.map(
            (val) => {
                churn.push(+val?.data?.value)
            }
        )
        setXAxisCategories(dates);
        setActiveCustomers(customers);
        setRevenueChurn(churn)

    }, [fetchDashboardReport])
    React.useEffect(() => {

        let chartData = {
            chart: {
                type: 'column',
                events: {
                    render() {
                        console.log("test", this);
                        setTimeout(() => {
                            this.reflow.bind(this)
                            this.reflow()
                        }, 500);
                    },
                }
            },
            title: {
                text: 'Active Customers'
            },
            xAxis: [{
                gridLineWidth: 16,
                gridLineColor: '#ffff',
                categories: xAxisCategories,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                gridLineWidth: 0,
                labels: {
                    format: '{value}k',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: '',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value} k',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            series: [{
                name: '',
                type: 'area',
                data: activeCustomers,
                tooltip: {
                    valueSuffix: 'k'
                },
                opacity: 0.52,
                fillColor: {
                    linearGradient: { x1: -1, y1: 0, x2: 0, y2: 1.8 },
                    stops: [
                        [0, '#254BD1'],
                        [1, '#f4f4f4']
                    ]
                },
            },
            {
                name: 'Revenue Churn',
                type: 'line',
                data: revenueChurn,
                tooltip: {
                    valueSuffix: 'k'
                }
            }]
        };
        setChartOptions(chartData);
    }, [revenueChurn, activeCustomers, xAxisCategories])
    console.log("chartOptions", chartOptions);

    return (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    );
}

export default AreaChart;
