import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../src/api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await api.post("/auth/login", {
				email,
				password,
			});

			console.log("Login successful!", response.data);

			// Save token to localStorage
			localStorage.setItem("token", response.data.token);

			// Save user to localStorage (optional)
			localStorage.setItem("user", JSON.stringify(response.data.user));

			// Redirect to dashboard
			navigate("/jobs");
		} catch (err) {
			console.error("Login error:", err);
			setError(err.response?.data?.error || "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
			<div className='bg-white rounded-2xl shadow-xl p-8 w-full max-w-md'>
				<h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome Back</h1>

				{error && <ErrorMessage message={error} />}

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Email
						</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Password
						</label>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className='mt-6 text-center text-gray-600'>
					Don't have an account?{" "}
					<Link
						to='/signup'
						className='text-indigo-600 hover:text-indigo-700 font-medium'
					>
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
