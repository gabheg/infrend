export interface Rental {
  id: number;
  client: {
    id: number;
    name: string;
    email: string;
  };
  vehicle: {
    id: number;
    manufacturer: string;
    licensePlate: string;
  };
  startDate: string;
  endDate?: string;
  totalPrice?: number;
  kilometersDriven?: number;
  damaged: boolean;
  damageFee?: number;
  status: string;
}
