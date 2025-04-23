import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatMenuModule, MatButtonModule, RouterModule, MatExpansionModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
