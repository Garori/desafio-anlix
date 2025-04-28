import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { IntegrationAPIService } from '../../integration-api.service';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ExportToCSVComponent } from '../../components/export-to-csv/export-to-csv.component';
import { ExportService } from '../../export.service';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-indices',
  imports: [MatPaginatorModule, ExportToCSVComponent, CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatButtonModule, MatCardModule, RouterModule, MatDividerModule, MatExpansionModule, MatTableModule],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  templateUrl: './indices.component.html',
  styleUrl: './indices.component.scss'
})
export class IndicesComponent {

  constructor(private integrationAPIService: IntegrationAPIService, private exportService: ExportService) {
  }
  datesIndices: any[] = [];
  pageDatesIndices: any[] = [];

  displayedColumnsCardiaco: string[] = ['datetime', 'indice_cardiaco'];
  displayedColumnsPulmonar: string[] = ['datetime', 'indice_pulmonar'];

  data_str = "";
  data_final_str = "";

  got_data= false;

  paginatorLength = 0
  pageEvent: PageEvent = new PageEvent;

  
  indicesForm = new FormGroup({
    data: new FormControl(moment(), [Validators.required]),
    data_final: new FormControl(moment(), [Validators.required] ),
  });

  handleExport(){
    let to_export:object[] = [];
    this.datesIndices.forEach(element => {
      // let aux:{[key:string]:any} = {}
      element["data"]["cardiaco"].forEach((element2: { [x: string]: any; }) => {
        element2["nome"] = element["data"]["nome"];
        element2["cpf"] = element["data"]["cpf"];
        element2["indice_pulmonar"] = "-";
        to_export.push(element2);
      });

      element["data"]["pulmonar"].forEach((element2: { [x: string]: any; }) => {
        element2["nome"] = element["data"]["nome"];
        element2["cpf"] = element["data"]["cpf"];
        element2["indice_cardiaco"] = "-";
        to_export.push(element2);
      }
    );
      // to_export.push({element["data"]:})
    });
    console.log(to_export)
    this.exportService.exportToCsv(to_export, this.data_str+" to "+this.data_final_str);
  }

  handleSubmit(){
    // console.log(this.indicesForm.value.data);
    this.data_str = this.indicesForm.value.data?.format("YYYY-MM-DD") as string;
    this.data_final_str = this.indicesForm.value.data_final?.format("YYYY-MM-DD") as string;
    let body = { "date": this.data_str, "final_date": this.data_final_str }
    this.integrationAPIService.getDatesIndices(body).subscribe(res => {
      this.datesIndices = res;
      this.got_data = true;
      this.pageDatesIndices = this.datesIndices.slice(0,10)
      this.paginatorLength = res.length
      // console.log(res)
    });
  }
  
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    console.log(e.pageIndex)

    try {
      this.pageDatesIndices = this.datesIndices.slice(e.pageSize * e.pageIndex, (e.pageSize * (e.pageIndex+1)))    
    } catch (error) {
      this.pageDatesIndices = this.datesIndices.slice(e.pageSize * e.pageIndex) 
    }
    // this.paginatorLength = e.length;
    // this.pageSize = e.pageSize;
    // this.pageIndex = e.pageIndex;
  }
}
