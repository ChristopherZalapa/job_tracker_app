import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "../components/Signup";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import AddJob from "../components/AddJob";
import EditJob from "../components/EditJob";

export default function App() {
	return (
		<Routes>
			<Route path='/signup' element={<SignUp />} />
			<Route path='/login' element={<Login />} />
			<Route path='/jobs' element={<Dashboard />} />
			<Route path='/jobs/new' element={<AddJob />} />
			<Route path='/jobs/:id/edit' element={<EditJob />} />
			<Route path='/' element={<Navigate to='/login' />} />
		</Routes>
	);
}
