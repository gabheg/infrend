import { Routes } from '@angular/router';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ClientCreateComponent } from './clients/client-create/client-create.component';
import { VehicleListComponent } from './vehicles/vehicle-list/vehicle-list.component';
import { VehicleCreateComponent } from './vehicles/vehicle-create/vehicle-create.component';
import { RentalCreateComponent } from './rentals/rental-create/rental-create.component';
import { RentalListComponent } from './rentals/rental-list/rental-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clients', pathMatch: 'full' },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/create', component: ClientCreateComponent },
  { path: 'clients/edit/:id', component: ClientCreateComponent },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicles/create', component: VehicleCreateComponent },
  { path: 'vehicles/edit/:id', component: VehicleCreateComponent },
  { path: 'rentals', component: RentalListComponent },
  { path: 'rentals/create', component: RentalCreateComponent },
  { path: 'rentals/edit/:id', component: RentalCreateComponent },
];
