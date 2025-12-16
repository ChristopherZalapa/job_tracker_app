import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

import createAuthRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

const authRoutes = createAuthRoutes(supabase);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`Now listening on ${PORT}`);
	console.log(`Signup: POST http://localhost:${PORT}/auth/signup`);
	console.log(`Login: POST http://localhost:${PORT}/auth/login`);
});
