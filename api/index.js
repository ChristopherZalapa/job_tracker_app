import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

// Middleware
app.use(
	cors({
		origin: "*",
		credentials: true,
	}),
);
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

// Import routes inline to avoid path issues
// We'll manually create the routes here for now

// Health check
app.get("/api", (req, res) => {
	res.json({
		message: "Job Tracker API is running!",
		timestamp: new Date().toISOString(),
		env: {
			hasSupabaseUrl: !!process.env.SUPABASE_URL,
			hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
		},
	});
});

// Test route
app.get("/api/test", (req, res) => {
	res.json({ message: "Test endpoint works!" });
});

// Temporary auth routes (we'll add the real ones after testing)
app.post("/api/auth/signup", async (req, res) => {
	try {
		const { email, password } = req.body;

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		res.status(201).json({
			message: "User created successfully",
			user: data.user,
		});
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
});

app.post("/api/auth/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		res.json({
			message: "Login successful",
			token: data.session.access_token,
			user: data.user,
		});
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
});

// Export for Vercel
export default app;
