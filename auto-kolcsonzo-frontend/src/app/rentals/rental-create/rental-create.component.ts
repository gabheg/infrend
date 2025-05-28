import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { VehicleService } from '../../services/vehicle.service';
import { RentalService } from '../../services/rental.service';
import { Client } from '../../models/client';
import { Vehicle } from '../../models/vehicle';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rental-create',
  templateUrl: './rental-create.component.html',
  styleUrls: ['./rental-create.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class RentalCreateComponent implements OnInit {
  rentalForm: FormGroup;
  clients: Client[] = [];
  vehicles: Vehicle[] = [];
  error: string = '';
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private rentalService: RentalService,
    private router: Router
  ) {
    this.rentalForm = this.fb.group({
      client: ['', Validators.required],
      vehicle: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadVehicles();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        this.clients = data;
      },
      (error) => {
        this.error = 'Error loading clients';
      }
    );
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe(
      (data) => {
        this.vehicles = data;
      },
      (error) => {
        this.error = 'Error loading vehicles';
      }
    );
  }

  onSubmit(): void {
    if (this.rentalForm.invalid) {
      return;
    }
  
    this.submitting = true;
  
    const formValue = this.rentalForm.value;
  
    const rentalData = {
      clientId: Number(formValue.client),
      vehicleId: Number(formValue.vehicle),
      startDate: formValue.startDate,
      endDate: formValue.endDate || null,
    };
  
    this.rentalService.createRental(rentalData).subscribe(
      () => {
        this.submitting = false;
        this.router.navigate(['/rentals']);
      },
      (error) => {
        this.error = 'Error creating rental. ' + (error.error?.error || error.message);
        this.submitting = false;
        console.error('Rental creation error:', error);
      }
    );
  }
  
}
