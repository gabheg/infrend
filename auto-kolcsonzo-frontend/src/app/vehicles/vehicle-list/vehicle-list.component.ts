import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  searchQuery: string = '';
  statusFilter: string = '';
  loading = true;

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.titleService.setTitle('Vehicles | Car Rental');
  }

  loadVehicles(): void {
    this.loading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filteredVehicles = data;
        this.loading = false;
      },
      error: () => {
        alert('Failed to load vehicles.');
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    this.filteredVehicles = this.vehicles.filter((vehicle) =>
      this.matchSearch(vehicle)
    );
  }

  matchSearch(vehicle: Vehicle): boolean {
    const search = this.searchQuery.toLowerCase();
    const matchesSearch =
      vehicle.licensePlate.toLowerCase().includes(search) ||
      vehicle.type.toLowerCase().includes(search);

    const matchesStatus =
      !this.statusFilter ||
      vehicle.status.toLowerCase() === this.statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }

  goToCreateVehicle(): void {
    this.router.navigate(['/vehicles/create']);
  }

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
