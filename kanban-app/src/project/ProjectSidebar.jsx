import React, { useState } from 'react';
import { useBoardData } from '../context/BoardDataContext';
import './ProjectSidebar.scss';

const ProjectSidebar = () => {
	const { show, setShow } = useBoardData();
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

			<span>Sidebar </span>
			<span>Sidebar </span>
			<span>Sidebar </span>
			<span>Sidebar </span>
			<span>Sidebar </span>
			<span>Sidebar </span>
			<span>Sidebar </span>
		</aside>
	);
};

export default ProjectSidebar;
