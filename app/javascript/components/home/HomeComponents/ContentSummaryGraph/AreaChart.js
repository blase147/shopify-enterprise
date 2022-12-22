import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);
import "./style.css"

const AreaChart = () => {
    let chartOptions = {
        chart: {
            zoomType: 'yx',
            reflow: true,
            width: 800,
        },
        title: {
            text: ''
        },
        xAxis: [{
            gridLineWidth: 16,
            gridLineColor: '#ffff',
            categories: ['1-01-30', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
            data: [3.1, 13.0, 14.5, 10.8, 5.8, 7.8, 9.5, 9.5, 10.4, 5.2, 3.2, 4.8],
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
            name: 'test',
            type: 'line',
            data: [4, 1.0, 5, 3, 7, 8.0, 5, 8, 2, 4, 3, 7],
            tooltip: {
                valueSuffix: 'k'
            }
        }]
    };

    return (<><HighchartsReact highcharts={Highcharts} options={chartOptions} /></>);
}

export default AreaChart;
