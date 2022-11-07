import React, { Fragment } from 'react';
import './TaskCard.scss';
import Icon from '../common/Icon';
import { useProjectData } from '../hooks';

const TaskCard = ({ taskItem, onEditIconClick, onDeleteIconClick, isEditing, changeHandler, onEditSubmit, style }) => {
	const { isProjectShared } = useProjectData();

	return (
		<div className='task-card' style={{ ...style }}>
			{isEditing && !isProjectShared ? (
				<div className='edit__task'>
					<input onChange={changeHandler} defaultValue={taskItem} />
					<Icon className='saveChanges__icon' type='Done' onClick={onEditSubmit} tooltip={'Save Changes'} />
				</div>
			) : (
				<span style={{ marginRight: 18 }} className='task__item'>
					{taskItem}
				</span>
			)}
			{!isProjectShared && (
				<Fragment>
					<Icon
						type={isEditing ? 'Close' : 'Edit'}
						className={'edit__icon'}
						onClick={onEditIconClick}
						tooltip={isEditing ? 'Discard' : 'Edit'}
					/>
					<Icon type='Delete' className={'delete__icon'} onClick={onDeleteIconClick} tooltip={'Delete Task'} />
				</Fragment>
			)}
		</div>
	);
};

export default TaskCard;
