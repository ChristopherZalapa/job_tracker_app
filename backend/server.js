import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

import createAuthRoutes from "./routes/auth.js";
import createJobRoutes from "./routes/jobs.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

app.get("/", (req, res) => {
	res.json({
		message: "Job Tracker API Is Running!",
		timestamp: new Date().toISOString(),
	});
});

const authRoutes = createAuthRoutes(supabase);
app.use("/auth", authRoutes);

const jobRoutes = createJobRoutes(supabase);
app.use("/jobs", jobRoutes);

app.listen(PORT, () => {
	console.log(`Now listening on ${PORT}`);
});
