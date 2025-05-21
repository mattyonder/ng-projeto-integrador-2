import { Component, inject, OnInit, signal } from '@angular/core';
import {
  DashboardService,
  RelatorioStatusDto,
} from '../../../../shared/services/dashboard/dashboard.service';
import { LoginService } from '../../../../shared/services/login/login.service';
import { BaseComponent } from '../../../../shared/utils/base.component';
import { DashboardsComponent } from '../dashboards/dashboards.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  imports: [DashboardsComponent],
})
export class HomePageComponent extends BaseComponent implements OnInit {
  // SERVICES
  private auth = inject(LoginService);

  #dashboardService = inject(DashboardService);

  //DTOS
  relatorioStatusDto = signal<RelatorioStatusDto[] | null>(null);
  statusList = [
    { status: 'ABERTO' },
    { status: 'EM_ANDAMENTO' },
    { status: 'RESOLVIDO' },
    { status: 'FECHADO' },
  ];

  ngOnInit(): void {
    const userRole = this.auth.getUserRole();
    if (userRole?.rolTxDescricao === 'CLIENTE')
      this.router.navigate(['paginas/meus-chamados-cliente']);
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];

    this.getPorStatus(dataFormatada);
  }

  getPorStatus(dataSelecionada?: string) {
    this.#dashboardService.getPorStatus(dataSelecionada).subscribe({
      next: (res) => {
        this.relatorioStatusDto.set(res);
      },
    });
  }

  getStatusData(status: string): RelatorioStatusDto | null {
    return this.relatorioStatusDto()!.find((s) => s.status === status) ?? null;
  }

  getItem(status: string) {
    return (
      this.relatorioStatusDto()!.find((item) => item.status === status) || null
    );
  }
}
