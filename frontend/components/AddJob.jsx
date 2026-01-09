import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../src/api/axios";


export default function AddJob() {
	const [companyName, setCompanyName] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [status, setStatus] = useState("");
	const [applicationDate, setApplicationDate] = useState("");
	const [notes, setNotes] = useState("");

	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleCompanyNameChange = (e) => {
		setCompanyName(e.target.value);
	};

	const handleJobTitleChange = (e) => {
		setJobTitle(e.target.value);
	};

	const handleStatusChange = (e) => {
		setStatus(e.target.value);
	};

	const handleApplicationDateChange = (e) => {
		setApplicationDate(e.target.value);
	};

	useEffect(() => {
		if (success) {
			const timer = setTimeout(() => {
				setSuccess(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [success]);

	const handleNotesChange = (e) => {
		setNotes(e.target.value);
	};

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

			const response = await api.post(
				"/jobs",
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

			console.log("Job created successfully!", response.data);

			setSuccess(true);

			setCompanyName("");
			setJobTitle("");
			setStatus("");
			setApplicationDate("");
			setNotes("");

			setTimeout(() => {
				navigate("/jobs");
			}, 1500);
		} catch (err) {
			const errorMessage =
				err.response?.data?.error || "Failed to create job. Please try again.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100
            py-12 px-4'
		>
			<div className='max-w-2xl mx-auto'>
				<div className='bg-white rounded-lg shadow-lg p-8 mb-6'>
					<h1 className='text-3xl font-bold text-gray-800 text-center'>
						Add New Job Application
					</h1>
					<p className='text-gray-600 mt-2 text-center'>
						Track your job application progress
					</p>
				</div>

				<div className='bg-white rounded-lg shadow-lg p-8'>
					<form onSubmit={handleSubmit} className='space-y-6'>
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
								className='w-full px-4 py-2 border border-gray-300
                                rounded-lg focus:ring-2 focus:ring-indigo-300
                                focus:border-transparent outline-none transition'
								placeholder='Google'
							/>
						</div>

						<div>
							<label
								htmlFor='job_title'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Job Title
							</label>
							<input
								type='text'
								id='job_title'
								value={jobTitle}
								onChange={handleJobTitleChange}
								required
								className='w-full px-4 py-2 border border-gray-300
                                rounded-lg focus:ring-2 focus:ring-indigo-300
                                focus:border-transparent outline-none transition'
								placeholder='Software Engineer'
							/>
						</div>

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
								onChange={handleStatusChange}
								required
								className='w-full px-4 py-2 border border-gray-300
                                rounded-lg focus:ring-2 focus:ring-indigo-300
                                focus:border-transparent outline-none transition
                                bg-white'
							>
								<option value=''>Select Status</option>
								<option value='Applied'>Applied</option>
								<option value='Interviewing'>Interviewing</option>
								<option value='Offered'>Offered</option>
								<option value='Rejected'>Rejected</option>
							</select>
						</div>

						<div>
							<label
								htmlFor='application_date'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Application Date
							</label>
							<input
								type='date'
								id='application_date'
								value={applicationDate}
								onChange={handleApplicationDateChange}
								className='w-full px-4 py-2 border border-gray-300
                                rounded-lg focus:ring-2 focus:ring-indigo-300
                                focus:border-transparent outline-none transition'
							/>
						</div>

						<div>
							<label
								htmlFor='notes'
								className='block text-sm font-medium text-gray-700 mb-2'
							>
								Notes
							</label>
							<textarea
								id='notes'
								rows='4'
								value={notes}
								onChange={handleNotesChange}
								className='w-full px-4 py-2 border border-gray-300
                                rounded-lg focus:ring-2 focus:ring-indigo-300
                                focus:border-transparent outline-none transition
                                resize-none'
								placeholder='Additional details about this application...'
							/>
						</div>

						{error && (
							<div
								className='bg-red-50 border border-red-200 text-red-700
                px-4 py-3 rounded-lg'
							>
								{error}
							</div>
						)}

						{success && (
							<div
								className='bg-green-50 border border-green-200 text-green-700
                px-4 py-3 rounded-lg transition-opacity duration-500 animate-bounce'
							>
								Job added successfully!
							</div>
						)}

						<button
							type='submit'
							disabled={loading}
							className='w-full bg-indigo-400 text-white py-2 px-4
                rounded-lg font-medium hover:bg-indigo-500
                focus:ring-4 focus:ring-indigo-200 transition
                disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{loading ? "Adding Job..." : "Add Job"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
