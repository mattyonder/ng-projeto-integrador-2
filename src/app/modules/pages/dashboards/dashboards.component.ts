import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import {
  ChamadoSemanal,
  RelatorioChamadosPorTecnicoDto,
  StatusChamado,
} from '../../../../shared/services/dashboard/dashboard.service';

import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

import {
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
} from 'ng-apexcharts';

export type ChartOptionsLine = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApexFill, ApexPlotOptions, ApexYAxis } from 'ng-apexcharts';
import {
  DashboardService,
  RelatorioChamadosPorCategoriaDto,
  RelatorioChamadosPorDataDto,
  RelatorioStatusDto,
} from '../../../../shared/services/dashboard/dashboard.service';

export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [NgApexchartsModule, FontAwesomeModule],
  templateUrl: './dashboards.component.html',
})
export class DashboardsComponent implements OnInit {
  @ViewChild('chart') chartPizza?: ChartComponent;
  public chartOptionsPizza?: Partial<ChartOptions>;

  @ViewChild('chart') chartLine?: ChartComponent;
  public chartOptionsLine?: Partial<ChartOptionsLine>;

  @ViewChild('chart') chartBar?: ChartComponent;
  public chartOptionsBar?: Partial<ChartOptionsBar>;

  // SERVICES
  #dashboardService = inject(DashboardService);

  //DTOS
  relatorioChamadosPorCategoriaDto = signal<
    RelatorioChamadosPorCategoriaDto[] | null
  >(null);
  relatorioChamadosPorDataDto = signal<RelatorioChamadosPorDataDto | null>(
    null
  );
  relatorioStatusDto = signal<RelatorioStatusDto[] | null>(null);
  relatorioChamadosPorTecnicoDto = signal<
    RelatorioChamadosPorTecnicoDto[] | null
  >(null);
  relatorioChamadoSemanal = signal<ChamadoSemanal[] | null>(null);

  //ENUMS
  statusChamado = StatusChamado;

  statusList = [
    { status: 'ABERTO' },
    { status: 'EM_ANDAMENTO' },
    { status: 'RESOLVIDO' },
    { status: 'FECHADO' }
  ];

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


  getStatusData(status: string): RelatorioStatusDto | null {
    return this.relatorioStatusDto()!.find(s => s.status === status) ?? null;
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const dataSelecionada = input.value; // formato: 'YYYY-MM-DD'

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
        const ordenado = dados.sort(
          (a, b) => a.diaSemanaNumero - b.diaSemanaNumero
        );

        // Extrai os nomes dos dias e as quantidades
        const categories = ordenado.map((item) => item.diaSemanaNome);
        const seriesData = ordenado.map((item) => item.total);

        this.getChartBar(seriesData, categories);
        // this.getChartLine(seriesData, categories);
      },
      error: (erro) => console.error('Erro ao buscar chamados semanais', erro),
    });
  }

  getPorTecnico(dataSelecionada?: string) {
    this.#dashboardService.getPorTecnico(dataSelecionada).subscribe({
      next: (res) => {
        this.relatorioChamadosPorTecnicoDto.set(res);
      },
    });
  }

  getPorStatus(dataSelecionada?: string) {
    this.#dashboardService.getPorStatus(dataSelecionada).subscribe({
      next: (res) => {
        this.relatorioStatusDto.set(res);
      },
    });
  }

  getPorDia(dataSelecionada?: string) {
    this.#dashboardService.getPorDia(dataSelecionada).subscribe({
      next: (res) => {
        this.relatorioChamadosPorDataDto.set(res);
      },
    });
  }

  getPorCategoria(dataSelecionada?: string) {
    this.#dashboardService.getPorCategoria(dataSelecionada).subscribe({
      next: (res) => {
        const series = res.map((item) => item.totalChamados);
        const labels = res.map((item) => item.categoria);

        this.getChartPizza(series, labels);
      },
    });
  }

  getChartBar(series: number[], label: string[]) {
    this.chartOptionsBar = {
      series: [
        {
          name: 'Inflation',
          data: series,
        },
      ],
      chart: {
        type: 'line',
        height: '100%',
        zoom: {
          enabled: false
        }
      },
      stroke: {
        curve: 'straight',
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: label,
        position: 'bottom',
        labels: {
          offsetY: -5,
        }
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
    };
  }

  getChartLine(series: number[], label: string[]) {
    this.chartOptionsLine = {
      series: [
        {
          name: 'Desktops',
          data: series,
        },
      ],
      chart: {
        height: '100%',
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: label
      },
    };
  }

  getChartPizza(series: number[], label: string[]) {
    this.chartOptionsPizza = {
      series: series,
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: label,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
}
