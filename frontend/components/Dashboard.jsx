import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import api from "../src/api/axios";

export default function Dashboard() {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const navigate = useNavigate();

	// Calculate stats from jobs array
	const totalJobs = jobs.length;

	const appliedCount = jobs.filter((job) => job.status === "Applied").length;

	const interviewingCount = jobs.filter(
		(job) => job.status === "Interviewing",
	).length;

	// Fetch jobs
	useEffect(() => {
		const fetchJobs = async () => {
			try {
				const token = localStorage.getItem("token");

				if (!token) {
					setError("Please login to view your jobs");
					setLoading(false);
					return;
				}

				const response = await api.get("/jobs", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				console.log("Jobs fetched:", response.data);
				setJobs(response.data.jobs);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching jobs:", error);
				const errorMessage =
					error.response?.data?.error ||
					"Failed to load jobs. Please try again.";
				setError(errorMessage);
				setLoading(false);
			}
		};

		fetchJobs();
	}, []);

	// Navigate to add job page
	const handleAddJob = () => {
		navigate("/jobs/new");
	};

	// Delete a job
	const handleDelete = async (jobId) => {
		if (
			!window.confirm("Are you sure you want to delete this job application?")
		) {
			return;
		}

		try {
			const token = localStorage.getItem("token");

			await api.delete(`/jobs/${jobId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Remove job from state
			setJobs(jobs.filter((job) => job.id !== jobId));
		} catch (error) {
			console.error("Error deleting job:", error);
			alert("Failed to delete job. Please try again.");
		}
	};

	const handleLogout = () => {
		if (!window.confirm("Are you sure you want to logout?")) {
			return;
		}

		localStorage.removeItem("token");
		localStorage.removeItem("user");

		navigate("/login");
	};

	/* Handle Edit */
	const handleEdit = (jobId) => {
		navigate(`/jobs/${jobId}/edit`);
	};

	return (
		<div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4'>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<div className='flex justify-between items-center mb-8'>
					<div>
						<h1 className='text-4xl font-bold text-gray-800'>
							My Job Applications
						</h1>
						<p className='text-gray-600 mt-2'>
							Track and manage your job search
						</p>
					</div>
					<div className='flex gap-3'>
						<button
							onClick={handleAddJob}
							className='bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-200 transition'
						>
							Add Job
						</button>
						<button
							onClick={handleLogout}
							className='bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition'
						>
							Logout
						</button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
					{/* Total Applications */}
					<div className='bg-white rounded-lg shadow p-6'>
						<div className='text-gray-500 text-sm font-medium'>
							Total Applications
						</div>
						<div className='text-3xl font-bold text-gray-800 mt-2'>
							{totalJobs}
						</div>
					</div>

					{/* Applied */}
					<div className='bg-white rounded-lg shadow p-6'>
						<div className='text-gray-500 text-sm font-medium'>Applied</div>
						<div className='text-3xl font-bold text-blue-600 mt-2'>
							{appliedCount}
						</div>
					</div>

					{/* Interviewing */}
					<div className='bg-white rounded-lg shadow p-6'>
						<div className='text-gray-500 text-sm font-medium'>
							Interviewing
						</div>
						<div className='text-3xl font-bold text-green-600 mt-2'>
							{interviewingCount}
						</div>
					</div>
				</div>

				{/* Jobs List */}
				<div className='bg-white rounded-lg shadow'>
					{/* Loading State */}
					{loading && <LoadingSpinner message='Loading your jobs...' />}

					{/* Error State */}
					{error && !loading && (
						<div className='text-center py-12'>
							<div className='text-red-400 text-6xl mb-4'>⚠️</div>
							<h3 className='text-xl font-semibold text-gray-700 mb-2'>
								{error}
							</h3>
							<button
								onClick={() => window.location.reload()}
								className='mt-4 bg-indigo-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-500 transition'
							>
								Try Again
							</button>
						</div>
					)}

					{/* Empty State With No Jobs*/}
					{!loading && !error && jobs.length === 0 && (
						<div className='text-center py-12'>
							<div className='text-gray-400 text-6xl mb-4'>📋</div>
							<h3 className='text-xl font-semibold text-gray-700 mb-2'>
								No job applications yet
							</h3>
							<p className='text-gray-500 mb-6'>
								Start tracking your job search by adding your first application
							</p>
							<button
								onClick={handleAddJob}
								className='bg-indigo-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-500 transition'
							>
								Add Your First Job
							</button>
						</div>
					)}

					{/* Jobs List */}
					{!loading && !error && jobs.length > 0 && (
						<div className='p-6 space-y-4'>
							{jobs.map((job) => (
								<div
									key={job.id}
									className='border border-gray-200 rounded-lg p-4
                    hover:shadow-md transition'
								>
									<div className='flex justify-between items-start'>
										<div className='flex-1'>
											<h3 className='text-lg font-semibold text-gray-800'>
												{job.job_title}
											</h3>
											<p className='text-gray-600'>{job.company_name}</p>
											<div className='flex gap-3 mt-2 text-sm text-gray-500'>
												{job.application_date && (
													<span>
														📅 Applied:{" "}
														{new Date(
															job.application_date,
														).toLocaleDateString()}
													</span>
												)}
											</div>
										</div>

										<div className='flex flex-col items-end gap-2'>
											<span
												className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
													job.status === "Applied"
														? "bg-blue-100 text-blue-700"
														: ""
												}
                        ${
													job.status === "Interviewing"
														? "bg-green-100 text-green-700"
														: ""
												}
                        ${
													job.status === "Offered"
														? "bg-purple-100 text-purple-700"
														: ""
												}
                        ${
													job.status === "Rejected"
														? "bg-red-100 text-red-700"
														: ""
												}`}
											>
												{job.status}
											</span>

											<div className='flex gap-2'>
												<button
													onClick={() => handleEdit(job.id)}
													className='text-gray-600 hover:text-blue-600 text-sm font-medium'
												>
													Edit
												</button>
												<button
													onClick={() => handleDelete(job.id)}
													className='text-gray-600 hover:text-red-600 text-sm font-medium'
												>
													Delete
												</button>
											</div>
										</div>
									</div>

									{job.notes && (
										<div className='mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded'>
											{job.notes}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
