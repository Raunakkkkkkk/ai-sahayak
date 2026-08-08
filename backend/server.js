import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./routes/profile.js";
import visibilityRoutes from "./routes/visibility.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/profile", profileRoutes);
app.use("/api/visibility", visibilityRoutes);

app.get("/", (req, res) => res.send("AI Sahayak backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));