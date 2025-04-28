import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IntegrationAPIService } from '../../integration-api.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExportService } from '../../export.service';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-indices-by-value-interval',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatRadioModule, MatTableModule],
  templateUrl: './indices-by-value-interval.component.html',
  styleUrl: './indices-by-value-interval.component.scss'
})
export class IndicesByValueIntervalComponent {

  patient: { [key: string]: any } = {};
  patientData: { [key: string]: any }[] = [];
  id: string = "";
  indice_min_label = "Índice cardíaco mínimo"
  indice_max_label = "Índice cardíaco máximo"
  indice_min_str = ""
  indice_max_str = ""
  indice_type = ""
  indice_historic_last = ""
  columns_to_display: string[] = []


  constructor(private integrationAPIService: IntegrationAPIService, private route: ActivatedRoute, private exportService: ExportService) {
    this.id = this.route.snapshot.paramMap.get("id") ?? "-1"
    this.integrationAPIService.getPatientById(this.id).subscribe(res => {
      this.patient = res[0];
      // console.log(this.patient);
    });
  }

  indicesForm = new FormGroup({
      min_indice: new FormControl("", [Validators.required]),
      max_indice: new FormControl("", [Validators.required]),
      tipo: new FormControl("cardiaco", [Validators.required]),
      historic_last: new FormControl("LIMIT 1", [Validators.required]),
    });

  handleSubmit() {
    // console.log(this.indicesForm.value.data);
    if (this.indicesForm.value.tipo == "cardiaco"){
      this.columns_to_display = ["datetime", "indice_cardiaco"];
    }
    else{
      this.columns_to_display = ["datetime", "indice_pulmonar"]
    }
    this.indice_min_str = this.indicesForm.value.min_indice?.toString()?? ""
    this.indice_max_str = this.indicesForm.value.max_indice?.toString() ?? ""
    this.indice_type =  this.indicesForm.value.tipo == "cardiaco" ? "cardíaco" : "pulmonar" 
    this.indice_historic_last = this.indicesForm.value.historic_last == "LIMIT 1" ? "Último Índice" : "Histórico"
    this.integrationAPIService.getPatientIndicesBetween(this.id, this.indicesForm.value).subscribe(res => {
      this.patientData = res;
    });
  }

  handleChangeMethod() {
    if (this.indicesForm.value.tipo == "cardiaco") {
      this.indice_min_label = "Indice cardíaco mínmo";
      this.indice_max_label = "Indice cardiaco máximo";

    }
    else if (this.indicesForm.value.tipo == "pulmonar") {
      this.indice_min_label = "Indice pulmonar mínmo";
      this.indice_max_label = "Indice pulmonar máximo";
    }
  }

  handleExport() {
    this.exportService.exportToCsv(this.patientData, this.patient["nome"] +" (Índice " +this.indice_type + ") (de " + this.indice_min_str + " até " + this.indice_max_str + ") (" + this.indice_historic_last +")");
  }

}
