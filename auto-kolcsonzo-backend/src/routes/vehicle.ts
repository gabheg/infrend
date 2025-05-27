import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Vehicle, VehicleStatus } from "../entity/Vehicles";
import { validate } from "class-validator";

const router = Router();
const vehicleRepo = AppDataSource.getRepository(Vehicle);

router.post("/", async (req, res) => {
  try {
    const vehicleData = req.body;

    if (vehicleData.purchaseDate) {
      vehicleData.purchaseDate = new Date(vehicleData.purchaseDate);
    }

    // Set default status before creation
    if (!vehicleData.status) {
      vehicleData.status = VehicleStatus.FREE;
    }

    const vehicle = vehicleRepo.create(vehicleData);

    const errors = await validate(vehicle);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const result = await vehicleRepo.save(vehicle);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { type, licensePlate, status } = req.query;

    // Build dynamic where clause object
    const where: any = {};

    // Check if 'status' is a string before calling toUpperCase
    if (status && typeof status === 'string') {
      where.status = VehicleStatus[status.toUpperCase() as keyof typeof VehicleStatus]; // Ensure the status matches the enum
    }

    if (type) where.type = type;
    if (licensePlate) where.licensePlate = licensePlate;

    const vehicles = await vehicleRepo.find({ where });
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const vehicle = await vehicleRepo.findOneBy({ id: Number(req.params.id) });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const vehicle = await vehicleRepo.findOneBy({ id: Number(req.params.id) });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    // If status missing in update body, set default here
    if (!req.body.status) {
      req.body.status = VehicleStatus.FREE;
    }

    vehicleRepo.merge(vehicle, req.body);

    if (req.body.purchaseDate) {
      vehicle.purchaseDate = new Date(req.body.purchaseDate);
    }

    const errors = await validate(vehicle);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const result = await vehicleRepo.save(vehicle);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await vehicleRepo.delete({ id: Number(req.params.id) });
    if (result.affected === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
