import express from "express";
const router = express.Router();

export default function createJobRoutes(supabase) {
	router.get("/test", (req, res) => {
		res.json({ message: "Jobs routes are working" });
	});

	return router;
}
