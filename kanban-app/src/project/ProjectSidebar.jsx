import React, { useState, useEffect } from 'react';
import { useProjectData, useUI } from '../hooks';
import './ProjectSidebar.scss';

const ProjectSidebar = () => {
	const { getProjectList, projectList, getProjectInfo, projectDetails } = useProjectData();
	const { showSidebar, toggleSidebar } = useUI();
	useEffect(() => {
		getProjectList();
	}, []);

	const [searchItem, setSearchItem] = useState('');
	const searchHandler = (event) => {
		setSearchItem(event.target.value);
	};
	const clearFilter = () => setSearchItem('');
	return (
		<aside className='project__sidebar' style={{ left: showSidebar ? 0 : '-215px' }}>
			<div className='search'>
				<div className='has-icon-right'>
					<input
						type='text'
						className='form-input'
						placeholder='Search Projects...'
						onChange={searchHandler}
						value={searchItem}
					/>
					<span className='form-icon material-symbols-outlined' onClick={clearFilter} title='Clear filter'>
						close
					</span>
				</div>

				<span
					title={showSidebar ? 'Hide' : 'Show'}
					role='button'
					onClick={toggleSidebar}
					className='material-symbols-outlined expand__collapse'
					style={{ marginLeft: !showSidebar ? '-9px' : 'auto' }}
				>
					{showSidebar ? 'arrow_back_ios' : 'arrow_forward_ios'}
				</span>
			</div>
			<div className='project__list'>
				{projectList
					?.filter((item) => item.name.toLowerCase().includes(searchItem.toLowerCase()))
					?.map((filteredItem) => (
						<p
							style={{
								cursor: 'pointer',
								color: filteredItem._id === projectDetails._id ? 'red' : 'white',
							}}
							onClick={() => getProjectInfo(filteredItem._id)}
							key={filteredItem._id}
						>
							{filteredItem.name}
						</p>
					))}
			</div>
		</aside>
	);
};

export default ProjectSidebar;
