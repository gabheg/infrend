import "reflect-metadata";
import { DataSource } from "typeorm";
import { Client } from "./entity/Clients";
import { Vehicle } from "./entity/Vehicles";
import { Rental } from "./entity/Rentals";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",          // Your MySQL username
  password: "",              // Your MySQL password (usually empty by default on WAMP)
  database: "rentacar",  // Your database name (create this in MySQL beforehand)
  synchronize: true,         // Only for development: auto create tables
  logging: false,
  entities: [Client, Vehicle, Rental],        // Entities you create later
  migrations: [],
  subscribers: [],
});
