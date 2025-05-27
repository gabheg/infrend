import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  private apiUrl = 'http://localhost:3000/rentals'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all rentals
  getRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(this.apiUrl);
  }

  // Create new rental
  createRental(rental: Partial<Rental>): Observable<Rental> {
    return this.http.post<Rental>(this.apiUrl, rental);
  }

  // Delete Rental
  deleteRental(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // Close Rental
  closeRental(id: number, closeData: { endDate: string; kilometersDriven: number; damaged: boolean }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/close/${id}`, closeData);
  }

  // Get Closed Rentals by id
  getRentalById(id: number) {
    return this.http.get<Rental>(`${this.apiUrl}/${id}`);
  }
  
 
  
  
}
