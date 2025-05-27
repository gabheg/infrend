import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Client } from "../entity/Clients";
import { validate } from "class-validator";

const router = Router();
const clientRepo = AppDataSource.getRepository(Client);

router.post("/", async (req, res) => {
  try {
    const client = clientRepo.create(req.body);

    const errors = await validate(client);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const result = await clientRepo.save(client);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const clients = await clientRepo.find();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const client = await clientRepo.findOneBy({ id: Number(req.params.id) });
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const client = await clientRepo.findOneBy({ id: Number(req.params.id) });
    if (!client) return res.status(404).json({ error: "Client not found" });

    clientRepo.merge(client, req.body);

    const errors = await validate(client);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const result = await clientRepo.save(client);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE route to delete a client by id
router.delete("/:id", async (req, res) => {
  try {
    const client = await clientRepo.findOneBy({ id: Number(req.params.id) });
    if (!client) return res.status(404).json({ error: "Client not found" });

    await clientRepo.remove(client);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
