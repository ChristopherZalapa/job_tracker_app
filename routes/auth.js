import express from "express";

const router = express.Router();

export default function createAuthRoutes(supabase) {
	// Signup - Create a new user
	router.post("/signup", async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				error: "Email and Password are required",
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				error: "Password must be at least 6 characters long",
			});
		}

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
			});
			if (error) {
				console.log("Supabase signup error", error);
				console.log("Error code:", error.code);
				console.log("Error status:", error.status);
				console.log("Error message:", error.message);

				return res.status(400).json({ error: error.message });
			}

			console.log("Signup successful!");
			console.log("User ID:", data.user?.id);
			console.log("User email:", data.user?.email);

			res.status(201).json({
				message: "User created successfully!",
				user: data.user,
			});
		} catch (error) {
			console.error("Signup error:", error);
			res.status(500).json({
				error: "Server error occurred",
			});
		}
	});

	// Login - Sign in existing user
	router.post("/login", async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				error: "Email and password are required",
			});
		}

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				console.log("Supabase login error", error);
				console.log("Error code:", error.code);
				console.log("Error status:", error.status);
				console.log("Error message:", error.message);
				console.log("Supabase error:", error);

				return res.status(401).json({
					error: "Invalid email or password",
					details: error.message,
				});
			}

			console.log("Login successful!");
			console.log("User ID:", data.user?.id);
			console.log("User email:", data.user?.email);

			res.status(200).json({
				message: "Login successful!",
				user: data.user,
				session: data.session,
			});
		} catch (error) {
			console.error("Unexpected error login:", error);
			res.status(500).json({
				error: "Server error occurred",
			});
		}
	});

	// Logout - Sign out user
	router.post("/logout", async (req, res) => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.log("Supabase logout error", error);
				console.log("Error code:", error.code);
				console.log("Error status:", error.status);
				console.log("Error message:", error.message);

				return res.status(400).json({
					error: error.message,
					details: error.code,
				});
			}

			console.log("Logged out successfully");
			res.status(200).json({
				message: "Logged out successfully",
			});
		} catch (error) {
			console.error("Logout error:", error);
			res.status(500).json({
				error: "Sever error occurred",
			});
		}
	});

	return router;
}
