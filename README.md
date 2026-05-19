# Blockchain-Based Vehicle Data Management System

A full-stack project inspired by the provided PDF specification for pollution control and vehicle compliance management.


## Project Structure

- `backend/` - Node.js + Express API
- `frontend/` - React + Vite dashboard
- `contracts/` - Solidity smart contract source

## Features Implemented

### Backend
- Vehicle registration
- Emission test updates
- Service history support
- Ownership transfer support
- Insurance update support
- Compliance dashboard metrics
- SHA-256 chained event log to simulate immutable blockchain-style records

### Frontend
- Dashboard overview
- Vehicle ledger list
- Detailed selected vehicle view
- Vehicle registration form
- Emission update form
- Non-compliance monitoring panel

### Smart Contract
- Vehicle registration
- Emission update
- Insurance update
- Compliance status retrieval

## Run Backend

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:4000`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/vehicles`
- `GET /api/vehicles/:vehicleNumber`
- `POST /api/vehicles`
- `POST /api/vehicles/:vehicleNumber/emissions`
- `POST /api/vehicles/:vehicleNumber/services`
- `POST /api/vehicles/:vehicleNumber/ownership`
- `POST /api/vehicles/:vehicleNumber/insurance`

## Notes

- The backend currently uses in-memory seeded data for demonstration.
- The Solidity contract is included as a deployable smart contract source, but the backend is not yet wired to a live Ethereum node.
- IPFS is represented through stored certificate hash fields in emission records.

## Suggested Next Enhancements

- Integrate MongoDB or PostgreSQL persistence
- Connect backend with ethers.js and deployed smart contract
- Add wallet-based authentication
- Store document proofs on IPFS
- Add role-based login for authority, service center, insurer, and owner