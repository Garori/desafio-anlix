import { Component, AfterViewInit } from '@angular/core';
import { IntegrationAPIService } from '../integration-api.service';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private integrationAPIService:IntegrationAPIService ){
    
    this.integrationAPIService.getPacientes().subscribe(res =>
    {
      console.log(res);
    });
    // console.log()
  }
  
}
