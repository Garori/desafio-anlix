import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() { }

  exportToCsv(data: any[], filename: string): void {
    const csvData = this.convertToCsv(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}.csv`);
  }

  private convertToCsv(data: any[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        return value === null || value === undefined ? '' : `"${value}"`;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  }
}