import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useKeyboardNavigation, useProjectData, useUI } from '../hooks';
import { isArrayEmpty } from '../lib';
import './ProjectSidebar.scss';

const ProjectSidebar = () => {
	const [searchItem, setSearchItem] = useState('');
	const { getProjectList, projectList, projectDetails, switchProject, isProjectShared } = useProjectData();
	const { showSidebar, toggleSidebar, closeSidebar, openSidebar } = useUI();
	const projectItemRef = useRef(null);

	const inputRef = useRef(null);

	const searchHandler = (event) => {
		setSearchItem(event.target.value);
		setCursor(-1);
	};
	const clearFilter = () => {
		setSearchItem('');
		inputRef.current.value = '';
	};

	const filteredList = useMemo(
		() => projectList?.filter((item) => item.name?.toLowerCase().includes(searchItem?.toLowerCase())),
		[projectList, searchItem],
	);

	const haveNoProjects = useMemo(() => isArrayEmpty(projectList), [projectList]);

	useEffect(() => {
		!haveNoProjects && openSidebar();
	}, [haveNoProjects]);

	const onSelect = (index) => {
		switchProject(filteredList[index]?._id);
		setCursor(-1);
		clearFilter();
	};
	const [cursor, setCursor, keyDownHandler] = useKeyboardNavigation({ onEnter: onSelect, dataset: filteredList });

	useEffect(() => {
		if (cursor > -1 && inputRef?.current) {
			inputRef.current.value = filteredList[cursor]?.name ?? '';
		}
	}, [cursor]);

	useEffect(() => {
		getProjectList?.();
	}, [isProjectShared]);

	useEffect(() => {
		if (!!filteredList.length && cursor !== -1 && cursor < filteredList.length) {
			projectItemRef.current?.scrollIntoView();
		}
	}, [cursor, filteredList]);

	return (
		<aside className='project__sidebar' style={{ left: showSidebar ? 0 : '-215px' }}>
			<div className='search'>
				<div className='has-icon-right'>
					<input
						ref={inputRef}
						type='text'
						className='form-input'
						placeholder='Search Projects...'
						onKeyDown={keyDownHandler}
						onChange={searchHandler}
						value={searchItem}
					/>
					<i onClick={clearFilter} title='Clear filter' className='form-icon icon icon-close'></i>
				</div>
				<span
					title={showSidebar ? 'Hide' : 'Show'}
					role='button'
					onClick={!haveNoProjects ? toggleSidebar : closeSidebar}
					className='material-symbols-outlined expand__collapse mt-2'
					style={{ marginLeft: !showSidebar ? '-9px' : 'auto' }}
				>
					{showSidebar ? 'arrow_back_ios' : 'arrow_forward_ios'}
				</span>
			</div>
			<div className='project__list' style={{ paddingRight: 3 }}>
				{!isArrayEmpty(filteredList) ? (
					filteredList.map((filteredItem, idx) => (
						<p
							ref={idx === cursor ? projectItemRef : null}
							style={{
								color: idx === cursor ? '#4ea1ff' : '',
								fontWeight: idx === cursor ? 'bold' : 'normal',
								transform: idx === cursor ? 'scale(1.01)' : '',
							}}
							className={showSidebar && filteredItem._id === projectDetails._id ? 'active' : 'inactive'}
							onClick={() => onSelect(idx)}
							key={filteredItem._id}
						>
							{filteredItem.name}
						</p>
					))
				) : (
					<div
						style={{
							textAlign: 'center',
							fontSize: '14px',
							fontWeight: '100',
							letterSpacing: '1.22px',
							paddingTop: '50px',
						}}
					>
						<p style={{ opacity: 0.68 }}> No Projects Available... </p>
					</div>
				)}
			</div>
		</aside>
	);
};

export default ProjectSidebar;
