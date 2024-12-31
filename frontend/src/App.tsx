import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import { SignUp } from './components/Signup';
import UserProvider from './context/UserContext';
import { SignIn } from './components/Signin';
import Landing from './components/Landing';

export interface User {
	accessToken: string;
	username: string;
	id: string;
}

export default function App() {
	const router = createBrowserRouter([
		{
			path: "/signup",
			element: <SignUp />,
		},
		{
			path: "/signin",
			element: <SignIn />,
		},
		{
			path: "/",
			element: <Landing />
		}
	]);

	return (
		<>
			<UserProvider>
				<RouterProvider router={router} />
			</UserProvider>
		</>
	);

}
