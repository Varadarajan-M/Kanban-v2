import React, { useState, useMemo, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectData } from '../hooks';
import { isArrayEmpty } from '../lib';
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
	const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
	const [shareModalOpen, setShareModalOpen] = useState(false);

	const {
		authState: {
			user: { username },
		},
		clearAuthState,
	} = useAuth();
	const { saveState, saveChanges, projectDetails, projectList, removeProject, isProjectShared, setIsProjectShared } =
		useProjectData();
	const navigate = useNavigate();

	const closeAddProjectModal = () => setAddOpen(false);
	const openAddProjectModal = () => setAddOpen(true);

	const closeEditProjectModal = () => setEditOpen(false);
	const openEditProjectModal = () => setEditOpen(true);

	const openAvatarMenu = () => setAvatarClicked(true);
	const closeAvatarMenu = () => setAvatarClicked(false);

	const openMoreOptions = useCallback(() => setMoreOptionsOpen(true), []);
	const closeMoreOptions = useCallback(() => setMoreOptionsOpen(false), []);

	const isSaveDisabled = saveState === 'disabled';
	const isSaving = saveState === 'saving';

	const closeShareProjectModal = () => setShareModalOpen(false);
	const openShareProjectModal = () => setShareModalOpen(true);
	const toggleShareProjectModal = () => setShareModalOpen(!shareModalOpen);

	const deleteProject = () => {
		if (window.confirm('Are you sure you want to delete this project')) {
			removeProject();
			closeMoreOptions();
		}
		return;
	};

	const haveNoProjects = useMemo(() => isArrayEmpty(projectList), [projectList]);
	const changeProjectType = (e) => {
		if (!isSaveDisabled) {
			if (window.confirm('Your changes are not saved. Do you want to save and switch to Shared Projects?')) {
				saveChanges();
			} else return;
		}
		e.target.value !== 'My Projects' ? setIsProjectShared(true) : setIsProjectShared(false);
	};

	return (
		<Fragment>
			<div className='navbar__wrapper'>
				<nav className='navbar'>
					<select onChange={changeProjectType} className='custom-select'>
						<option value='My Projects'>My Projects</option>
						<option value='Shared Projects'>Shared Projects</option>
					</select>
					<span className='username hide-md'>{username ?? 'User'} / Kanban App</span>

					<div className='nav__buttons'>
						{!isProjectShared && (
							<Fragment>
								<button className='btn new-project' onClick={openAddProjectModal}>
									New <span className='p hide-md'>Project</span>
								</button>
								{!haveNoProjects ? (
									<>
										<Icon
											className='text-light edit'
											type={'edit_document'}
											tooltip='Edit Project'
											onClick={openEditProjectModal}
										/>{' '}
										<Icon
											className='text-light delete'
											type={'delete'}
											tooltip='Delete Project'
											onClick={deleteProject}
										/>
										{/* More options Menu only to be visible on smaller screens */}
										<MenuContainer className='more-options-menu'>
											<Icon
												className='text-light more-options'
												type={'more_vert'}
												tooltip='More Options'
												onClick={openMoreOptions}
											/>
											{moreOptionsOpen ? (
												<Menu
													style={{ margin: '16px 0 0 -62px' }}
													onBlur={() => setTimeout(closeMoreOptions, 200)}
												>
													<MenuItem onClick={openEditProjectModal}>Edit Project</MenuItem>
													<MenuItem onClick={deleteProject}>Delete Project</MenuItem>
													<MenuItem onClick={openShareProjectModal}>Share Project</MenuItem>
												</Menu>
											) : (
												''
											)}
										</MenuContainer>
										<div className='nav__save_btn d-flex'>
											<Icon
												className='text-light save-icon'
												disabled={isSaveDisabled || isSaving}
												type={'save'}
												tooltip='Save Changes'
												onClick={saveChanges}
											/>
											<button
												disabled={isSaveDisabled || isSaving}
												className='save-btn'
												onClick={saveChanges}
											>
												Save
											</button>
										</div>
									</>
								) : (
									''
								)}
							</Fragment>
						)}
						<MenuContainer className={haveNoProjects ? 'ml-2' : ''}>
							<Avatar onClick={openAvatarMenu} text={username} />
							{avatarClicked ? (
								<Menu style={{ margin: '16px 0px 0px -34px' }} onBlur={() => setTimeout(closeAvatarMenu, 100)}>
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

				<Modals.ShareProjectModal
					open={shareModalOpen}
					onBackdropClick={closeShareProjectModal}
					title={`Share ${projectDetails?.name}`}
					primaryButton={'Share'}
					secondaryButton={'Discard'}
					onSecondaryClick={closeShareProjectModal}
				/>
			</div>
			{!isProjectShared ? <Icon onClick={toggleShareProjectModal} className={'shareIcon'} type={'share'} /> : ''}
		</Fragment>
	);
};

export default Navbar;
