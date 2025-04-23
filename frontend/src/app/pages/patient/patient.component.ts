import { Component } from '@angular/core';
import { IntegrationAPIService } from '../../integration-api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Key } from 'readline';
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
  patientData:{[key:string]:any} = {
    // "altura": "1,96",
    // "bairro": "Pricumã",
    // "celular": "(95) 99359-1588",
    // "cep": "69309-415",
    // "cidade": "Boa Vista",
    // "cor": "laranja",
    // "cpf": "974.642.524-20",
    // "data_nasc": "19/01/1967",
    // "email": "aalexandrecalebcosta@br.loreal.com",
    // "endereco": "Rua das Palmas de Santa Rita",
    // "estado": "RR",
    // "id": 1,
    // "idade": 55,
    // "mae": "Beatriz Alícia",
    // "nome": "Alexandre Caleb Costa",
    // "numero": 765,
    // "pai": "Nelson Heitor Costa",
    // "peso": 63,
    // "rg": "22.107.246-9",
    // "sexo": "Masculino",
    // "signo": "Capricórnio",
    // "telefone_fixo": "(95) 3783-9661",
    // "tipo_sanguineo": "A-"
  }
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
    this.integrationAPIService.getPatientIndicePulmonarLast(this.route.snapshot.paramMap.get("id") ?? "-1").subscribe(res => {
      for (let key in ["indice_cardiaco","indice_pulmonar","datetime_cardiaco","datetime_pulmonar"]){
        try {
          this.data_to_show[key] = res[0][key];
        } catch (error) {
          this.data_to_show[key] = res[1][key];
        }
      }
      console.log(this.data_to_show);
    });
  }

}
