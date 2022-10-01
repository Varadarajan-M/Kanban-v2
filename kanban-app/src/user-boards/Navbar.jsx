import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardData } from '../context/BoardDataContext';
import { useAuth } from './../context/AuthContext';

import './Navbar.scss';

const Navbar = () => {
	const {
		authState: {
			user: { username },
		},
		clearAuthState,
	} = useAuth();
	const { saveState, saveChanges } = useBoardData();
	const navigate = useNavigate();

	const isSaveDisabled = saveState === 'disabled';
	const isSaving = saveState === 'saving';
	return (
		<div className='navbar__wrapper'>
			<div className='title'>
				<span>{username ?? 'User'} / Kanban App</span>
			</div>
			<nav className='navbar'>
				<select className='custom-select'>
					<option value='My Projects'>My Projects</option>
					<option value='Shared Projects'>Shared Projects</option>
				</select>

				<div className='nav__buttons'>
					<div className='nav__save_btn'>
						<button disabled={isSaveDisabled || isSaving} onClick={saveChanges}>
							{isSaving ? 'Saving' : 'Save'}
						</button>
					</div>
					<button
						onClick={() => {
							clearAuthState();
							localStorage.clear();
							navigate('/');
						}}
					>
						Logout
					</button>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
