import express from "express";
import cors from "cors";

const PORT = 8000;

const app = express();

app.use(cors());

app.get("/test", (req, res) => {
	res.json({ message: "This is a test" });
});

app.listen(PORT, () => {
	console.log(`Now listening on ${PORT}`);
});
