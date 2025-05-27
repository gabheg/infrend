import { Component, OnInit } from '@angular/core'; // <-- add OnInit here
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { Router, ActivatedRoute } from '@angular/router'; // <-- add ActivatedRoute
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-create.component.html',
})
export class VehicleCreateComponent implements OnInit {  // <-- add implements OnInit
  vehicleForm: FormGroup;
  submitting = false;
  error = '';
  vehicleId?: number; // store the id if editing

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute  // <-- inject ActivatedRoute
  ) {
    this.vehicleForm = this.fb.group({
      type: ['car', Validators.required],
      manufacturer: ['', Validators.required],
      licensePlate: ['', Validators.required],
      chassisNumber: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      serialNumber: ['', Validators.required],
      rentalPrice: [0, [Validators.required, Validators.min(0)]],
      kmPrice: [0, [Validators.required, Validators.min(0)]],
      status: ['free', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.vehicleId = +id;
        this.loadVehicle(this.vehicleId);
      }
    });
  }

  loadVehicle(id: number): void {
    this.vehicleService.getVehicle(id).subscribe({
      next: (vehicle: Vehicle) => {
        // Format purchaseDate to 'YYYY-MM-DD' if needed
        const formattedPurchaseDate = vehicle.purchaseDate
          ? vehicle.purchaseDate.split('T')[0]  // Ensures YYYY-MM-DD format
          : '';
  
        this.vehicleForm.patchValue({
          type: vehicle.type,
          manufacturer: vehicle.manufacturer,
          licensePlate: vehicle.licensePlate,
          chassisNumber: vehicle.chassisNumber,
          purchaseDate: formattedPurchaseDate,  // Ensure correct format here
          serialNumber: vehicle.serialNumber,
          rentalPrice: vehicle.rentalPrice,
          kmPrice: vehicle.kmPrice,
          status: vehicle.status,
        });
      },
      error: (err) => {
        this.error = 'Failed to load vehicle data.';
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      return;
    }
  
    // Ensure rentalPrice is a number
    const rentalPrice = parseFloat(this.vehicleForm.value.rentalPrice);
  
    // Ensure kmPrice is a number
    const kmPrice = parseFloat(this.vehicleForm.value.kmPrice);
  
    // Ensure purchaseDate is in the correct format (YYYY-MM-DD)
    const purchaseDate = new Date(this.vehicleForm.value.purchaseDate);
    const formattedDate = purchaseDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
  
    // Update the form value with the correctly formatted date and numeric fields
    this.vehicleForm.patchValue({
      purchaseDate: formattedDate,
      rentalPrice: rentalPrice,  // Ensure rentalPrice is sent as a number
      kmPrice: kmPrice,          // Ensure kmPrice is sent as a number
    });
  
    // Log the form data to see the actual data being sent
    console.log('Form Data:', this.vehicleForm.value);
  
    this.submitting = true;
    this.error = '';
  
    if (this.vehicleId) {
      // Update existing vehicle
      this.vehicleService.updateVehicle(this.vehicleId, this.vehicleForm.value).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/vehicles']);
        },
        error: (err) => {
          this.submitting = false;
          this.error = 'Failed to update vehicle.';
          console.error(err);
        },
      });
    } else {
      // Create new vehicle
      this.vehicleService.createVehicle(this.vehicleForm.value).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/vehicles']);
        },
        error: (err) => {
          this.submitting = false;
          this.error = 'Failed to create vehicle.';
          console.error(err);
        },
      });
    }
  }
  
  
  
  
  
}
