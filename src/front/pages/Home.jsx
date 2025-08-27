import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import {SignUpForm, LoginForm} from "../components/authentification.jsx"

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()


	return (
		<div className="text-center mt-5">
			<div>
				<h1>Sign Up</h1>
				<SignUpForm/>
				<h1>Login</h1>
				<LoginForm/>
			</div>
		</div>
	);
}; 