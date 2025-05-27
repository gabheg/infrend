export type VehicleStatus = 'free' | 'rented' | 'scrapped';
export type VehicleType = 'car' | 'boat';

export interface Vehicle {
  id?: number;
  type: VehicleType;
  manufacturer: string;
  licensePlate: string;
  chassisNumber: string;
  purchaseDate: string; // ISO date string format (e.g., '2023-01-15')
  serialNumber: string;
  rentalPrice: number;
  kmPrice: number;
  status: VehicleStatus;
}
