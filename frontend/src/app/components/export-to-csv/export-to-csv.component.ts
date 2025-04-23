import { Component, Input } from '@angular/core';
import { ExportService } from '../../export.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-export-to-csv',
  imports: [MatButtonModule],
  template: `
    <button mat-raised-button (click)="exportData()">Exportar</button>
  `,
  styleUrl: './export-to-csv.component.scss'
})
export class ExportToCSVComponent {

  // jsonData:object = {}
  @Input({ required: true}) jsonData:any[] = [];
  @Input({ required: true }) name: string = "";
  // jsonData = [
  //   { name: 'John Doe', age: 30, city: 'New York' },
  //   { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  // ];

  constructor(private exportService: ExportService) { }

  exportData(): void {
    this.exportService.exportToCsv(this.jsonData, this.name);
  }
}