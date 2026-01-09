import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../src/api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

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

			// Needed to keep user logged in!!!
			localStorage.setItem("token", response.data.session.access_token);
			localStorage.setItem("user", JSON.stringify(response.data.user));

			navigate("/jobs/");
		} catch (err) {
			const errorMessage =
				err.response?.data?.error || "Login failed. Please try again.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className='min-h-screen flex items-center justify-center
        bg-linear-to-br from-blue-50 to-indigo-100'
		>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
					Welcome Back
				</h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Email
						</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={handleEmailChange}
							required
							className='w-full px-4 py-2 border border-gray-300
                            rounded-lg focus:ring-2 focus:ring-indigo-300
                            focus:border-transparent outline-none transition'
							placeholder='you@example.com'
						/>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Password
						</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={handlePasswordChange}
							required
							className='w-full px-4 py-2 border border-gray-300
                            rounded-lg focus:ring-2 focus:ring-indigo-300
                            focus:border-transparent outline-none transition'
							placeholder='••••••••'
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

					<button
						type='submit'
						disabled={loading}
						className='w-full bg-indigo-400 text-white py-2 px-4
                        rounded-lg font-medium hover:bg-indigo-500
                        focus:ring-4 focus:ring-indigo-200 transition
                        disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{loading ? "Logging In..." : "Login"}
					</button>
				</form>

				<p className='text-center text-gray-600 mt-6'>
					Don't have an account?{" "}
					<Link
						to='/signup'
						href='#'
						className='text-blue-600 hover:text-blue-700 font-medium'
					>
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
