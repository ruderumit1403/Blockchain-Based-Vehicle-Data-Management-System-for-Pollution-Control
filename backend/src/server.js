import express from "express";
import cors from "cors";
import vehicleRoutes from "./routes/vehicleRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", vehicleRoutes);

app.listen(PORT, () => {
  console.log(`Vehicle ledger backend running on port ${PORT}`);
});

// Made with Bob
