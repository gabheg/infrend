import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Rental, RentalStatus } from "../entity/Rentals";
import { Client } from "../entity/Clients";
import { Vehicle, VehicleStatus } from "../entity/Vehicles";

const router = Router();

const rentalRepo = AppDataSource.getRepository(Rental);
const clientRepo = AppDataSource.getRepository(Client);
const vehicleRepo = AppDataSource.getRepository(Vehicle);

function parseDate(dateStr: any): Date | null {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// Create a new rental
router.post("/", async (req: Request, res: Response) => {
  try {
    const { clientId, vehicleId, startDate } = req.body;

    const client = await clientRepo.findOneBy({ id: clientId });
    const vehicle = await vehicleRepo.findOneBy({ id: vehicleId });

    if (!client || !vehicle) {
      return res.status(400).json({ error: "Invalid client or vehicle ID" });
    }

    if (vehicle.status !== VehicleStatus.FREE) {
      return res.status(400).json({ error: "Vehicle is not available for rent" });
    }

    const parsedStartDate = parseDate(startDate);
    if (!parsedStartDate) {
      return res.status(400).json({ error: "Invalid or missing startDate" });
    }

    // Create rental
    const rental = rentalRepo.create({
      client,
      vehicle,
      startDate: parsedStartDate,
      status: RentalStatus.ONGOING,
      damaged: false,
    });

    await rentalRepo.save(rental);

    // Update vehicle status to RENTED
    vehicle.status = VehicleStatus.RENTED;
    await vehicleRepo.save(vehicle);

    // Return saved rental with relations
    const savedRental = await rentalRepo.findOne({
      where: { id: rental.id },
      relations: ["client", "vehicle"],
    });

    res.status(201).json(savedRental);
  } catch (error: any) {
    console.error("Error creating rental:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all rentals with client and vehicle
router.get("/", async (req: Request, res: Response) => {
  try {
    const rentals = await rentalRepo.find({ relations: ["client", "vehicle"] });
    res.json(rentals);
  } catch (error: any) {
    console.error("Error fetching rentals:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get rental by ID with client and vehicle
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rental = await rentalRepo.findOne({
      where: { id: Number(req.params.id) },
      relations: ["client", "vehicle"],
    });
    if (!rental) return res.status(404).json({ error: "Rental not found" });
    res.json(rental);
  } catch (error: any) {
    console.error("Error fetching rental:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Close rental: set endDate, kilometersDriven, damaged, calculate totalPrice, update status and vehicle status
router.put("/close/:id", async (req: Request, res: Response) => {
  try {
    const rental = await rentalRepo.findOne({
      where: { id: Number(req.params.id) },
      relations: ["vehicle", "client"],
    });
    if (!rental) return res.status(404).json({ error: "Rental not found" });

    // FIX: Convert startDate to Date if needed
    if (!(rental.startDate instanceof Date)) {
      rental.startDate = new Date(rental.startDate);
    }

    const { endDate, kilometersDriven, damaged } = req.body;

    const parsedEndDate = parseDate(endDate);
    if (!parsedEndDate || kilometersDriven === undefined) {
      return res.status(400).json({ error: "endDate and kilometersDriven are required and must be valid" });
    }

    // Update rental fields
    rental.endDate = parsedEndDate;
    rental.kilometersDriven = Number(kilometersDriven);
    rental.damaged = Boolean(damaged);

    // Calculate rental days (at least 1 day)
    const diffTime = rental.endDate.getTime() - rental.startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const rentalDays = diffDays > 0 ? diffDays : 1;

    // Calculate totalPrice: dailyPrice * days + kmPrice * kilometers + damageFee if damaged
    const dailyPrice = rental.vehicle.rentalPrice;
    const kmPrice = rental.vehicle.kmPrice;

    let damageFee = 0;
    if (rental.damaged) {
      damageFee = 100; // flat damage fee (can be adjusted)
    }

    rental.damageFee = damageFee;  // <-- assign damageFee here

    rental.totalPrice = Number((dailyPrice * rentalDays + kmPrice * rental.kilometersDriven + damageFee).toFixed(2));
    rental.status = RentalStatus.CLOSED;

    await rentalRepo.save(rental);

    // Update vehicle status to FREE when rental is closed
    const vehicle = rental.vehicle;
    vehicle.status = VehicleStatus.FREE;
    await vehicleRepo.save(vehicle);

    // Return updated rental with relations
    const updatedRental = await rentalRepo.findOne({
      where: { id: rental.id },
      relations: ["client", "vehicle"],
    });

    res.json(updatedRental);
  } catch (error: any) {
    console.error("Error closing rental:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete rental route
router.delete("/:id", async (req: Request, res: Response) => {
  const rentalId = req.params.id;

  try {
    // Ensure rentalId is treated as a number
    const rental = await rentalRepo.findOne({
      where: { id: Number(rentalId) },
    });

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    // Delete rental
    await rentalRepo.remove(rental);

    // Update vehicle status back to FREE if rental exists
    const vehicle = rental.vehicle;
    vehicle.status = VehicleStatus.FREE;
    await vehicleRepo.save(vehicle);

    res.status(200).json({ message: "Rental deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting rental:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
