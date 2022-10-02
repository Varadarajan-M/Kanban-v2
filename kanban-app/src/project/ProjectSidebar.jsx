import React, { useState, useEffect } from 'react';
import { useBoardData } from '../context/BoardDataContext';
import './ProjectSidebar.scss';

const ProjectSidebar = () => {
	const { show, setShow, getProjectList, projectList, getProjectInfo, projectDetails } = useBoardData();
	useEffect(() => {
		getProjectList();
	}, []);

	return (
		<aside className='project__sidebar' style={{ left: show ? 0 : '-215px' }}>
			<div className='search d-flex '>
				<input type='text' placeholder='search' style={{ marginRight: '15px' }} />
				<span
					title={show ? 'Hide' : 'Show'}
					role='button'
					onClick={() => setShow(!show)}
					className='material-symbols-outlined'
					style={{ cursor: 'pointer', marginLeft: !show ? '-5px' : 0 }}
				>
					{show ? 'arrow_back_ios' : 'arrow_forward_ios'}
				</span>
			</div>
			<div className='project__list'>
				{projectList?.map((item) => (
					<p
						style={{ cursor: 'pointer', color: item._id === projectDetails._id ? 'red' : 'white' }}
						onClick={() => getProjectInfo(item._id)}
						key={item._id}
					>
						{item.name}
					</p>
				))}
			</div>
			
		</aside>
	);
};

export default ProjectSidebar;
