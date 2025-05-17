import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

import {
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptionsLine = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

import {
  ApexPlotOptions,
  ApexYAxis,
  ApexFill
} from "ng-apexcharts";
import { DashboardService, RelatorioChamadosPorCategoriaDto, RelatorioChamadosPorDataDto } from '../../../../shared/core/services/dashboard/dashboard.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [NgApexchartsModule, FontAwesomeModule],
  templateUrl: './dashboards.component.html'
})
export class DashboardsComponent implements OnInit {
  @ViewChild("chart") chartPizza?: ChartComponent;
  public chartOptionsPizza?: Partial<ChartOptions>;

  @ViewChild("chart") chartLine?: ChartComponent;
  public chartOptionsLine?: Partial<ChartOptionsLine>;

  @ViewChild("chart") chartBar?: ChartComponent;
  public chartOptionsBar?: Partial<ChartOptionsBar>;

  // SERVICES
  #dashboardService = inject(DashboardService);

  //DTOS
  relatorioChamadosPorCategoriaDto = signal<RelatorioChamadosPorCategoriaDto[] | null>(null);
  relatorioChamadosPorDataDto = signal<RelatorioChamadosPorDataDto | null>(null)

  ngOnInit(): void {
    this.getChartLine();
    this.getChartBar();
    this.getPorCategoria();
    this.getPorDia();
  }

  getPorDia() {
    this.#dashboardService.getPorDia().subscribe({
      next: (res) => {
        this.relatorioChamadosPorDataDto.set(res);
      }
    })
  }

  getPorCategoria() {
    this.#dashboardService.getPorCategoria().subscribe({
      next: (res) => {
        const series = res.map(item => item.totalChamados);
        const labels = res.map(item => item.categoria);

        this.getChartPizza(series, labels);
      }
    })
  }

  getChartBar() {
    this.chartOptionsBar = {
      series: [
        {
          name: "Inflation",
          data: [230, 310, 400, 1010, 400, 360, 320, 230, 140, 800, 500, 200]
        }
      ],
      chart: {
        type: "bar",
        height: '100%'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        position: "bottom",
        labels: {
          offsetY: -5
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        type: "solid",
        colors: ["#1b8ef2"]
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          
        }
      }
    };
  }

  getChartLine() {
    this.chartOptionsLine = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
  }

  getChartPizza(series: number[], label: string[]) {
    this.chartOptionsPizza = {
      series: series,
      chart: {
        width: 380,
        type: "pie"
      },
      labels: label,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
