async function authenticateUser(req, supabase) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return { error: "No authorization token provided", status: 401 };
	}

	const token = authHeader.replace("Bearer ", "");

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser(token);

	if (authError || !user) {
		return { error: "invalid or expired token", status: 401 };
	}

	return { user };
}

export async function createJob(req, res, supabase) {
	const authResult = await authenticateUser(req, supabase);

	if (authResult.error) {
		return res.status(authResult).json({ error: authResult.error });
	}

	const user = authResult.user;

	const { company_name, job_title, status, application_date, notes } = req.body;

	if (!company_name || !job_title || !status) {
		return res
			.status(400)
			.json({ error: "company_name, job_title, status are required" });
	}

	const { data, error } = await supabase
		.from("jobs")
		.insert({
			user_id: user.id,
			company_name,
			job_title,
			status,
			application_date,
			notes,
		})
		.select()
		.single();

	if (error) {
		console.log("Database error:", error);
		return res.status(500).json({
			error: "Failed to create job",
		});
	}

	res.status(201).json({ messgae: "Job created successfully", job: data });
}

export async function getAllJobs(req, res, supabase) {
	const authResult = await authenticateUser(req, supabase);

	if (authResult.error) {
		return res.status(authResult.status).json({ error: authResult.error });
	}

	const user = authResult.user;

	const { data, error } = await supabase
		.from("jobs")
		.select("*")
		.eq("user_id", user.id);

	if (error) {
		console.log("Database error:", error);
		return res.status(500).json({ error: "Failed to  jobs" });
	}

	res.status(200).json({ message: "Jobs retrieved successfully", jobs: data });
}

export async function getJobById(req, res, supabase) {
	const authResult = await authenticateUser(req, supabase);

	if (authResult.error) {
		return res.status(authResult.status).json({ error: authResult.error });
	}

	const user = authResult.user;

	try {
		const { id } = req.params;

		console.log("Fetching job:", id, "for user:", user.id);

		const { data, error } = await supabase
			.from("jobs")
			.select("*")
			.eq("id", id)
			.eq("user_id", user.id)
			.single();

		if (error) {
			console.error("Supabase error:", error);
			throw error;
		}

		if (!data) {
			return res.status(404).json({ error: "Job not found" });
		}

		console.log("Job found", data);
		res.json({
			job: data,
		});
	} catch (error) {
		console.error("Error fetching job:", error);
		res.status(500).json({
			error: "Failed to fetch job",
		});
	}
}

export async function updateJob(req, res, supabase) {
	const jobId = req.params.id;

	const authResult = await authenticateUser(req, supabase);

	if (authResult.error) {
		return res.status(authResult.status).json({ error: authResult.error });
	}

	const user = authResult.user;

	const { company_name, job_title, status, application_date, notes } = req.body;

	const { data, error } = await supabase
		.from("jobs")
		.update({
			company_name,
			job_title,
			status,
			application_date,
			notes,
		})
		.eq("id", jobId)
		.eq("user_id", user.id)
		.select()
		.single();

	if (error) {
		console.log("Udate error:", error);
		return res.status(500).json({
			error: "Failed to update job",
		});
	}

	if (!data) {
		return res.status(404).json({
			error: "Job not found or you don't have permission to update it",
		});
	}

	res.status(200).json({
		message: "Job updated successfully",
		job: data,
	});
}

export async function deleteJob(req, res, supabase) {
	const jobId = req.params.id;

	const authResult = await authenticateUser(req, supabase);

	if (authResult.error) {
		return res.status(authResult.status).json({ error: authResult.error });
	}

	const user = authResult.user;

	const { error } = await supabase
		.from("jobs")
		.delete()
		.eq("id", jobId)
		.eq("user_id", user.id);

	if (error) {
		console.log("Delete error:", error);
		return res.status(500).json({ error: "Failed to delete job" });
	}

	res.status(200).json({
		message: "Job deleted successfully",
	});
}
