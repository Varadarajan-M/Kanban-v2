import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectData } from '../hooks';
import Modals from '../project/ProjectModals';
import { useAuth } from '../context/AuthContext';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';
import { Menu, MenuContainer, MenuItem } from '../common/Menu';
import './Navbar.scss';

const Navbar = () => {
	const [addOpen, setAddOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [avatarClicked, setAvatarClicked] = useState(false);

	const openAvatarMenu = () => setAvatarClicked(true);
	const closeAvatarMenu = () => setAvatarClicked(false);

	const {
		authState: {
			user: { username },
		},
		clearAuthState,
	} = useAuth();
	const { saveState, saveChanges, projectDetails, removeProject } = useProjectData();
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
					<Icon className='text-light' type={'edit_document'} tooltip='Edit Project' onClick={openEditProjectModal} />{' '}
					<Icon className='text-light' type={'delete'} tooltip='Delete Project' onClick={removeProject} />
					<div className='nav__save_btn d-flex'>
						<Icon
							className='text-light'
							disabled={isSaveDisabled || isSaving}
							type={'save'}
							tooltip='Save Changes'
							onClick={saveChanges}
						/>
					</div>
					<MenuContainer>
						<Avatar onClick={openAvatarMenu} text={username} />
						{avatarClicked ? (
							<Menu onBlur={closeAvatarMenu}>
								<MenuItem
									onClick={() => {
										clearAuthState();
										navigate('/', { replace: true });
									}}
								>
									Log out{' '}
								</MenuItem>
							</Menu>
						) : (
							''
						)}
					</MenuContainer>
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
				title={`Edit ${projectDetails?.name}`}
				primaryButton={'Update'}
				secondaryButton={'Discard'}
				onSecondaryClick={closeEditProjectModal}
				defaultValues={{ name: projectDetails?.name }}
			/>
		</div>
	);
};

export default Navbar;
