import { Line } from "react-chartjs-2";
import React, { Component } from 'react';
import moment from "moment";

class AreaChart extends Component {

    showTimeLabel = () => {
        if (this.props.hashrate.times.length > 0) {
            return {
                displayFormats: {
                    second: 'MMM D HH:MM',
                    minute: 'MMM D HH:MM',
                    hour: 'MMM D HH:MM',
                    day: 'MMM D HH:MM'
                }
            }
        } else {
            return {
                displayFormats: {
                    second: null,
                }
            }
        }
    }

    render() {
        let hashrate = this.props.hashrate;
        const data = {
            labels: this.props.hashrate.times,
            datasets: [
                {
                    label: "Hashrate History (24 hrs)",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.props.hashrate.hashrates
                }
            ]
        };

        return (
            <Line
                ref="chart"
                data={data}
                width={300}
                height={260}
                options={{
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    display: true,
                                    maxTicksLimit: 7,
                                    callback: function (value) {
                                        return (
                                            value + " " + hashrate.hashrate_units + "H/s"
                                        );
                                    }
                                }
                            }
                        ],
                        xAxes: [
                            {
                                type: 'time',
                                time: this.showTimeLabel(),
                                distribution: 'linear',
                                ticks: {
                                    display: true,
                                    maxTicksLimit: 7
                                }
                            }
                        ]
                    },

                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                var dataset =
                                    data.datasets[tooltipItem.datasetIndex];
                                var currentValue = dataset.data[tooltipItem.index];
                                return (
                                    currentValue +
                                    " " +
                                    hashrate.hashrate_units +
                                    "H/s"
                                );
                            },
                            title: function (tooltipItem, data) {
                                return moment(
                                    data.labels[tooltipItem[0].index]
                                ).format("MMM DD HH:mm");
                            }
                        }
                    }
                }}
            />
        )
    }
}

export default AreaChart;