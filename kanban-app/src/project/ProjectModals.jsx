import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { useKeyboardNavigation, useLog, useProjectData } from '../hooks';
import { isNotFalsy, isStrFalsy, isStrEmpty } from '../lib';
import { ProjectForm } from './ProjectForm';
import Icon from '../common/Icon';

// HOC which provides the project details
const withProjectDetails = (Component) => {
	return (props) => {
		const [project, setProject] = useState({ name: '' });

		useEffect(() => {
			if (isNotFalsy(props.defaultValues?.name)) setProject({ name: props.defaultValues.name });
		}, [props.defaultValues?.name]);

		const changeHandler = (e) => setProject((p) => ({ ...p, [e.target.name]: e.target.value }));

		const clearValue = (key) => setProject((p) => ({ ...p, [key]: '' }));

		return <Component project={project} clearValue={clearValue} changeHandler={changeHandler} {...props} />;
	};
};

const AddProjectModal = ({ project, clearValue, changeHandler, ...restProps }) => {
	const { addProject } = useProjectData();
	const onAdd = () => {
		isStrFalsy(project?.name) ? addProject({}) : addProject(project);
		clearValue('name');
		restProps.onBackdropClick();
	};
	const modalProps = { ...restProps, onPrimaryClick: onAdd };
	return (
		<Modal {...modalProps}>
			<ProjectForm value={project} onChange={changeHandler} />
		</Modal>
	);
};

const EditProjectModal = ({ project, clearValue, changeHandler, ...restProps }) => {
	const { editProject } = useProjectData();
	const onEdit = () => {
		editProject(project);
		clearValue('name');
		restProps.onBackdropClick();
	};
	const modalProps = { ...restProps, onPrimaryClick: onEdit };
	return (
		<Modal {...modalProps}>
			<ProjectForm value={project} onChange={changeHandler} />
		</Modal>
	);
};
const ShareProjectModal = (props) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [sharedUsers, setSharedUsers] = useState(props.sharedUsers ?? []);
	const [suggestions, setSuggestions] = useState([]);
	const itemRef = useRef(null);

	const DEMO_USERS = [
		{
			id: 1,
			username: 'joey',
			email: 'joey@gmail.com',
		},
		{
			id: 2,
			username: 'ross',
			email: 'ross@gmail.com',
		},
		{ id: 3, username: 'phoebe', email: 'phoebe@gmail.com' },
		{ id: 4, username: 'mike', email: 'mike@gmail.com' },
		{ id: 5, username: 'chandler', email: 'chandler@gmail.com' },
	];

	const searchHandler = (e) => {
		const { value } = e.target;
		setSearchTerm((v) => value);

		// API call to search
		setSuggestions((_) => DEMO_USERS.filter((u) => u.username?.toLowerCase().includes(value.toLowerCase())));
	};

	const clearSearchTerm = () => setSearchTerm('');
	const onSelection = (idx) => {
		!sharedUsers.find((s) => suggestions[idx].id === s.id) && setSharedUsers((users) => [...users, suggestions[idx]]);
		clearSearchTerm();
		setSuggestions([]);
	};

	const onEnter = (idx) => suggestions.find((s) => searchTerm === s.username) && onSelection(idx);
	const [cursor, keyDownHandler] = useKeyboardNavigation({ onEnter: onEnter, dataset: suggestions });

	useEffect(() => {
		if (!!suggestions.length && cursor !== -1 && cursor < suggestions.length) {
			setSearchTerm(suggestions[cursor]?.username);
			itemRef.current?.scrollIntoView();
		}
	}, [cursor, suggestions]);

	useEffect(() => {
		props.open ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'auto');
	}, [props.open]);

	useEffect(() => {
		isStrEmpty(searchTerm) && setSuggestions([]);
	}, [searchTerm]);

	const removeSharedUser = (idx) => setSharedUsers((users) => users.filter((_, i) => i !== idx));

	return (
		<div className='shareProjectModal'>
			<Modal {...props}>
				<div className='search-box'>
					<label htmlFor='search'>Share with</label>
					<div className='input-wrapper'>
						<input
							onKeyDown={keyDownHandler}
							onChange={searchHandler}
							value={searchTerm}
							type='text'
							id='search'
							className='form-input'
							autoComplete='off'
							placeholder='Start typing the username...'
						/>
						<Icon tooltip={'Clear '} onClick={clearSearchTerm} type='close' />
					</div>

					<div className='suggestions'>
						{suggestions.map((suggestion, i) => (
							<p
								onClick={() => onSelection(i)}
								ref={i === cursor ? itemRef : null}
								key={i}
								style={{ paddingBlock: '10px', paddingLeft: '8px', background: i === cursor ? 'black' : '' }}
							>
								{' '}
								{suggestion.username}{' '}
							</p>
						))}
					</div>
				</div>
				{!!!suggestions.length && !!sharedUsers.length && (
					<div className='chip-input-container'>
						<div>
							{sharedUsers.map((user, i) => (
								<span key={i} className='chip'>
									{user.username} <span className='btn btn-clear' onClick={() => removeSharedUser(i)}></span>
								</span>
							))}
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default {
	AddProjectModal: withProjectDetails(AddProjectModal),
	EditProjectModal: withProjectDetails(EditProjectModal),
	ShareProjectModal,
};
