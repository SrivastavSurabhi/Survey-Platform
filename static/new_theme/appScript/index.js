

$(document).ready(function(){
    addActiveRoute(routesUniqueClass.dashboardRoute)
    individualChartChange();
    EnterpriseChartChange();
});
    // first chart
    var options = {
    chart: {
        height: 260,
        type: "radialBar"
    },
    series: [completed_survey],
    plotOptions: {
        radialBar: {
        hollow: {
            margin: 15,
            size: "70%"
        },
        
        dataLabels: {
            showOn: "always",
            name: {
                offsetY: -10,
                show: true,
                color: "#888",
                fontSize: "13px"
            },
            value: {
                offsetY: -5,
                color: "#111",
                fontSize: "24px",
                show: true
            }
        }
        }
    },
    fill: {
        colors: ['#5FC1B8'],
    },
    stroke: {
        lineCap: "round",
    },
    labels: [""]
    };
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    // second chart
    var options = {
    chart: {
        height: 260,
        type: "radialBar"
    },
    series: [pending_per],
    plotOptions: {
        radialBar: {
        hollow: {
            margin: 15,
            size: "70%"
        },
        
        dataLabels: {
            showOn: "always",
            name: {
                offsetY: -10,
                show: true,
                color: "#888",
                fontSize: "13px"
            },
            value: {
                offsetY: -5,
                color: "#111",
                fontSize: "24px",
                show: true
            }
        }
        }
    },
    fill: {
        colors: ['#E13B3B'],
    },
    stroke: {
        lineCap: "round",
    },
    labels: [""]
    };
    var chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();
  
    // Revenu chart
    var options = {
          series: [{
          data: [{
              x: new Date(1538778600000),
              y: [225, 656, 987, 561]
            },
            {
              x: new Date(1538780400000),
              y: [658, 321, 658, 145]
            },
            {
              x: new Date(1538782200000),
              y: [978, 654, 879, 615]
            },
            {
              x: new Date(1538784000000),
              y: [165, 435, 985, 235]
            },
            {
              x: new Date(1538785800000),
              y: [651, 985, 321, 055]
            },
            {
              x: new Date(1538787600000),
              y: [545, 321, 355, 445]
            },
            {
              x: new Date(1538789400000),
              y: [985, 156, 358, 555]
            },
            {
              x: new Date(1538791200000),
              y: [465, 357, 414, 441]
            },
          ]
        }],
          chart: {
          type: 'candlestick',
          height: 400
        },
        title: {
          text: 'Total Revenue',
          align: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
    };
    var chart = new ApexCharts(document.querySelector("#revenueChart"), options);
    chart.render();