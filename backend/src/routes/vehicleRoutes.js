import { Router } from "express";
import { vehicleLedgerService } from "../services/vehicleLedgerService.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "vehicle-ledger-api" });
});

router.get("/dashboard", (_req, res) => {
  res.json(vehicleLedgerService.getDashboardMetrics());
});

router.get("/vehicles", (_req, res) => {
  res.json(vehicleLedgerService.getVehicles());
});

router.get("/vehicles/:vehicleNumber", (req, res) => {
  const vehicle = vehicleLedgerService.getVehicleByNumber(req.params.vehicleNumber);

  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  return res.json(vehicle);
});

router.post("/vehicles", (req, res) => {
  try {
    const vehicle = vehicleLedgerService.registerVehicle(req.body);
    return res.status(201).json(vehicle);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/vehicles/:vehicleNumber/emissions", (req, res) => {
  try {
    const vehicle = vehicleLedgerService.addEmissionRecord(req.params.vehicleNumber, req.body);
    return res.json(vehicle);
  } catch (error) {
    return res.status(error.message === "Vehicle not found" ? 404 : 400).json({ message: error.message });
  }
});

router.post("/vehicles/:vehicleNumber/services", (req, res) => {
  try {
    const vehicle = vehicleLedgerService.addServiceRecord(req.params.vehicleNumber, req.body);
    return res.json(vehicle);
  } catch (error) {
    return res.status(error.message === "Vehicle not found" ? 404 : 400).json({ message: error.message });
  }
});

router.post("/vehicles/:vehicleNumber/ownership", (req, res) => {
  try {
    const vehicle = vehicleLedgerService.transferOwnership(req.params.vehicleNumber, req.body);
    return res.json(vehicle);
  } catch (error) {
    return res.status(error.message === "Vehicle not found" ? 404 : 400).json({ message: error.message });
  }
});

router.post("/vehicles/:vehicleNumber/insurance", (req, res) => {
  try {
    const vehicle = vehicleLedgerService.updateInsurance(req.params.vehicleNumber, req.body);
    return res.json(vehicle);
  } catch (error) {
    return res.status(error.message === "Vehicle not found" ? 404 : 400).json({ message: error.message });
  }
});

export default router;

// Made with Bob
