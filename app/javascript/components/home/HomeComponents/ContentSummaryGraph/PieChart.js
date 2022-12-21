import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_exporting from "highcharts/modules/exporting";
HC_exporting(Highcharts);

function PieChart(props) {
    let chartOptions = {
        chart: {
            type: 'pie',
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            pie: {
                innerSize: '60%'
            }
        },
        series: [{
            name: 'Medals',
            data: [
                ['Norway', 16],
                ['Germany', 12],
                ['USA', 8],
                ['Sweden', 8],
                ['Netherlands', 8],
                ['ROC', 6],
                ['Austria', 7],
                ['Canada', 4],
                ['Japan', 3]

            ]
        }]
    };
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

export default PieChart;
