import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardService, RelatorioStatusDto } from '../../../../shared/services/dashboard/dashboard.service';
import { DashboardsComponent } from "../dashboards/dashboards.component";

@Component({
    selector: 'app-home-page',
    standalone: true,
    templateUrl: './home-page.component.html',
    imports: [DashboardsComponent]
})
export class HomePageComponent implements OnInit {

    // SERVICES
    #dashboardService = inject(DashboardService);

    //DTOS
    relatorioStatusDto = signal<RelatorioStatusDto[] | null>(null);
    statusList = [
        { status: 'ABERTO' },
        { status: 'EM_ANDAMENTO' },
        { status: 'RESOLVIDO' },
        { status: 'FECHADO' }
    ];

    ngOnInit(): void {
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
        return this.relatorioStatusDto()!.find(s => s.status === status) ?? null;
    }


    getItem(status: string) {
        return this.relatorioStatusDto()!.find(item => item.status === status) || null;
    }
}
