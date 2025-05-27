import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ClientCreateComponent } from './clients/client-create/client-create.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clients', pathMatch: 'full' },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/create', component: ClientCreateComponent },
  // add more routes here when needed
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',  // <-- use this instead of `template`
})
export class AppComponent {}