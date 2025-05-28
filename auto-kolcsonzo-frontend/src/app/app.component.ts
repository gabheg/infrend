import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ClientCreateComponent } from './clients/client-create/client-create.component';
import { Title } from '@angular/platform-browser';

export const routes: Routes = [
  { path: '', redirectTo: 'clients', pathMatch: 'full' },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/create', component: ClientCreateComponent },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
})

export class AppComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Car Rental');
}
}