import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IntegrationAPIService } from '../../integration-api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search',
  imports: [RouterModule, CommonModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCardModule, MatDividerModule, MatButtonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
  
})
export class SearchComponent {
  constructor(private integrationAPIService: IntegrationAPIService){}

  placeholderForInput = "Nome"
  patientsFromSearchResults = [
    // {
    //   "nome": "Cabriel Gonde",
    //   "cpf": "[Redacted]",
    //   "id":1,
    //   "mae": "donamae",
    //   "pai": "seu pai",
    //   "email": "lindtonio@gmail.com"
    // },
    // {
    //   "nome":"Canilo Dolares",
    //   "cpf":"seila",
    //   "id":2,
    //   "mae": "donamae",
    //   "pai": "seu pai",
    //   "email": "lindinhaflorzinha123456deoliveiradocinhoeseuutonio@gmail.com"
    // },
    // {
    //   "nome": "Cabriel Gonde",
    //   "cpf": "[Redacted]",
    //   "id": 1,
    //   "mae": "donamae",
    //   "pai": "seu pai",
    //   "email": "lindinhaflorzinha123456deoliveiradocinhoeseuutonio@gmail.com"
    // },
    // {
    //   "nome": "Canilo Dolares",
    //   "cpf": "seila",
    //   "id": 2,
    //   "mae": "donamae",
    //   "pai": "seu pai",
    //   "email": "lindinhaflorzinha123456deoliveiradocinhoeseuutonio@gmail.com"
    // },
    // {
    //   "nome": "Cabriel Gonde",
    //   "cpf": "[Redacted]",
    //   "id": 1,
    //   "mae": "donamae",
    //   "pai": "seu pai",
    //   "email": "lindinhaflorzinha123ssssss456deoliveiradocinhoeseuutonio@gmail.com"
    // },
    // {
    //   "nome": "Canilo Dolssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssares",
    //   "cpf": "seila",
    //   "id": 2,
    //   "mae": "donamae",
    //   "pai": "seu pai",
    //   "email": "lindinhaflorzinha123456deolissssssssssveiradocinhoeseuutonio@gmail.com"
    // }
  ]

  searchForm = new FormGroup({
    search: new FormControl('', [Validators.required, Validators.minLength(5)]),
    method: new FormControl('nome', [Validators.required]),
  });

  handleChangeMethod(){
    if (this.searchForm.value.method == "nome"){
      this.placeholderForInput = "Nome"
    }
    else if (this.searchForm.value.method == "email"){
      this.placeholderForInput = "E-mail"
    }
    else if (this.searchForm.value.method == "cpf") {
      this.placeholderForInput = "CPF"
    }
  }

  handleSubmit() {
    if ((this.searchForm.value.search?.length ?? 0) >= 3)
    {
          
      this.integrationAPIService.getPatients(this.searchForm.value.search??"","nome").subscribe(res =>
          {
            this.patientsFromSearchResults = res;
          });
          // console.log()
      
    }
    else {
      this.patientsFromSearchResults = []
    }
    
  }
}


