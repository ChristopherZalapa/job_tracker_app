import express from "express";
import * as jobController from "../controllers/jobController.js";

const router = express.Router();

export default function createJobRoutes(supabase) {
	router.post("/", (req, res) => jobController.createJob(req, res, supabase));
	router.get("/", (req, res) => jobController.getAllJobs(req, res, supabase));
	router.get("/:id", (req, res) =>
		jobController.getJobById(req, res, supabase),
	);
	router.put("/:id", (req, res) => jobController.updateJob(req, res, supabase));
	router.delete("/:id", (req, res) =>
		jobController.deleteJob(req, res, supabase),
	);

	return router;
}
