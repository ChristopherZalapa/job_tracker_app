import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../src/api/axios";

export default function Signup() {
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
			const response = await api.post("/auth/signup", {
				email,
				password,
			});

			console.log("Signup successful!", response.data);

			setEmail("");
			setPassword("");
			navigate("/login");
		} catch (error) {
			const errorMessage =
				error.response?.data?.error || "Signup failed. Please try again";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
					Create Account
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
							className='w-full px-4 py-2 border border-gray-300
                            rounded-lg focus:ring-2 focus:ring-indigo-300
                            focus:border-transparent outline-none transition'
							placeholder='you@example.com'
							value={email}
							onChange={handleEmailChange}
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
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none transition'
							id='password'
							required
							minLength={6}
							placeholder='......'
							value={password}
							onChange={handlePasswordChange}
						/>

						{error && (
							<div
								className='bg-red-50 border border-red-200 text-red-700
                                x-4 py-3 rounded-lg'
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
                            disabled:opacity-50 disabled:cursor-not-allowed mt-6'
						>
							{loading ? "Creating Account..." : "Sign Up"}
						</button>
					</div>
				</form>

				<p className='text-center text-gray-600 mt-6'>
					Already have an account?{"   "}
					<Link
						to='/login'
						href='#'
						className='text-blue-600 hover:text-blue-700 font-medium'
					>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
