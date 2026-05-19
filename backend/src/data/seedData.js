export const seedVehicles = [
  {
    id: "VH-001",
    vehicleNumber: "GJ01AB1234",
    ownerName: "Aarav Patel",
    ownerWallet: "0x91A3cB1D8eF1261A87b2E5A2B45F9d1C2E3F1001",
    vehicleType: "Car",
    fuelType: "Petrol",
    manufacturer: "Tata",
    model: "Nexon",
    registrationDate: "2025-01-10",
    insuranceProvider: "SecureDrive Insurance",
    insurancePolicyNumber: "SDI-2025-001",
    insuranceValidTill: "2027-01-09",
    lastServiceDate: "2026-03-18",
    emissionLevel: 62,
    complianceStatus: true,
    ownershipVerified: true,
    serviceHistory: [
      {
        serviceId: "SRV-1001",
        centerName: "Green Wheels Service Center",
        date: "2026-03-18",
        details: "Engine tuning, oil replacement, filter cleaning"
      }
    ],
    emissionHistory: [
      {
        testId: "EM-9001",
        authority: "Ahmedabad Pollution Board",
        level: 62,
        testedAt: "2026-03-20",
        certificateHash: "QmEmissionHash9001"
      }
    ],
    blockchainLog: []
  },
  {
    id: "VH-002",
    vehicleNumber: "MH12XY9087",
    ownerName: "Diya Sharma",
    ownerWallet: "0xB2D4eF9a0C713dF17A5e6B21C93F0A6B11C22002",
    vehicleType: "Bike",
    fuelType: "Diesel",
    manufacturer: "Bajaj",
    model: "Pulsar",
    registrationDate: "2024-08-11",
    insuranceProvider: "National Auto Cover",
    insurancePolicyNumber: "NAC-2024-889",
    insuranceValidTill: "2026-08-10",
    lastServiceDate: "2026-02-14",
    emissionLevel: 91,
    complianceStatus: false,
    ownershipVerified: true,
    serviceHistory: [
      {
        serviceId: "SRV-1002",
        centerName: "Urban Moto Care",
        date: "2026-02-14",
        details: "Brake servicing and emission chamber cleaning"
      }
    ],
    emissionHistory: [
      {
        testId: "EM-9002",
        authority: "Pune Pollution Authority",
        level: 91,
        testedAt: "2026-03-02",
        certificateHash: "QmEmissionHash9002"
      }
    ],
    blockchainLog: []
  }
];

// Made with Bob
