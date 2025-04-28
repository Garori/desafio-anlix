import { Component } from '@angular/core';
import { IntegrationAPIService } from '../../integration-api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';




@Component({
  selector: 'app-patient',
  imports: [RouterModule, CommonModule, MatCardModule, MatDivider, MatButtonModule, MatMenuModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss'
})
export class PatientComponent {
  patientData:{[key:string]:any} = {}
  data_to_show:{[key:string]:any} = {
    "indice_cardiaco":"",
    "indice_pulmonar":"",
    "datetime_cardiaco": "",
    "datetime_pulmonar": ""
  }
  general_data= ["nome", "cpf", "rg", "mae", "pai",  "data_nasc"]
  general_data_columns = ["Nome", "CPF", "RG", "Nome da mãe", "Nome do pai", "Data de nascimento"]
  medical_data = [ "idade",  "altura", "peso", "tipo_sanguineo", "sexo"]
  medical_data_columns = ["Idade", "Altura", "Peso", "Tipo sanguíneo", "Sexo"]
  contact_data = ["email", "telefone_fixo", "celular", "cep", "endereco", "numero", "bairro", "cidade", "estado"]
  contact_data_columns = ["E-mail", "Telefone fixo", "Celular", "CEP", "Endereco", "Número", "Bairro", "Cidade", "Estado"]
  other_data = ["cor", "signo"]
  other_data_columns = ["Cor", "Signo"]
  constructor(private integrationAPIService: IntegrationAPIService, private route: ActivatedRoute){
  this.integrationAPIService.getPatientById(this.route.snapshot.paramMap.get("id")??"-1").subscribe(res =>
    {
      this.patientData = res[0]
      console.log(this.patientData)
    });
  }

  getLastIndiceCardiaco(){
    this.integrationAPIService.getPatientIndiceCardiacoLast(this.route.snapshot.paramMap.get("id") ?? "-1").subscribe(res =>
      {
        this.data_to_show = res[0];
        console.log(this.data_to_show);
      });
  }
  getLastIndicePulmonar() {
    this.integrationAPIService.getPatientIndicePulmonarLast(this.route.snapshot.paramMap.get("id") ?? "-1").subscribe(res => {
      this.data_to_show = res[0];
      console.log(this.data_to_show);
    });
  }
  getLastIndicesBoth() {
    this.integrationAPIService.getPatientIndicesBothLast(this.route.snapshot.paramMap.get("id") ?? "-1").subscribe(res => {
      for (let key in ["indice_cardiaco","indice_pulmonar","datetime_cardiaco","datetime_pulmonar"]){
        // try {
        //   this.data_to_show[key] = res[0][key];
        // } catch (error) {
        //   this.data_to_show[key] = res[0][key];
        // }
        this.data_to_show = res[0]
      }
      console.log(res)
      console.log(this.data_to_show);
    });
  }

}
