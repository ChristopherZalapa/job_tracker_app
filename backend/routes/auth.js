import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

export default function createAuthRoutes(supabase) {
	router.post("/signup", (req, res) =>
		authController.signup(req, res, supabase),
	);
	router.post("/login", (req, res) => authController.login(req, res, supabase));
	router.post("/logout", (req, res) =>
		authController.logout(req, res, supabase),
	);

	return router;
}
