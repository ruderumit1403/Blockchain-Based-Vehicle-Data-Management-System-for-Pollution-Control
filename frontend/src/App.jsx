import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:4000/api";

const emptyVehicleForm = {
  vehicleNumber: "",
  ownerName: "",
  ownerWallet: "",
  vehicleType: "Car",
  fuelType: "Petrol",
  manufacturer: "",
  model: "",
  registrationDate: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  insuranceValidTill: "",
  emissionLevel: 0
};

const emptyEmissionForm = {
  vehicleNumber: "",
  authority: "",
  level: 0,
  testedAt: "",
  certificateHash: ""
};

function StatCard({ label, value, accent }) {
  return (
    <div className="card stat-card">
      <span className="stat-label">{label}</span>
      <strong className={`stat-value ${accent || ""}`}>{value}</strong>
    </div>
  );
}

function VehicleCard({ vehicle, onSelect, selected }) {
  return (
    <button className={`card vehicle-card ${selected ? "selected" : ""}`} onClick={() => onSelect(vehicle)}>
      <div className="vehicle-card__header">
        <h3>{vehicle.vehicleNumber}</h3>
        <span className={vehicle.complianceStatus ? "badge success" : "badge danger"}>
          {vehicle.complianceStatus ? "Compliant" : "Non-Compliant"}
        </span>
      </div>
      <p>{vehicle.ownerName}</p>
      <p>
        {vehicle.manufacturer} {vehicle.model} • {vehicle.vehicleType}
      </p>
      <small>Emission Level: {vehicle.emissionLevel}</small>
    </button>
  );
}

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);
  const [emissionForm, setEmissionForm] = useState(emptyEmissionForm);
  const [message, setMessage] = useState("");

  const nonCompliantVehicles = useMemo(
    () => vehicles.filter((vehicle) => !vehicle.complianceStatus),
    [vehicles]
  );

  const loadData = async () => {
    const [vehicleResponse, dashboardResponse] = await Promise.all([
      fetch(`${API_BASE}/vehicles`),
      fetch(`${API_BASE}/dashboard`)
    ]);

    const vehicleData = await vehicleResponse.json();
    const dashboardData = await dashboardResponse.json();

    setVehicles(vehicleData);
    setDashboard(dashboardData);
    if (vehicleData.length > 0) {
      setSelectedVehicle((current) => {
        if (!current) return vehicleData[0];
        return vehicleData.find((vehicle) => vehicle.vehicleNumber === current.vehicleNumber) || vehicleData[0];
      });
    }
  };

  useEffect(() => {
    loadData().catch(() => setMessage("Backend not reachable. Start backend on port 4000."));
  }, []);

  const handleVehicleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_BASE}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(vehicleForm)
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Failed to register vehicle");
      return;
    }

    setMessage(`Vehicle ${data.vehicleNumber} registered successfully`);
    setVehicleForm(emptyVehicleForm);
    await loadData();
    setSelectedVehicle(data);
  };

  const handleEmissionSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${API_BASE}/vehicles/${emissionForm.vehicleNumber}/emissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        authority: emissionForm.authority,
        level: Number(emissionForm.level),
        testedAt: emissionForm.testedAt,
        certificateHash: emissionForm.certificateHash
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Failed to update emission");
      return;
    }

    setMessage(`Emission updated for ${data.vehicleNumber}`);
    setEmissionForm(emptyEmissionForm);
    await loadData();
    setSelectedVehicle(data);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Decentralized Compliance Platform</p>
          <h1>Blockchain-Based Vehicle Data Management System</h1>
          <p className="hero-copy">
            Track emissions, ownership, insurance, and service history using immutable ledger-inspired event
            chaining and smart contract architecture.
          </p>
        </div>
      </header>

      {message ? <div className="notice">{message}</div> : null}

      <section className="stats-grid">
        <StatCard label="Total Vehicles" value={dashboard?.totalVehicles ?? 0} />
        <StatCard label="Compliant Vehicles" value={dashboard?.compliantVehicles ?? 0} accent="success-text" />
        <StatCard label="Non-Compliant Vehicles" value={dashboard?.nonCompliantVehicles ?? 0} accent="danger-text" />
        <StatCard label="Compliance Rate" value={`${dashboard?.complianceRate ?? 0}%`} />
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Vehicle Ledger</h2>
            <span>{vehicles.length} records</span>
          </div>
          <div className="vehicle-list">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.vehicleNumber}
                vehicle={vehicle}
                selected={selectedVehicle?.vehicleNumber === vehicle.vehicleNumber}
                onSelect={setSelectedVehicle}
              />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Selected Vehicle</h2>
            <span>{selectedVehicle?.vehicleNumber || "No vehicle selected"}</span>
          </div>

          {selectedVehicle ? (
            <div className="details-grid">
              <div className="card">
                <h3>Identity & Compliance</h3>
                <ul className="detail-list">
                  <li><strong>Owner:</strong> {selectedVehicle.ownerName}</li>
                  <li><strong>Wallet:</strong> {selectedVehicle.ownerWallet}</li>
                  <li><strong>Type:</strong> {selectedVehicle.vehicleType}</li>
                  <li><strong>Fuel:</strong> {selectedVehicle.fuelType}</li>
                  <li><strong>Emission:</strong> {selectedVehicle.emissionLevel}</li>
                  <li><strong>Status:</strong> {selectedVehicle.complianceStatus ? "Compliant" : "Non-Compliant"}</li>
                </ul>
              </div>

              <div className="card">
                <h3>Insurance & Service</h3>
                <ul className="detail-list">
                  <li><strong>Insurer:</strong> {selectedVehicle.insuranceProvider}</li>
                  <li><strong>Policy:</strong> {selectedVehicle.insurancePolicyNumber}</li>
                  <li><strong>Valid Till:</strong> {selectedVehicle.insuranceValidTill}</li>
                  <li><strong>Last Service:</strong> {selectedVehicle.lastServiceDate || "N/A"}</li>
                </ul>
              </div>

              <div className="card ledger-card">
                <h3>Blockchain Event Log</h3>
                <div className="ledger-list">
                  {selectedVehicle.blockchainLog.map((block) => (
                    <div key={block.blockId || block.hash} className="ledger-item">
                      <strong>{block.eventType}</strong>
                      <span>{block.timestamp}</span>
                      <small>Hash: {block.hash.slice(0, 22)}...</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>No vehicle selected.</p>
          )}
        </div>
      </section>

      <section className="forms-grid">
        <form className="panel form-panel" onSubmit={handleVehicleSubmit}>
          <div className="panel-header">
            <h2>Register Vehicle</h2>
            <span>Authority / Service Center</span>
          </div>

          <div className="form-grid">
            <input placeholder="Vehicle Number" value={vehicleForm.vehicleNumber} onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNumber: e.target.value })} required />
            <input placeholder="Owner Name" value={vehicleForm.ownerName} onChange={(e) => setVehicleForm({ ...vehicleForm, ownerName: e.target.value })} required />
            <input placeholder="Owner Wallet Address" value={vehicleForm.ownerWallet} onChange={(e) => setVehicleForm({ ...vehicleForm, ownerWallet: e.target.value })} required />
            <input placeholder="Manufacturer" value={vehicleForm.manufacturer} onChange={(e) => setVehicleForm({ ...vehicleForm, manufacturer: e.target.value })} required />
            <input placeholder="Model" value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} required />
            <input type="date" value={vehicleForm.registrationDate} onChange={(e) => setVehicleForm({ ...vehicleForm, registrationDate: e.target.value })} required />
            <input placeholder="Insurance Provider" value={vehicleForm.insuranceProvider} onChange={(e) => setVehicleForm({ ...vehicleForm, insuranceProvider: e.target.value })} required />
            <input placeholder="Policy Number" value={vehicleForm.insurancePolicyNumber} onChange={(e) => setVehicleForm({ ...vehicleForm, insurancePolicyNumber: e.target.value })} required />
            <input type="date" value={vehicleForm.insuranceValidTill} onChange={(e) => setVehicleForm({ ...vehicleForm, insuranceValidTill: e.target.value })} required />
            <input type="number" placeholder="Emission Level" value={vehicleForm.emissionLevel} onChange={(e) => setVehicleForm({ ...vehicleForm, emissionLevel: Number(e.target.value) })} required />
            <select value={vehicleForm.vehicleType} onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}>
              <option>Car</option>
              <option>Bike</option>
              <option>Truck</option>
              <option>Bus</option>
            </select>
            <select value={vehicleForm.fuelType} onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>CNG</option>
              <option>Electric</option>
            </select>
          </div>

          <button type="submit" className="primary-button">Register Vehicle</button>
        </form>

        <form className="panel form-panel" onSubmit={handleEmissionSubmit}>
          <div className="panel-header">
            <h2>Update Emission Test</h2>
            <span>Pollution Control Authority</span>
          </div>

          <div className="form-grid">
            <input placeholder="Vehicle Number" value={emissionForm.vehicleNumber} onChange={(e) => setEmissionForm({ ...emissionForm, vehicleNumber: e.target.value })} required />
            <input placeholder="Authority Name" value={emissionForm.authority} onChange={(e) => setEmissionForm({ ...emissionForm, authority: e.target.value })} required />
            <input type="number" placeholder="Emission Level" value={emissionForm.level} onChange={(e) => setEmissionForm({ ...emissionForm, level: Number(e.target.value) })} required />
            <input type="date" value={emissionForm.testedAt} onChange={(e) => setEmissionForm({ ...emissionForm, testedAt: e.target.value })} />
            <input placeholder="Certificate Hash / IPFS CID" value={emissionForm.certificateHash} onChange={(e) => setEmissionForm({ ...emissionForm, certificateHash: e.target.value })} required />
          </div>

          <button type="submit" className="primary-button">Submit Emission Update</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Risk & Monitoring</h2>
          <span>Authorities can prioritize non-compliant vehicles</span>
        </div>

        <div className="alert-list">
          {nonCompliantVehicles.length === 0 ? (
            <div className="card">No active compliance risks detected.</div>
          ) : (
            nonCompliantVehicles.map((vehicle) => (
              <div key={vehicle.vehicleNumber} className="card alert-card">
                <strong>{vehicle.vehicleNumber}</strong>
                <span>{vehicle.ownerName}</span>
                <small>Emission level {vehicle.emissionLevel} exceeds the compliance threshold of 80.</small>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;

// Made with Bob
