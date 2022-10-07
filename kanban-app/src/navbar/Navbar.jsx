import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectData } from '../hooks';
import Modals from '../project/ProjectModals';
import { useAuth } from '../context/AuthContext';

import './Navbar.scss';

const Navbar = () => {
	const [addOpen, setAddOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);

	const {
		authState: {
			user: { username },
		},
		clearAuthState,
	} = useAuth();
	const { saveState, saveChanges, projectDetails } = useProjectData();
	const navigate = useNavigate();

	const closeAddProjectModal = () => setAddOpen(false);
	const openAddProjectModal = () => setAddOpen(true);

	const closeEditProjectModal = () => setEditOpen(false);
	const openEditProjectModal = () => setEditOpen(true);

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
					<button className='btn btn-success' onClick={openAddProjectModal}>
						New
					</button>
					<button className='btn btn-success' onClick={openEditProjectModal}>
						Edit
					</button>
					<div className='nav__save_btn'>
						<button disabled={isSaveDisabled || isSaving} onClick={saveChanges}>
							{isSaving ? 'Saving' : 'Save'}
						</button>
					</div>
					<button
						onClick={() => {
							clearAuthState();
							navigate('/', { replace: true });
						}}
					>
						Logout
					</button>
				</div>
			</nav>

			<Modals.AddProjectModal
				open={addOpen}
				onBackdropClick={closeAddProjectModal}
				title={'Create Project'}
				primaryButton={'Create'}
				secondaryButton={'Discard'}
				onSecondaryClick={closeAddProjectModal}
			/>
			<Modals.EditProjectModal
				open={editOpen}
				onBackdropClick={closeEditProjectModal}
				title={`Edit ${projectDetails.name}`}
				primaryButton={'Update'}
				secondaryButton={'Discard'}
				onSecondaryClick={closeEditProjectModal}
				defaultValues={{ name: projectDetails.name }}
			/>
		</div>
	);
};

export default Navbar;
