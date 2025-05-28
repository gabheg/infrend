import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RentalService } from '../../services/rental.service';
import { Rental } from '../../models/rental';
import { RentalClosedListComponent } from '../rental-closed-list/rental-closed-list.component'; 
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-rental-list',
  standalone: true,
  imports: [CommonModule, RentalClosedListComponent, FormsModule],
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css']
})
export class RentalListComponent implements OnInit {
  rentals: Rental[] = [];
  loading = false;
  selectedRentalId: number | null = null;

  constructor(
    private rentalService: RentalService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.loadRentals();
    this.titleService.setTitle('Rentals | Car Rental');
  }

  loadRentals(): void {
    this.loading = true;
    this.rentalService.getRentals().subscribe(
      (data: Rental[]) => {
        this.rentals = data;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching rentals', error);
        this.loading = false;
      }
    );
  }

  addRental(): void {
    this.router.navigate(['/rentals/create']);
  }

  editRental(id: number): void {
    console.log('Edit rental with id:', id);
    this.router.navigate([`/rentals/edit/${id}`]);
  }

  deleteRental(id: number): void {
    if (confirm('Are you sure you want to delete this rental?')) {
      this.rentalService.deleteRental(id).subscribe(() => {
        this.loadRentals();
      }, error => {
        console.error('Error deleting rental', error);
      });
    }
  }

  closeRental(rental: any): void {
    if (!confirm('Are you sure you want to close this rental?')) {
      return;
    }
  
    const endDate = new Date().toISOString();
  
    this.rentalService.closeRental(rental.id, {
      endDate,
      kilometersDriven: rental.kilometersDriven,
      damaged: rental.damaged ?? false
    }).subscribe({
      next: () => this.loadRentals(),
      error: (err) => console.error('Error closing rental', err),
    });
  }

  viewDetails(rentalId: number): void {
    this.selectedRentalId = rentalId;
  }
}
