import { ChamadoSemanal, RelatorioChamadosPorTecnicoDto, StatusChamado } from './../../../../shared/core/services/dashboard/dashboard.service';
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
import { DashboardService, RelatorioChamadosPorCategoriaDto, RelatorioChamadosPorDataDto, RelatorioStatusDto } from '../../../../shared/core/services/dashboard/dashboard.service';
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
  relatorioStatusDto = signal<RelatorioStatusDto[] | null>(null)
  relatorioChamadosPorTecnicoDto = signal<RelatorioChamadosPorTecnicoDto[] | null>(null)
  relatorioChamadoSemanal = signal<ChamadoSemanal[] | null>(null);

  //ENUMS
  statusChamado = StatusChamado

  ngOnInit(): void {

    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];

    // this.getChartLine();
    this.getPorCategoria(dataFormatada);
    this.getPorDia(dataFormatada);
    this.getPorStatus(dataFormatada);
    this.getPorTecnico(dataFormatada);
    this.getChamadosSemanal();
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const dataSelecionada = input.value; // formato: 'YYYY-MM-DD'

    console.log(dataSelecionada);

    if (dataSelecionada) {
      this.getPorTecnico(dataSelecionada);
      this.getPorStatus(dataSelecionada);
      this.getPorDia(dataSelecionada);
      this.getPorCategoria(dataSelecionada);
    }
  }

  getChamadosSemanal() {
    this.#dashboardService.getChamadosSemanais().subscribe({
      next: (dados) => {
        const ordenado = dados.sort((a, b) => a.diaSemanaNumero - b.diaSemanaNumero);

        // Extrai os nomes dos dias e as quantidades
        const categories = ordenado.map(item => item.diaSemanaNome);
        const seriesData = ordenado.map(item => item.total);

        this.getChartBar(seriesData, categories);
      },
      error: (erro) => console.error('Erro ao buscar chamados semanais', erro)
    });
  }

  getPorTecnico(dataSelecionada?: string) {
    this.#dashboardService.getPorTecnico(dataSelecionada).subscribe({
      next: (res) => {
        this.relatorioChamadosPorTecnicoDto.set(res);
      }
    })
  }

  getPorStatus(dataSelecionada?: string) {
    this.#dashboardService.getPorStatus(dataSelecionada).subscribe({
      next: (res) => {
        this.relatorioStatusDto.set(res);
      }
    })
  }

  getPorDia(dataSelecionada?: string) {
    this.#dashboardService.getPorDia(dataSelecionada).subscribe({
      next: (res) => {
        this.relatorioChamadosPorDataDto.set(res);
      }
    })
  }

  getPorCategoria(dataSelecionada?: string) {
    this.#dashboardService.getPorCategoria(dataSelecionada).subscribe({
      next: (res) => {
        const series = res.map(item => item.totalChamados);
        const labels = res.map(item => item.categoria);

        this.getChartPizza(series, labels);
      }
    })
  }

  getChartBar(series: number[], label: string[]) {
    this.chartOptionsBar = {
      series: [
        {
          name: "Inflation",
          data: series
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
        categories: label,
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
