import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../src/api/axios";
import LoadingSpinner from "./LoadingSpinner";

export default function EditJob() {
	const [companyName, setCompanyName] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [status, setStatus] = useState("");
	const [applicationDate, setApplicationDate] = useState("");
	const [notes, setNotes] = useState("");

	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const [fetchingJob, setFetchingJob] = useState(true);

	const navigate = useNavigate();

	const { id } = useParams();

	const handleCompanyNameChange = (e) => {
		setCompanyName(e.target.value);
	};

	const handleJobTitleChange = (e) => {
		setJobTitle(e.target.value);
	};

	const handleApplicationDateChange = (e) => {
		setApplicationDate(e.target.value);
	};
	const handleStatusChange = (e) => {
		setStatus(e.target.value);
	};

	const handleNotesChange = (e) => {
		setNotes(e.target.value);
	};

	const handleCancel = () => {
		navigate("/jobs");
	};

	useEffect(() => {
		const fetchJob = async () => {
			try {
				const token = localStorage.getItem("token");

				if (!token) {
					setError("Please login first");
					setFetchingJob(false);
					return;
				}

				const response = await api.get(`/jobs/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const job = response.data.job;

				setCompanyName(job.company_name);
				setJobTitle(job.job_title);
				setStatus(job.status);
				setApplicationDate(job.application_date || "");
				setNotes(job.notes || "");

				setFetchingJob(false);
			} catch (error) {
				console.error("Error fetching job:", error);
				setError("Failed to load job. Please try again.");
				setFetchingJob(false);
			}
		};
		fetchJob();
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess(false);
		setLoading(true);

		try {
			const token = localStorage.getItem("token");

			if (!token) {
				setError("Please login first");
				setLoading(false);
				return;
			}

			await api.put(
				`/jobs/${id}`,
				{
					company_name: companyName,
					job_title: jobTitle,
					status,
					application_date: applicationDate || null,
					notes: notes || null,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			setSuccess(true);

			setTimeout(() => {
				navigate("/jobs");
			}, 1500);
		} catch (error) {
			const errorMessage =
				error.response?.data?.error ||
				"Failed to update job. Please try again.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{fetchingJob && <LoadingSpinner message='Loading job details....' />}

			{!fetchingJob && (
				<div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4'>
					<div className='max-w-2xl mx-auto'>
						{/*Header Card*/}
						<div className='bg-white rounded-lg shadow-lg p-8 mb-6'>
							<h1 className='text-3xl font-bold text-gray-800'>
								Edit Job Application
							</h1>
							<p className='text-gray-600 mt-2'>
								Update your job application details
							</p>
						</div>

						{/*Form Card*/}
						<div className='bg-white rounded-lg shadow-lg p-8'>
							<form onSubmit={handleSubmit} className='space-y-6'>
								{/*Company Name*/}
								<div>
									<label
										htmlFor='company_name'
										className='block text-sm font-medium text-gray-700 mb-2'
									>
										Company Name
									</label>
									<input
										type='text'
										id='company_name'
										value={companyName}
										onChange={handleCompanyNameChange}
										required
										className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none transition'
										placeholder='Google'
									/>
								</div>

								{/*Job Title*/}
								<div>
									<label
										htmlFor='job_title'
										className='block text-sm font-medium text-gray-700 mb-2'
									>
										Job Title
									</label>
									<input
										id='job_title'
										type='text'
										value={jobTitle}
										required
										onChange={handleJobTitleChange}
										className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none transition'
										placeholder='Software Engineer'
									/>
								</div>

								{/*Status*/}
								<div>
									<label
										htmlFor='status'
										className='block text-sm font-medium text-gray-700 mb-2'
									>
										Status
									</label>
									<select
										id='status'
										value={status}
										required
										onChange={handleStatusChange}
										className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none transition'
									>
										<option value=''>Select status</option>
										<option value='Applied'>Applied</option>
										<option value='Interviewing'>Interviewing</option>
										<option value='Offered'>Offered</option>
										<option value='Rejected'>Rejected</option>
									</select>
								</div>

								{/*Application Date*/}
								<div>
									<label
										htmlFor='job_title'
										className='block text-sm font-medium text-gray-700 mb-2'
									>
										Application Date
									</label>
									<input
										type='date'
										id='application_date'
										className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none transition'
										value={applicationDate}
										onChange={handleApplicationDateChange}
									/>
								</div>

								{/*Notes*/}

								<div>
									<label htmlFor='notes'>Notes</label>
									<textarea
										className='w-full px-4 py-2 border border-gray-300 rounded-lg'
										id='notes'
										rows={4}
										placeholder='Additional details about this application...'
										value={notes}
										onChange={handleNotesChange}
									></textarea>
								</div>

								{error && (
									<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
										{error}
									</div>
								)}

								{success && (
									<div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg'>
										Job updated successfully!
									</div>
								)}

								<div className='flex gap-3'>
									<button
										type='submit'
										disabled={loading}
										className='flex-1 bg-indigo-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-500'
									>
										{loading ? "Updating Job..." : "Update job"}
									</button>
									<button
										type='button'
										onClick={handleCancel}
										className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition'
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
