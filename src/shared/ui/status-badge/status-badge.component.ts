import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StatusEnum } from '../../enums/status-enum';

@Component({
    selector: 'app-status-badge',
    templateUrl: './status-badge.component.html',
    imports: [NgClass],
    styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() status!: keyof typeof StatusEnum;

  get statusLabel(): string {
    return StatusEnum[this.status];
  }

  get colorClass(): string {
    switch (this.status) {
      case 'ABERTO':
        return 'bg-yellow-500 text-black';
      case 'EM_ANDAMENTO':
        return 'bg-blue-500 text-white';
      case 'RESOLVIDO':
        return 'bg-green-500 text-white';
      case 'FECHADO':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-red-500 text-white'; // fallback
    }
  }
}
