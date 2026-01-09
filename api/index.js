import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import createAuthRoutes from "../backend/routes/auth";
import createJobRoutes from "../backend/routes/jobs";
import { timeStamp } from "console";

const app = express();

app.use(
	cors({
		origin: proccess.env.FRONTEND_URL || "*",
		credentials: true,
	}),
);

app.use(express.json());

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

app.get("/api", (req, res) => {
	res.json({
		message: "Job Tracker API is running!",
		timeStamp: new Date().toISOString(),
	});
});

app.use("/api/auth", createAuthRoutes(supabase));
app.use("/api/jobs", createJobRoutes(supabase));

export default app;
