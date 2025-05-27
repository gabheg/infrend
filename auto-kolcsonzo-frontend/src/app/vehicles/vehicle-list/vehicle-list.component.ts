import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';
import { FormsModule } from '@angular/forms'; // For ngModel binding in the template

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import FormsModule for ngModel
  templateUrl: './vehicle-list.component.html',
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  searchQuery: string = ''; // Store the search query
  statusFilter: string = ''; // Store the selected status filter (all, free, rented)
  loading = true;

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filteredVehicles = data; // Initially, all vehicles are shown
        this.loading = false;
      },
      error: () => {
        alert('Failed to load vehicles.');
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    // Filter vehicles based on search query and status filter
    this.filteredVehicles = this.vehicles.filter((vehicle) =>
      this.matchSearch(vehicle)
    );
  }

  matchSearch(vehicle: Vehicle): boolean {
    const search = this.searchQuery.toLowerCase();
    const matchesSearch =
      vehicle.licensePlate.toLowerCase().includes(search) ||
      vehicle.type.toLowerCase().includes(search);

    // Ensure both `vehicle.status` and `statusFilter` are treated as strings
    const matchesStatus =
      !this.statusFilter ||
      vehicle.status.toLowerCase() === this.statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }

  // Create vehicle
  goToCreateVehicle(): void {
    this.router.navigate(['/vehicles/create']);
  }

  // Delete vehicle
  deleteVehicle(id?: number): void {
    if (id === undefined) {
      alert('Vehicle ID is undefined!');
      return;
    }
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          alert('Vehicle deleted successfully.');
          this.loadVehicles();
        },
        error: () => {
          alert('Failed to delete vehicle.');
        },
      });
    }
  }

  goToEditVehicle(id?: number): void {
    if (id === undefined) {
      alert('Vehicle ID is undefined!');
      return;
    }
    this.router.navigate(['/vehicles/edit', id]);
  }
}
