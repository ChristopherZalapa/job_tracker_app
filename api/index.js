import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

// Helper function to authenticate
async function authenticateUser(req) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return { error: "No authorization token provided", status: 401 };
	}

	const token = authHeader.replace("Bearer ", "");
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser(token);

	if (error || !user) {
		return { error: "Invalid or expired token", status: 401 };
	}

	return { user };
}

// Health check
app.get("/api", (req, res) => {
	res.json({
		message: "Job Tracker API is running!",
		timestamp: new Date().toISOString(),
	});
});

// Test endpoint
app.get("/api/test", (req, res) => {
	res.json({ message: "Test endpoint works!" });
});

// ==================== AUTH ROUTES ====================

// Signup
app.post("/api/auth/signup", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		const { data, error } = await supabase.auth.signUp({ email, password });

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		res.status(201).json({
			message: "User created successfully. Please check your email to verify.",
			user: data.user,
		});
	} catch (err) {
		console.error("Signup error:", err);
		res.status(500).json({ error: "Server error during signup" });
	}
});

// Login
app.post("/api/auth/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

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
		console.error("Login error:", err);
		res.status(500).json({ error: "Server error during login" });
	}
});

// ==================== JOB ROUTES ====================

// Get All Jobs
app.get("/api/jobs", async (req, res) => {
	try {
		const authResult = await authenticateUser(req);
		if (authResult.error) {
			return res.status(authResult.status).json({ error: authResult.error });
		}

		const { data, error } = await supabase
			.from("jobs")
			.select("*")
			.eq("user_id", authResult.user.id)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Database error:", error);
			throw error;
		}

		res.json({ message: "Jobs retrieved successfully", jobs: data || [] });
	} catch (err) {
		console.error("Get jobs error:", err);
		res.status(500).json({ error: "Failed to fetch jobs" });
	}
});

// Get Single Job
app.get("/api/jobs/:id", async (req, res) => {
	try {
		const authResult = await authenticateUser(req);
		if (authResult.error) {
			return res.status(authResult.status).json({ error: authResult.error });
		}

		const { data, error } = await supabase
			.from("jobs")
			.select("*")
			.eq("id", req.params.id)
			.eq("user_id", authResult.user.id)
			.single();

		if (error) {
			console.error("Database error:", error);
			throw error;
		}

		if (!data) {
			return res.status(404).json({ error: "Job not found" });
		}

		res.json({ job: data });
	} catch (err) {
		console.error("Get job error:", err);
		res.status(500).json({ error: "Failed to fetch job" });
	}
});

// Create Job
app.post("/api/jobs", async (req, res) => {
	try {
		const authResult = await authenticateUser(req);
		if (authResult.error) {
			return res.status(authResult.status).json({ error: authResult.error });
		}

		const { company_name, job_title, status, application_date, notes } =
			req.body;

		if (!company_name || !job_title || !status) {
			return res.status(400).json({
				error: "company_name, job_title, and status are required",
			});
		}

		const { data, error } = await supabase
			.from("jobs")
			.insert({
				user_id: authResult.user.id,
				company_name,
				job_title,
				status,
				application_date: application_date || null,
				notes: notes || null,
			})
			.select()
			.single();

		if (error) {
			console.error("Database error:", error);
			throw error;
		}

		res.status(201).json({ message: "Job created successfully", job: data });
	} catch (err) {
		console.error("Create job error:", err);
		res.status(500).json({ error: "Failed to create job" });
	}
});

// Update Job
app.put("/api/jobs/:id", async (req, res) => {
	try {
		const authResult = await authenticateUser(req);
		if (authResult.error) {
			return res.status(authResult.status).json({ error: authResult.error });
		}

		const { company_name, job_title, status, application_date, notes } =
			req.body;

		const { data, error } = await supabase
			.from("jobs")
			.update({
				company_name,
				job_title,
				status,
				application_date: application_date || null,
				notes: notes || null,
			})
			.eq("id", req.params.id)
			.eq("user_id", authResult.user.id)
			.select()
			.single();

		if (error) {
			console.error("Database error:", error);
			throw error;
		}

		if (!data) {
			return res.status(404).json({
				error: "Job not found or you do not have permission to update it",
			});
		}

		res.json({ message: "Job updated successfully", job: data });
	} catch (err) {
		console.error("Update job error:", err);
		res.status(500).json({ error: "Failed to update job" });
	}
});

// Delete Job
app.delete("/api/jobs/:id", async (req, res) => {
	try {
		const authResult = await authenticateUser(req);
		if (authResult.error) {
			return res.status(authResult.status).json({ error: authResult.error });
		}

		const { error } = await supabase
			.from("jobs")
			.delete()
			.eq("id", req.params.id)
			.eq("user_id", authResult.user.id);

		if (error) {
			console.error("Database error:", error);
			throw error;
		}

		res.json({ message: "Job deleted successfully" });
	} catch (err) {
		console.error("Delete job error:", err);
		res.status(500).json({ error: "Failed to delete job" });
	}
});

export default app;
