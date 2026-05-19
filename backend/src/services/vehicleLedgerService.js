import crypto from "crypto";
import { seedVehicles } from "../data/seedData.js";

const COMPLIANCE_LIMIT = 80;

class VehicleLedgerService {
  constructor() {
    this.vehicles = seedVehicles.map((vehicle) => ({
      ...vehicle,
      blockchainLog: this.buildInitialLog(vehicle)
    }));
  }

  buildInitialLog(vehicle) {
    const payload = {
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.ownerName,
      emissionLevel: vehicle.emissionLevel,
      complianceStatus: vehicle.complianceStatus
    };

    return [
      this.createBlock({
        vehicleNumber: vehicle.vehicleNumber,
        eventType: "GENESIS_RECORD",
        payload,
        previousHash: "0"
      })
    ];
  }

  createBlock({ vehicleNumber, eventType, payload, previousHash }) {
    const timestamp = new Date().toISOString();
    const rawBlock = `${vehicleNumber}|${eventType}|${timestamp}|${JSON.stringify(payload)}|${previousHash}`;
    const hash = crypto.createHash("sha256").update(rawBlock).digest("hex");

    return {
      blockId: crypto.randomUUID(),
      timestamp,
      eventType,
      previousHash,
      hash,
      payload
    };
  }

  appendBlock(vehicle, eventType, payload) {
    const previousHash = vehicle.blockchainLog[vehicle.blockchainLog.length - 1]?.hash || "0";
    const block = this.createBlock({
      vehicleNumber: vehicle.vehicleNumber,
      eventType,
      payload,
      previousHash
    });

    vehicle.blockchainLog.push(block);
    return block;
  }

  getVehicles() {
    return this.vehicles;
  }

  getVehicleByNumber(vehicleNumber) {
    return this.vehicles.find(
      (vehicle) => vehicle.vehicleNumber.toUpperCase() === vehicleNumber.toUpperCase()
    );
  }

  registerVehicle(data) {
    if (this.getVehicleByNumber(data.vehicleNumber)) {
      throw new Error("Vehicle already registered");
    }

    const emissionLevel = Number(data.emissionLevel);
    const vehicle = {
      id: `VH-${String(this.vehicles.length + 1).padStart(3, "0")}`,
      vehicleNumber: data.vehicleNumber,
      ownerName: data.ownerName,
      ownerWallet: data.ownerWallet,
      vehicleType: data.vehicleType,
      fuelType: data.fuelType,
      manufacturer: data.manufacturer,
      model: data.model,
      registrationDate: data.registrationDate,
      insuranceProvider: data.insuranceProvider,
      insurancePolicyNumber: data.insurancePolicyNumber,
      insuranceValidTill: data.insuranceValidTill,
      lastServiceDate: data.lastServiceDate || null,
      emissionLevel,
      complianceStatus: emissionLevel < COMPLIANCE_LIMIT,
      ownershipVerified: Boolean(data.ownershipVerified ?? true),
      serviceHistory: [],
      emissionHistory: [],
      blockchainLog: []
    };

    vehicle.blockchainLog = this.buildInitialLog(vehicle);
    this.appendBlock(vehicle, "VEHICLE_REGISTERED", {
      ownerName: vehicle.ownerName,
      vehicleType: vehicle.vehicleType,
      insurancePolicyNumber: vehicle.insurancePolicyNumber
    });

    this.vehicles.push(vehicle);
    return vehicle;
  }

  addEmissionRecord(vehicleNumber, data) {
    const vehicle = this.getVehicleByNumber(vehicleNumber);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    const emissionRecord = {
      testId: `EM-${Date.now()}`,
      authority: data.authority,
      level: Number(data.level),
      testedAt: data.testedAt || new Date().toISOString().split("T")[0],
      certificateHash: data.certificateHash
    };

    vehicle.emissionHistory.unshift(emissionRecord);
    vehicle.emissionLevel = emissionRecord.level;
    vehicle.complianceStatus = emissionRecord.level < COMPLIANCE_LIMIT;

    this.appendBlock(vehicle, "EMISSION_UPDATED", emissionRecord);

    return vehicle;
  }

  addServiceRecord(vehicleNumber, data) {
    const vehicle = this.getVehicleByNumber(vehicleNumber);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    const serviceRecord = {
      serviceId: `SRV-${Date.now()}`,
      centerName: data.centerName,
      date: data.date || new Date().toISOString().split("T")[0],
      details: data.details
    };

    vehicle.serviceHistory.unshift(serviceRecord);
    vehicle.lastServiceDate = serviceRecord.date;

    this.appendBlock(vehicle, "SERVICE_UPDATED", serviceRecord);

    return vehicle;
  }

  transferOwnership(vehicleNumber, data) {
    const vehicle = this.getVehicleByNumber(vehicleNumber);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    vehicle.ownerName = data.newOwnerName;
    vehicle.ownerWallet = data.newOwnerWallet;
    vehicle.ownershipVerified = true;

    this.appendBlock(vehicle, "OWNERSHIP_TRANSFERRED", {
      newOwnerName: data.newOwnerName,
      newOwnerWallet: data.newOwnerWallet
    });

    return vehicle;
  }

  updateInsurance(vehicleNumber, data) {
    const vehicle = this.getVehicleByNumber(vehicleNumber);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    vehicle.insuranceProvider = data.insuranceProvider;
    vehicle.insurancePolicyNumber = data.insurancePolicyNumber;
    vehicle.insuranceValidTill = data.insuranceValidTill;

    this.appendBlock(vehicle, "INSURANCE_UPDATED", {
      insuranceProvider: data.insuranceProvider,
      insurancePolicyNumber: data.insurancePolicyNumber,
      insuranceValidTill: data.insuranceValidTill
    });

    return vehicle;
  }

  getDashboardMetrics() {
    const totalVehicles = this.vehicles.length;
    const compliantVehicles = this.vehicles.filter((vehicle) => vehicle.complianceStatus).length;
    const nonCompliantVehicles = totalVehicles - compliantVehicles;
    const averageEmission =
      totalVehicles === 0
        ? 0
        : Math.round(
            this.vehicles.reduce((sum, vehicle) => sum + Number(vehicle.emissionLevel || 0), 0) /
              totalVehicles
          );

    return {
      totalVehicles,
      compliantVehicles,
      nonCompliantVehicles,
      averageEmission,
      complianceRate: totalVehicles === 0 ? 0 : Math.round((compliantVehicles / totalVehicles) * 100)
    };
  }
}

export const vehicleLedgerService = new VehicleLedgerService();

// Made with Bob
