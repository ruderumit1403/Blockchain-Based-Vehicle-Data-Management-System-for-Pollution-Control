// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VehicleCompliance {
    uint256 public constant COMPLIANCE_LIMIT = 80;

    struct Vehicle {
        string vehicleNumber;
        string ownerName;
        uint256 emissionLevel;
        bool complianceStatus;
        string insurancePolicyNumber;
        uint256 updatedAt;
    }

    mapping(string => Vehicle) private vehicles;

    event VehicleRegistered(
        string indexed vehicleNumber,
        string ownerName,
        uint256 emissionLevel,
        bool complianceStatus
    );

    event EmissionUpdated(
        string indexed vehicleNumber,
        uint256 emissionLevel,
        bool complianceStatus
    );

    event InsuranceUpdated(
        string indexed vehicleNumber,
        string insurancePolicyNumber,
        uint256 updatedAt
    );

    function registerVehicle(
        string memory _vehicleNumber,
        string memory _ownerName,
        uint256 _emissionLevel,
        string memory _insurancePolicyNumber
    ) public {
        require(bytes(vehicles[_vehicleNumber].vehicleNumber).length == 0, "Vehicle already exists");

        bool status = _emissionLevel < COMPLIANCE_LIMIT;

        vehicles[_vehicleNumber] = Vehicle({
            vehicleNumber: _vehicleNumber,
            ownerName: _ownerName,
            emissionLevel: _emissionLevel,
            complianceStatus: status,
            insurancePolicyNumber: _insurancePolicyNumber,
            updatedAt: block.timestamp
        });

        emit VehicleRegistered(_vehicleNumber, _ownerName, _emissionLevel, status);
    }

    function updateEmission(
        string memory _vehicleNumber,
        uint256 _emissionLevel
    ) public {
        require(bytes(vehicles[_vehicleNumber].vehicleNumber).length != 0, "Vehicle not found");

        bool status = _emissionLevel < COMPLIANCE_LIMIT;
        vehicles[_vehicleNumber].emissionLevel = _emissionLevel;
        vehicles[_vehicleNumber].complianceStatus = status;
        vehicles[_vehicleNumber].updatedAt = block.timestamp;

        emit EmissionUpdated(_vehicleNumber, _emissionLevel, status);
    }

    function updateInsurance(
        string memory _vehicleNumber,
        string memory _insurancePolicyNumber
    ) public {
        require(bytes(vehicles[_vehicleNumber].vehicleNumber).length != 0, "Vehicle not found");

        vehicles[_vehicleNumber].insurancePolicyNumber = _insurancePolicyNumber;
        vehicles[_vehicleNumber].updatedAt = block.timestamp;

        emit InsuranceUpdated(_vehicleNumber, _insurancePolicyNumber, block.timestamp);
    }

    function getVehicle(
        string memory _vehicleNumber
    ) public view returns (Vehicle memory) {
        require(bytes(vehicles[_vehicleNumber].vehicleNumber).length != 0, "Vehicle not found");
        return vehicles[_vehicleNumber];
    }

    function getVehicleComplianceStatus(
        string memory _vehicleNumber
    ) public view returns (bool) {
        require(bytes(vehicles[_vehicleNumber].vehicleNumber).length != 0, "Vehicle not found");
        return vehicles[_vehicleNumber].complianceStatus;
    }
}