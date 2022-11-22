import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import './entry.scss';
import { signup, isResOk } from './../api/helper';

const Signup = () => {
	const [isProcessingReq, setIsProcessingReq] = useState(false);
	const navigate = useNavigate();

	const onSignup = async (userCreds) => {
		setIsProcessingReq(true);
		const res = await signup(userCreds);
		setIsProcessingReq(false);
		if (isResOk(res)) {
			alert('User Registration Success');
			navigate('/login');
			return;
		}
		alert(res?.error?.message ?? 'Something went wrong');
	};
	return (
		<div className='container'>
			<h3 className='title'> Kanban App</h3>
			<div className='wrapper'>
				<AuthForm
					isProcessingReq={isProcessingReq}
					mode='signup'
					onSubmit={onSignup}
				/>
				<div className='login-redirect'>
					<span>
						Already have an account? <Link to='/login'>Sign in</Link>
					</span>
				</div>
			</div>
		</div>
	);
};

export default Signup;
