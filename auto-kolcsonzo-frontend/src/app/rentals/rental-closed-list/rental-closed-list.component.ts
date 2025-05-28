import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalService } from '../../services/rental.service';
import { Rental } from '../../models/rental';

@Component({
  selector: 'app-rental-closed-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rental-closed-list.component.html',
  styleUrls: ['./rental-closed-list.component.css']
})
export class RentalClosedListComponent implements OnInit, OnChanges {
  @Input() rentalId!: number;
  rental?: Rental;
  loading = false;
  error?: string;

  constructor(private rentalService: RentalService) {}

  ngOnInit(): void {
    this.loadRental();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rentalId'] && !changes['rentalId'].firstChange) {
      this.loadRental();
    }
  }

  loadRental(): void {
    if (!this.rentalId) {
      this.error = 'No rental ID provided.';
      return;
    }
    this.loading = true;
    this.error = undefined;
    this.rentalService.getRentalById(this.rentalId).subscribe(
      (rental: Rental) => {
        this.rental = rental;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching rental by ID', error);
        this.error = 'Rental not found or error occurred.';
        this.rental = undefined;
        this.loading = false;
      }
    );
  }
}
