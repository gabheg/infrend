import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = 'http://localhost:3000/vehicles';

  constructor(private http: HttpClient) {}

  getVehicles(queryParams?: { type?: string; licensePlate?: string; status?: string }): Observable<Vehicle[]> {
    let params = new HttpParams();
    
    // Add query parameters to the request if provided
    if (queryParams?.type) {
      params = params.set('type', queryParams.type);
    }
    if (queryParams?.licensePlate) {
      params = params.set('licensePlate', queryParams.licensePlate);
    }
    if (queryParams?.status) {
      params = params.set('status', queryParams.status);
    }

    return this.http.get<Vehicle[]>(this.apiUrl, { params });
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.apiUrl}/${id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
