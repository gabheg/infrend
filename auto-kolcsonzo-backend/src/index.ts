import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import clientRouter from "./routes/client";
import vehicleRouter from "./routes/vehicle";
import rentalRouter from "./routes/rental";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the client routes at /clients
app.use("/clients", clientRouter);
// Use the vehicles routes at /vehicles
app.use("/vehicles", vehicleRouter);
// Use the rental routes at /rentals
app.use("/rentals", rentalRouter);

// Root route for quick check
app.get("/", (req, res) => {
  res.send("Hello, your server and DB are ready!");
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
