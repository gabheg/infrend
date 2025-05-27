import express from "express";
import { getRepository } from "typeorm";

import { Rental, RentalStatus } from "../entity/Rentals";
import { Vehicle, VehicleStatus } from "../entity/Vehicles";
import { Client } from "../entity/Clients";

const router = express.Router();

// Fixed pricing constants (in HUF)
const DAILY_RATE = 10000;      // 10,000 Ft per day
const KM_RATE = 20;            // 20 Ft per kilometer
const DEFAULT_DAMAGE_FEE = 50000;  // default if no damage fee provided

// Create new rental (same as before)
router.post("/", async (req: Request, res: Response) => {
  try {
    const rentalRepo = getRepository(Rental);
    const vehicleRepo = getRepository(Vehicle);

    const { client, vehicle: vehicleId, startDate, damaged, damageFee } = req.body;

    const vehicle = await vehicleRepo.findOneBy({ id: vehicleId });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    if (vehicle.status === "rented") {
      return res.status(400).json({ error: "Vehicle is already rented" });
    }

    const rental = rentalRepo.create({
      client,
      vehicle,
      startDate: new Date(startDate),
      damaged: damaged ?? false,
      damageFee: damageFee ?? DEFAULT_DAMAGE_FEE,
      status: RentalStatus.ONGOING,
    });

    await rentalRepo.save(rental);

    // Mark vehicle as rented
    vehicle.status = "rented";
    await vehicleRepo.save(vehicle);

    res.status(201).json(rental);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create rental" });
  }
});

// Close rental and calculate price with fixed prices
router.put("/close/:id", async (req: Request, res: Response) => {
  try {
    const rentalRepo = getRepository(Rental);
    const vehicleRepo = getRepository(Vehicle);

    const rentalId = parseInt(req.params.id);
    const { kilometersDriven, damaged, damageFee } = req.body;

    const rental = await rentalRepo.findOne({
      where: { id: rentalId },
      relations: ["vehicle"],
    });

    if (!rental) return res.status(404).json({ error: "Rental not found" });
    if (rental.status === RentalStatus.CLOSED) return res.status(400).json({ error: "Rental already closed" });

    rental.endDate = new Date();
    rental.kilometersDriven = kilometersDriven ?? rental.kilometersDriven ?? 0;
    rental.damaged = damaged ?? rental.damaged;
    rental.damageFee = damageFee ?? rental.damageFee ?? DEFAULT_DAMAGE_FEE;

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffTime = rental.endDate.getTime() - rental.startDate.getTime();
    const days = Math.ceil(diffTime / msPerDay) || 1;

    // Price calculation using fixed rates
    let price = days * DAILY_RATE;
    price += rental.kilometersDriven * KM_RATE;

    if (rental.damaged) {
      price += rental.damageFee;
    }

    rental.totalPrice = price;
    rental.status = RentalStatus.CLOSED;

    // Update vehicle status
    const vehicle = rental.vehicle;
    vehicle.status = "available";

    await rentalRepo.save(rental);
    await vehicleRepo.save(vehicle);

    res.json(rental);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to close rental" });
  }
});

// Get rentals (same as before)
router.get("/", async (req: Request, res: Response) => {
  try {
    const rentalRepo = getRepository(Rental);
    const { status } = req.query;

    let rentals;
    if (status && (status === RentalStatus.CLOSED || status === RentalStatus.ONGOING)) {
      rentals = await rentalRepo.find({ where: { status } });
    } else {
      rentals = await rentalRepo.find();
    }

    res.json(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rentals" });
  }
});

export default router;
