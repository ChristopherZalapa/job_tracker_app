import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
);

app.get("/test", (req, res) => {
	res.json({ message: "This is a test" });
});

app.listen(PORT, () => {
	console.log(`Now listening on ${PORT}`);
});
